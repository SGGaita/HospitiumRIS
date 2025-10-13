import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../lib/auth-server.js';

const prisma = new PrismaClient();

/**
 * Create a new manuscript
 * POST /api/manuscripts
 */
export async function POST(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      title,
      type,
      field,
      description,
      collaborators = []
    } = await request.json();

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Create the manuscript
    const manuscript = await prisma.manuscript.create({
      data: {
        title: title.trim(),
        type: type,
        field: field || null,
        description: description || null,
        status: 'DRAFT',
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            givenName: true,
            familyName: true,
            email: true,
            orcidId: true
          }
        }
      }
    });

    // Add creator as owner collaborator
    await prisma.manuscriptCollaborator.create({
      data: {
        manuscriptId: manuscript.id,
        userId: userId,
        role: 'OWNER',
        invitedBy: userId,
        canEdit: true,
        canInvite: true,
        canDelete: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        manuscript: {
          id: manuscript.id,
          title: manuscript.title,
          type: manuscript.type,
          field: manuscript.field,
          description: manuscript.description,
          status: manuscript.status,
          createdAt: manuscript.createdAt,
          updatedAt: manuscript.updatedAt,
          creator: manuscript.creator
        }
      }
    });

  } catch (error) {
    console.error('Error creating manuscript:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get manuscripts for the authenticated user
 * GET /api/manuscripts
 */
export async function GET(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get manuscripts where user is creator or collaborator
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        OR: [
          { createdBy: userId },
          {
            collaborators: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            givenName: true,
            familyName: true,
            email: true
          }
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                givenName: true,
                familyName: true,
                email: true,
                orcidId: true
              }
            }
          }
        },
        invitations: {
          where: {
            status: 'PENDING'
          }
        },
        _count: {
          select: {
            collaborators: true,
            invitations: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform data for frontend
    const transformedManuscripts = manuscripts.map(manuscript => ({
      id: manuscript.id,
      title: manuscript.title,
      type: manuscript.type,
      field: manuscript.field,
      description: manuscript.description,
      status: manuscript.status,
      createdAt: manuscript.createdAt,
      updatedAt: manuscript.updatedAt,
      creator: manuscript.creator,
      collaborators: manuscript.collaborators.map(collab => ({
        id: collab.user.id,
        name: `${collab.user.givenName} ${collab.user.familyName}`,
        email: collab.user.email,
        role: collab.role,
        canEdit: collab.canEdit,
        canInvite: collab.canInvite,
        canDelete: collab.canDelete,
        joinedAt: collab.joinedAt
      })),
      pendingInvitations: manuscript._count.invitations,
      totalCollaborators: manuscript._count.collaborators,
      lastUpdated: manuscript.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: transformedManuscripts
    });

  } catch (error) {
    console.error('Error fetching manuscripts:', error);
    
    // Handle case where tables don't exist yet
    if (error.code === 'P2021') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update a manuscript
 * PATCH /api/manuscripts
 */
export async function PATCH(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const manuscriptId = searchParams.get('id');

    if (!manuscriptId) {
      return NextResponse.json(
        { error: 'Manuscript ID is required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    // Verify user has permission to update
    const manuscript = await prisma.manuscript.findFirst({
      where: {
        id: manuscriptId,
        OR: [
          { createdBy: userId },
          {
            collaborators: {
              some: {
                userId: userId,
                canEdit: true
              }
            }
          }
        ]
      }
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: 'Manuscript not found or insufficient permissions' },
        { status: 404 }
      );
    }

    // Update the manuscript
    const updatedManuscript = await prisma.manuscript.update({
      where: {
        id: manuscriptId
      },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        creator: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedManuscript
    });

  } catch (error) {
    console.error('Error updating manuscript:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete a manuscript
 * DELETE /api/manuscripts
 */
export async function DELETE(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const manuscriptId = searchParams.get('id');

    if (!manuscriptId) {
      return NextResponse.json(
        { error: 'Manuscript ID is required' },
        { status: 400 }
      );
    }

    // Verify user is the creator or has delete permission
    const manuscript = await prisma.manuscript.findFirst({
      where: {
        id: manuscriptId,
        OR: [
          { createdBy: userId },
          {
            collaborators: {
              some: {
                userId: userId,
                canDelete: true
              }
            }
          }
        ]
      }
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: 'Manuscript not found or insufficient permissions' },
        { status: 404 }
      );
    }

    // Delete the manuscript (cascading delete will handle related records)
    await prisma.manuscript.delete({
      where: {
        id: manuscriptId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Manuscript deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting manuscript:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

