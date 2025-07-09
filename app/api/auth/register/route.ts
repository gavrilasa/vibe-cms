import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('=== Registration API Called ===');
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Get the raw body first
    const rawBody = await request.text();
    console.log('Raw body received:', rawBody);
    console.log('Raw body length:', rawBody.length);
    
    if (!rawBody || rawBody.trim() === '') {
      console.log('Empty request body');
      return NextResponse.json({ 
        error: 'Request body is empty',
        success: false 
      }, { status: 400 });
    }

    // Parse the JSON
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log('Body parsed successfully:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw body that failed to parse:', rawBody);
      return NextResponse.json({ 
        error: 'Invalid JSON format in request body',
        success: false,
        receivedBody: rawBody.substring(0, 100) // First 100 chars for debugging
      }, { status: 400 });
    }

    const { email, password } = body;
    console.log('Extracted fields:', { email, hasPassword: !!password });

    // Validate input
    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json({ 
        error: 'Email and password are required',
        success: false,
        received: { email: !!email, password: !!password }
      }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      console.log('Invalid field types');
      return NextResponse.json({ 
        error: 'Email and password must be strings',
        success: false,
        types: { email: typeof email, password: typeof password }
      }, { status: 400 });
    }

    // Basic email validation
    if (!email.includes('@') || email.length < 5) {
      console.log('Invalid email format');
      return NextResponse.json({ 
        error: 'Invalid email format',
        success: false 
      }, { status: 400 });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters',
        success: false 
      }, { status: 400 });
    }

    console.log('Input validation passed');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ 
        error: 'User already exists',
        success: false 
      }, { status: 409 });
    }

    console.log('No existing user found, proceeding with creation');

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('=== Registration Error ===');
    console.error('Error type:', typeof error);
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
      
      // Handle specific Prisma errors
      if (error.message.includes('P2002')) {
        return NextResponse.json({ 
          error: 'Email already exists',
          success: false 
        }, { status: 409 });
      }
      
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json({ 
          error: 'Database connection failed',
          success: false 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      error: 'Internal server error during registration',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Add a GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint is working',
    method: 'GET',
    timestamp: new Date().toISOString()
  });
}