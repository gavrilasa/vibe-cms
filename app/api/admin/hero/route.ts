import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hero = await prisma.heroContent.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error getting hero content:', error);
    return NextResponse.json({ error: 'Failed to get hero content' }, { status: 500 });
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

    const { title, subtitle, description, imageUrl } = await request.json();

    // Deactivate current hero content
    await prisma.heroContent.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new hero content
    const hero = await prisma.heroContent.create({
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        isActive: true,
      },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
  }
}