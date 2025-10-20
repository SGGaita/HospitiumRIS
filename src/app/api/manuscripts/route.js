import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // TODO: Add proper authentication when auth is set up
        const session = { user: { id: 'dev-user-id', orcidId: null } };

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit')) || 20;
        const offset = parseInt(searchParams.get('offset')) || 0;

        // Build the where clause for filtering
        const where = {};

        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        if (type) {
            where.type = type;
        }

        // Get manuscripts with filtering and pagination
    const manuscripts = await prisma.manuscript.findMany({
            where,
            orderBy: {
                updatedAt: 'desc'
            },
            take: limit,
            skip: offset,
          select: {
            id: true,
                title: true,
                description: true,
                type: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                collaborators: {
                    select: {
                        user: {
                            select: {
            givenName: true,
            familyName: true,
            email: true
          }
        },
                        role: true
                    }
                }
            }
        });

        // Get total count for pagination
        const totalCount = await prisma.manuscript.count({ where });

        // Transform the data to match the expected format
    const transformedManuscripts = manuscripts.map(manuscript => ({
            ...manuscript,
            authors: manuscript.collaborators
                .map(collab => {
                    const user = collab.user;
                    const fullName = `${user.givenName || ''} ${user.familyName || ''}`.trim();
                    return fullName || user.email;
                })
                .join(', ') || 'Unknown',
            lastUpdated: manuscript.updatedAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
            collaboratorCount: manuscript.collaborators.length
    }));

    return NextResponse.json({
      success: true,
            manuscripts: transformedManuscripts,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount
            }
    });

  } catch (error) {
    console.error('Error fetching manuscripts:', error);
    return NextResponse.json(
            { error: 'Failed to fetch manuscripts' },
      { status: 500 }
    );
    } finally {
        await prisma.$disconnect();
    }
}