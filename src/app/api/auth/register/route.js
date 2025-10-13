import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth';
import { sendActivationEmail, generateActivationToken } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check for ORCID data from secure cookie
    let orcidData = null;
    const orcidCookie = request.cookies.get('orcid_data')?.value;
    if (orcidCookie) {
      try {
        orcidData = JSON.parse(orcidCookie);
        console.log('🔗 ORCID data found in cookie:', {
          orcidId: orcidData.orcidId,
          givenNames: orcidData.givenNames,
          familyName: orcidData.familyName
        });
      } catch (parseError) {
        console.error('Failed to parse ORCID cookie:', parseError);
      }
    }
    
    const {
      // Account type
      accountType,
      
      // Personal details
      givenName,
      familyName,
      email,
      confirmEmail,
      password,
      confirmPassword,
      
      // ORCID data
      orcidId,
      orcidGivenNames,
      orcidFamilyName,
      
      // Research details
      primaryInstitution,
      startMonth,
      startYear,
      
      // Institution details (for RESEARCH_ADMIN)
      institutionName,
      institutionType,
      institutionCountry,
      institutionWebsite,
      
      // Foundation details (for FOUNDATION_ADMIN)
      foundationName,
      foundationType,
      foundationCountry,
      foundationWebsite,
      foundationFocusArea,
      foundationDescription,
    } = body;

    // Validation
    const errors = {};
    
    // Basic validation
    if (!accountType || !['RESEARCHER', 'RESEARCH_ADMIN', 'FOUNDATION_ADMIN'].includes(accountType)) {
      errors.accountType = 'Valid account type is required';
    }
    
    if (!givenName?.trim()) {
      errors.givenName = 'Given name is required';
    }
    
    if (!familyName?.trim()) {
      errors.familyName = 'Family name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
      }
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Account type specific validation
    if (accountType === 'RESEARCHER' || accountType === 'RESEARCH_ADMIN' || accountType === 'FOUNDATION_ADMIN') {
      if (!primaryInstitution?.trim()) {
        errors.primaryInstitution = 'Primary institution is required';
      }
      if (!startMonth) {
        errors.startMonth = 'Start month is required';
      }
      if (!startYear) {
        errors.startYear = 'Start year is required';
      }
    } else {
      // For non-researchers (if any future account types)
      if (!confirmEmail) {
        errors.confirmEmail = 'Email confirmation is required';
      } else if (email !== confirmEmail) {
        errors.confirmEmail = 'Email addresses do not match';
      }
    }

    // Institution details validation for RESEARCH_ADMIN
    if (accountType === 'RESEARCH_ADMIN') {
      if (!institutionName?.trim()) {
        errors.institutionName = 'Institution name is required';
      }
      if (!institutionType) {
        errors.institutionType = 'Institution type is required';
      }
      if (!institutionCountry) {
        errors.institutionCountry = 'Country is required';
      }
    }

    // Foundation details validation for FOUNDATION_ADMIN  
    if (accountType === 'FOUNDATION_ADMIN') {
      if (!institutionName?.trim()) {
        errors.institutionName = 'Institution name is required';
      }
      if (!foundationName?.trim()) {
        errors.foundationName = 'Foundation name is required';
      }
      if (!foundationType) {
        errors.foundationType = 'Foundation type is required';
      }
      if (!foundationCountry) {
        errors.foundationCountry = 'Country is required';
      }
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors,
          message: 'Validation failed'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          errors: { email: 'An account with this email already exists' },
          message: 'User already exists'
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate activation token
    const activationToken = generateActivationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user and related records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          accountType,
          givenName: (orcidData?.givenNames || givenName).trim(),
          familyName: (orcidData?.familyName || familyName).trim(),
          email: email.toLowerCase(),
          confirmEmail: confirmEmail || null,
          passwordHash,
          emailVerifyToken: activationToken,
          emailVerifyExpires: tokenExpires,
          orcidId: orcidData?.orcidId || orcidId || null,
          orcidGivenNames: orcidData?.givenNames || orcidGivenNames || null,
          orcidFamilyName: orcidData?.familyName || orcidFamilyName || null,
          primaryInstitution: primaryInstitution?.trim() || null,
          startMonth: startMonth || null,
          startYear: startYear || null,
        }
      });

      // Create institution record for RESEARCH_ADMIN
      if (accountType === 'RESEARCH_ADMIN') {
        await tx.institution.create({
          data: {
            userId: user.id,
            name: institutionName.trim(),
            type: institutionType,
            country: institutionCountry,
            website: institutionWebsite || null,
          }
        });
      }

      // Create foundation record for FOUNDATION_ADMIN
      if (accountType === 'FOUNDATION_ADMIN') {
        await tx.foundation.create({
          data: {
            userId: user.id,
            institutionName: institutionName.trim(),
            foundationName: foundationName.trim(),
            type: foundationType,
            country: foundationCountry,
            website: foundationWebsite || null,
            focusArea: foundationFocusArea || null,
            description: foundationDescription || null,
          }
        });
      }

      return user;
    });

    // Send activation email
    let emailSent = false;
    let emailError = null;
    
    try {
      const emailResult = await sendActivationEmail(result, activationToken);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
        console.error('Failed to send activation email:', emailResult.error);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      emailError = error.message;
    }

    // Log successful registration
    await prisma.registrationLog.create({
      data: {
        email: email.toLowerCase(),
        accountType,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        userAgent: request.headers.get('user-agent') || null,
        success: true,
      }
    });

    // Return success response (don't include sensitive data)
    const response = NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Registration successful! Please check your email to activate your account.' 
        : 'Registration successful, but there was an issue sending the activation email. Please contact support.',
      user: {
        id: result.id,
        accountType: result.accountType,
        givenName: result.givenName,
        familyName: result.familyName,
        email: result.email,
        emailVerified: false,
        orcidId: result.orcidId, // Include ORCID ID if available
      },
      emailSent,
      emailError: emailSent ? null : emailError,
      nextStep: 'Please check your email and click the activation link to complete your registration.'
    }, { status: 201 });

    // Clear ORCID cookie if it was used
    if (orcidData) {
      response.cookies.delete('orcid_data');
      console.log('🧹 Cleared ORCID data cookie after successful registration');
    }

    return response;

  } catch (error) {
    console.error('Registration error:', error);

    // Log failed registration attempt
    try {
      await prisma.registrationLog.create({
        data: {
          email: body?.email || 'unknown',
          accountType: body?.accountType || 'UNKNOWN',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null,
          success: false,
          errorMessage: error.message,
        }
      });
    } catch (logError) {
      console.error('Failed to log registration attempt:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
      },
      { status: 500 }
    );
  }
}
