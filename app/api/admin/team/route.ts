import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error getting team members:', error);
    return NextResponse.json({ error: 'Failed to get team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, position, description, imageUrl, email, linkedin, order } = await request.json();

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

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}