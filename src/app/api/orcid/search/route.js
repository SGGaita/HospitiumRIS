import { NextResponse } from 'next/server';
import { searchResearchers, getResearcherDetails, getResearcherEmails } from '../../../../utils/orcidService.js';
import { getUserId } from '../../../../lib/auth-server.js';

/**
 * Search for researchers using ORCID API
 * GET /api/orcid/search?givenName=John&familyName=Smith&affiliation=University&rows=20&start=0
 * OR GET /api/orcid/search?q=query&rows=20&start=0 (legacy support)
 */
export async function GET(request) {
  try {
    // Check authentication
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Get structured search parameters
    const givenName = searchParams.get('givenName');
    const familyName = searchParams.get('familyName');
    const affiliation = searchParams.get('affiliation');
    const orcidId = searchParams.get('orcidId');
    const email = searchParams.get('email');
    
    // Legacy query parameter support
    const query = searchParams.get('q');
    
    const rows = parseInt(searchParams.get('rows')) || 20;
    const start = parseInt(searchParams.get('start')) || 0;

    let searchCriteria;
    
    // Determine if using structured search or legacy query
    if (givenName || familyName || affiliation || orcidId || email) {
      // Structured search
      searchCriteria = {
        givenName,
        familyName,
        affiliation,
        orcidId,
        email
      };
    } else if (query) {
      // Legacy string search
      searchCriteria = query;
    } else {
      return NextResponse.json(
        { error: 'At least one search parameter is required (givenName, familyName, affiliation, orcidId, email, or q)' },
        { status: 400 }
      );
    }

    // Search ORCID for researchers
    const results = await searchResearchers(searchCriteria, rows, start);

    if (results.error) {
      return NextResponse.json(
        { error: results.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error in ORCID search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get detailed researcher information by ORCID ID
 * POST /api/orcid/search with { orcidId: "0000-0000-0000-0000" }
 */
export async function POST(request) {
  try {
    // Check authentication
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { orcidId, includeEmails = false } = await request.json();

    if (!orcidId) {
      return NextResponse.json(
        { error: 'ORCID ID is required' },
        { status: 400 }
      );
    }

    // Get detailed researcher information
    const researcher = await getResearcherDetails(orcidId);
    
    // Optionally include email addresses if requested
    if (includeEmails) {
      const emails = await getResearcherEmails(orcidId);
      researcher.emails = emails;
    }

    return NextResponse.json({
      success: true,
      data: researcher
    });

  } catch (error) {
    console.error('Error fetching ORCID details:', error);
    
    if (error.message === 'Researcher not found') {
      return NextResponse.json(
        { error: 'Researcher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
