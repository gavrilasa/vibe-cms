import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test if we can query the database
    const userCount = await prisma.user.count();
    console.log('Current user count:', userCount);
    
    // Test if we can create a simple record (we'll delete it right after)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@delete.com',
        password: 'test',
        role: 'test'
      }
    });
    
    // Delete the test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    console.log('Database write/delete test successful');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and operations working correctly',
      userCount
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}