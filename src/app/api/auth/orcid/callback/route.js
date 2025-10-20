import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('🔥 ORCID API Callback - Processing authentication...');

    // Handle ORCID error responses
    if (error) {
      console.error('❌ ORCID Error:', error);
      const errorMessages = {
        'access_denied': 'You declined the ORCID authorization request.',
        'invalid_request': 'Invalid ORCID authorization request.',
        'unauthorized_client': 'Unauthorized ORCID client.',
        'unsupported_response_type': 'Unsupported ORCID response type.',
        'invalid_scope': 'Invalid ORCID scope requested.',
        'server_error': 'ORCID server error occurred.',
        'temporarily_unavailable': 'ORCID service is temporarily unavailable.'
      };
      
      const errorMessage = errorMessages[error] || 'An error occurred during ORCID authentication.';
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent(errorMessage)}`);
    }

    // Validate required parameters
    if (!code) {
      console.error('❌ No authorization code received');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Authorization code not received from ORCID')}`);
    }

    console.log('🔄 Exchanging code for ORCID token...');
    
    // Exchange code for token directly with ORCID
    const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
    const clientSecret = process.env.ORCID_CLIENT_SECRET;
    const tokenUrl = process.env.NEXT_PUBLIC_ORCID_TOKEN_URL || 'https://sandbox.orcid.org/oauth/token';
    const redirectUri = process.env.NEXT_PUBLIC_ORCID_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing ORCID credentials');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('ORCID authentication is not properly configured')}`);
    }

    // Prepare token exchange request
    const tokenRequestBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }).toString();

    // Exchange code for token with ORCID
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    const responseText = await tokenResponse.text();
    console.log('📥 ORCID token response:', {
      status: tokenResponse.status,
      ok: tokenResponse.ok,
      bodyPreview: responseText.substring(0, 200)
    });

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed:', responseText);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Failed to authenticate with ORCID')}`);
    }

    let orcidData;
    try {
      orcidData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse ORCID response:', responseText);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Invalid response from ORCID')}`);
    }

    console.log('✅ ORCID token exchange successful:', {
      orcid: orcidData.orcid,
      name: orcidData.name,
      hasToken: !!orcidData.access_token
    });

    // Check if user already exists with this ORCID ID
    const existingUser = await prisma.user.findFirst({
      where: { orcidId: orcidData.orcid },
      include: {
        institution: true,
        foundation: true,
      }
    });

    if (existingUser) {
      console.log('✅ Existing ORCID user found:', existingUser.email);
      
      // Check if user is activated
      if (!existingUser.emailVerified) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Your account is not activated. Please check your email.')}`);
      }

      // Check if user status is active
      if (existingUser.status !== 'ACTIVE') {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Your account is suspended or inactive. Please contact support.')}`);
      }

      // Update last login time
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { updatedAt: new Date() }
      });

      // Determine redirect route based on account type
      let dashboardRoute = '/dashboard'; // Default fallback
      switch (existingUser.accountType) {
        case 'RESEARCHER':
          dashboardRoute = '/researcher';
          break;
        case 'RESEARCH_ADMIN':
          dashboardRoute = '/institution';
          break;
        case 'FOUNDATION_ADMIN':
          dashboardRoute = '/foundation';
          break;
        case 'SUPER_ADMIN':
          dashboardRoute = '/super-admin';
          break;
      }

      // Log successful login
      try {
        // Get request metadata for consistent IP/UserAgent handling
        const requestMetadata = {
          ip: request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              request.headers.get('x-client-ip') ||
              '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'Unknown'
        };

        await prisma.registrationLog.create({
          data: {
            email: existingUser.email,
            accountType: existingUser.accountType,
            ipAddress: requestMetadata.ip,
            userAgent: requestMetadata.userAgent,
            success: true,
            errorMessage: 'ORCID login successful',
          }
        });
      } catch (logError) {
        console.error('Failed to log ORCID login attempt:', logError);
      }

      // Create response with user session
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${dashboardRoute}?login=success`);
      
      // Set session cookie
      response.cookies.set('hospitium_session', existingUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return response;
      
    } else {
      console.log('🔄 No existing user found, redirecting to registration with ORCID data');
      
      // Store ORCID data temporarily for registration
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/register?orcid=true`);
      
      // Store ORCID data in a secure cookie for the registration process
      response.cookies.set('orcid_data', JSON.stringify({
        orcidId: orcidData.orcid,
        givenNames: orcidData.name?.split(' ')[0] || '',
        familyName: orcidData.name?.split(' ').slice(1).join(' ') || '',
        accessToken: orcidData.access_token
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 60 // 10 minutes
      });

      return response;
    }

  } catch (error) {
    console.error('❌ ORCID callback error:', error);
    
    // Log failed login attempt
    try {
      await prisma.registrationLog.create({
        data: {
          email: 'ORCID_CALLBACK_ERROR',
          accountType: 'UNKNOWN',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null,
          success: false,
          errorMessage: `ORCID callback error: ${error.message}`,
        }
      });
    } catch (logError) {
      console.error('Failed to log ORCID callback error:', logError);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('An error occurred during ORCID authentication')}`);
  }
}


