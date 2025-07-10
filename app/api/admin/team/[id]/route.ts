import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET a single team member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch team member due to an unknown server error.' }, { status: 500 });
  }
}

// UPDATE a team member by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, position, description, imageUrl, email, linkedin, order } = await request.json();

    if (!name || !position || !description || order === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name,
        position,
        description,
        imageUrl,
        email,
        linkedin,
        order,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Failed to update: The team member does not exist.' }, { status: 404 });
      }
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to update team member due to an unknown server error.' }, { status: 500 });
  }
}

// DELETE a team member by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    
    // Handle specific Prisma errors for more clarity
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // This error occurs if you try to delete a record that doesn't exist
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Failed to delete: The team member was not found.' }, { status: 404 });
      }
      return NextResponse.json({ error: `A database error occurred: ${error.code}`, details: error.message }, { status: 500 });
    }
    
    // Handle database connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }

    // Fallback for any other errors
    return NextResponse.json({ error: 'An unknown server error occurred during deletion.' }, { status: 500 });
  }
}
