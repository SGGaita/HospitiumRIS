import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Check for session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hospitium_session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      );
    }

    // Find user by session ID (which is the user ID in our simple implementation)
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      include: {
        institution: true,
        foundation: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    // Check if user is still active
    if (user.status !== 'ACTIVE' || !user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Account is inactive or not verified' },
        { status: 401 }
      );
    }

    // Determine dashboard route based on account type
    let dashboardRoute = '/dashboard';
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
      case 'SUPER_ADMIN':
        dashboardRoute = '/super-admin';
        break;
    }

    // Return user data (same format as login response)
    return NextResponse.json({
      success: true,
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
      dashboardRoute
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
