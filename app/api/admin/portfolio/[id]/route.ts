import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET a single portfolio item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch portfolio due to an unknown server error.' }, { status: 500 });
  }
}

// UPDATE a portfolio item by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, imageUrl, category, projectUrl, order } = await request.json();

    if (!title || !description || !category || order === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        category,
        projectUrl,
        order,
      },
    });

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Failed to update: The portfolio item does not exist.' }, { status: 404 });
      }
      return NextResponse.json({ error: `Database error: ${error.code}`, details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to update portfolio due to an unknown server error.' }, { status: 500 });
  }
}

// DELETE a portfolio item by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.portfolio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Failed to delete: The portfolio item was not found.' }, { status: 404 });
      }
      return NextResponse.json({ error: `A database error occurred: ${error.code}`, details: error.message }, { status: 500 });
    }
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unknown server error occurred during deletion.' }, { status: 500 });
  }
}