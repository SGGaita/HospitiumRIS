import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Check for session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hospitium_session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const currentUserId = sessionCookie.value;

    // Fetch the current user with their profile and institution
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        researchProfile: true,
        institution: true,
        foundation: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is still active
    if (currentUser.status !== 'ACTIVE' || !currentUser.emailVerified) {
      return NextResponse.json({ error: 'Account is inactive or not verified' }, { status: 401 });
    }

    // Fetch all publications where the current user is an author
    const userPublications = await prisma.publication.findMany({
      where: {
        authorRelations: {
          some: {
            userId: currentUserId
          }
        }
      },
      include: {
        authorRelations: {
          include: {
            user: {
              include: {
                researchProfile: true,
                institution: true,
                foundation: true
              }
            }
          },
          orderBy: {
            authorOrder: 'asc'
          }
        }
      },
      orderBy: {
        year: 'desc'
      }
    });

    // Build the collaboration network
    const collaborators = new Map();
    const publicationsList = [];

    // Process each publication to build the network
    userPublications.forEach(publication => {
      const coAuthors = publication.authorRelations
        .filter(author => author.userId !== currentUserId)
        .map(author => author.userId);

      publicationsList.push({
        pub_id: publication.id,
        title: publication.title,
        journal: publication.journal,
        year: publication.year,
        abstract: publication.abstract,
        doi: publication.doi,
        url: publication.url,
        publicationType: publication.type,
        keywords: publication.keywords,
        co_authors: [currentUserId, ...coAuthors]
      });

      // Track collaborations
      coAuthors.forEach(coAuthorId => {
        if (!collaborators.has(coAuthorId)) {
          collaborators.set(coAuthorId, {
            userId: coAuthorId,
            publications: [],
            collaborationCount: 0
          });
        }
        
        const collaborator = collaborators.get(coAuthorId);
        collaborator.publications.push(publication.id);
        collaborator.collaborationCount++;
      });
    });

    // Fetch all unique collaborators
    const collaboratorIds = Array.from(collaborators.keys());
    const collaboratorUsers = await prisma.user.findMany({
      where: {
        id: {
          in: collaboratorIds
        }
      },
      include: {
        researchProfile: true,
        institution: true,
        foundation: true
      }
    });

    // Build the authors list
    const authors = [];

    // Add current user as lead investigator
    authors.push({
      author_id: currentUser.id,
      name: `${currentUser.givenName} ${currentUser.familyName}`,
      specialization: currentUser.researchProfile?.specialization?.join(', ') || 'General Research',
      institution: currentUser.institution?.name || currentUser.foundation?.institutionName || 'Independent Researcher',
      role: 'Lead Investigator/Current User',
      publications_count: userPublications.length,
      collaborations: collaboratorIds,
      isLead: true
    });

    // Add collaborators
    collaboratorUsers.forEach(user => {
      const collaboratorData = collaborators.get(user.id);
      
      authors.push({
        author_id: user.id,
        name: `${user.givenName} ${user.familyName}`,
        specialization: user.researchProfile?.specialization?.join(', ') || 'General Research',
        institution: user.institution?.name || user.foundation?.institutionName || 'Independent Researcher',
        role: user.researchProfile?.academicTitle || 'Researcher',
        publications_count: collaboratorData.collaborationCount,
        collaborations: [currentUserId], // Direct collaboration with current user
        isLead: false
      });
    });

    // Calculate collaboration levels
    const collaborationLevels = {
      [currentUserId]: {
        direct: collaboratorIds,
        secondary: []
      }
    };

    // Find secondary collaborations (collaborators of collaborators)
    const secondaryCollaboratorIds = new Set();
    
    for (const collaboratorId of collaboratorIds) {
      const collaboratorPublications = await prisma.publication.findMany({
        where: {
          authorRelations: {
            some: {
              userId: collaboratorId
            }
          }
        },
        include: {
          authorRelations: {
            where: {
              userId: {
                not: currentUserId // Exclude current user
              }
            }
          }
        }
      });

      collaboratorPublications.forEach(pub => {
        pub.authorRelations.forEach(author => {
          if (author.userId !== collaboratorId && !collaboratorIds.includes(author.userId)) {
            secondaryCollaboratorIds.add(author.userId);
          }
        });
      });
    }

    collaborationLevels[currentUserId].secondary = Array.from(secondaryCollaboratorIds);

    // Fetch secondary collaborators if any
    if (secondaryCollaboratorIds.size > 0) {
      const secondaryUsers = await prisma.user.findMany({
        where: {
          id: {
            in: Array.from(secondaryCollaboratorIds)
          }
        },
        include: {
          researchProfile: true,
          institution: true,
          foundation: true
        }
      });

      secondaryUsers.forEach(user => {
        authors.push({
          author_id: user.id,
          name: `${user.givenName} ${user.familyName}`,
          specialization: user.researchProfile?.specialization?.join(', ') || 'General Research',
          institution: user.institution?.name || user.foundation?.institutionName || 'Independent Researcher',
          role: user.researchProfile?.academicTitle || 'Researcher',
          publications_count: 0, // We don't have exact count for secondary collaborators
          collaborations: [], // Secondary collaborators don't directly connect to current user
          isLead: false
        });
      });
    }

    // Build the response in the same format as the original JSON
    const networkData = {
      network_name: `${currentUser.givenName} ${currentUser.familyName}'s Research Collaboration Network`,
      lead_investigator_id: currentUserId,
      authors: authors,
      publications: publicationsList,
      collaboration_levels: collaborationLevels,
      metadata: {
        total_publications: userPublications.length,
        total_collaborators: collaboratorIds.length,
        total_secondary_collaborators: secondaryCollaboratorIds.size,
        generated_at: new Date().toISOString()
      }
    };

    return NextResponse.json(networkData);

  } catch (error) {
    console.error('Error fetching network data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    );
  }
}
