import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();
    
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await prisma.visitor.create({
      data: {
        ipAddress: ip,
        userAgent,
        page,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}