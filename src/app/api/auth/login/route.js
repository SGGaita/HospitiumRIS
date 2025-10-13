import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  let requestBody;
  try {
    requestBody = await request.json();
    const { email, password, rememberMe } = requestBody;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required',
          field: !email ? 'email' : 'password'
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        institution: true,
        foundation: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password',
          field: 'email'
        },
        { status: 401 }
      );
    }

    // Check if user is activated
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account not activated. Please check your email and activate your account first.',
          redirectTo: '/resend-activation',
          needsActivation: true
        },
        { status: 403 }
      );
    }

    // Check if user status is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account is suspended or inactive. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password',
          field: 'password'
        },
        { status: 401 }
      );
    }

    // Determine redirect route based on account type
    let dashboardRoute = '/dashboard'; // Default fallback
    switch (user.accountType) {
      case 'RESEARCHER':
        dashboardRoute = '/researcher';
        break;
      case 'RESEARCH_ADMIN':
        dashboardRoute = '/institution';
        break;
      case 'FOUNDATION_ADMIN':
        dashboardRoute = '/foundation';
        break;
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: {
        updatedAt: new Date(),
      }
    });

    // Log successful login
    try {
      await prisma.registrationLog.create({
        data: {
          email: user.email,
          accountType: user.accountType,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null,
          success: true,
          errorMessage: 'Login successful',
        }
      });
    } catch (logError) {
      console.error('Failed to log login attempt:', logError);
    }

    // Return successful login response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.givenName, // For compatibility
        lastName: user.familyName, // For compatibility
        givenName: user.givenName,
        familyName: user.familyName,
        orcidId: user.orcidId,
        orcidGivenNames: user.orcidGivenNames,
        orcidFamilyName: user.orcidFamilyName,
        primaryInstitution: user.primaryInstitution,
        accountType: user.accountType,
        role: user.accountType, // For compatibility
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      dashboardRoute,
      rememberMe: rememberMe || false
    }, { status: 200 });

    // Set session cookie (simple approach - in production, use proper JWT/session management)
    if (rememberMe) {
      // 30 days for "remember me"
      response.cookies.set('hospitium_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
      });
    } else {
      // Session cookie (expires when browser closes)
      response.cookies.set('hospitium_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    return response;

  } catch (error) {
    console.error('Login error:', error);

    // Log failed login attempt
    try {
      await prisma.registrationLog.create({
        data: {
          email: requestBody?.email || 'unknown',
          accountType: 'UNKNOWN',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null,
          success: false,
          errorMessage: error.message,
        }
      });
    } catch (logError) {
      console.error('Failed to log login attempt:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
