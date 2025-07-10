import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET all portfolio items
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error getting portfolios:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: 'Database connection failed.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to get portfolios due to a server error.' }, { status: 500 });
  }
}

// POST a new portfolio item
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, imageUrl, category, projectUrl, order } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required.' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        projectUrl,
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create portfolio due to a server error.' }, { status: 500 });
  }
}