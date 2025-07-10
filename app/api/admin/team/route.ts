import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET all team members
export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error getting team members:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: 'Database connection failed.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to get team members due to a server error.' }, { status: 500 });
  }
}

// POST a new team member
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, position, description, imageUrl, email, linkedin, order } = await request.json();

    if (!name || !position || !description) {
      return NextResponse.json({ error: 'Name, position, and description are required.' }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        position,
        description,
        imageUrl,
        email,
        linkedin,
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create team member due to a server error.' }, { status: 500 });
  }
}
