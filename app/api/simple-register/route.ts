import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    message: 'Simple endpoint working',
    timestamp: new Date().toISOString()
  });
}

export async function GET() {
  return NextResponse.json({ 
    message: 'GET method working',
    timestamp: new Date().toISOString()
  });
}