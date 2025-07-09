import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    });

    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    return NextResponse.json({
      adminCount,
      admins,
      hasAdmin: adminCount > 0
    });
  } catch (error) {
    console.error('Error checking admin users:', error);
    return NextResponse.json({ error: 'Failed to check admin users' }, { status: 500 });
  }
}