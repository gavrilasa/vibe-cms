#!/usr/bin/env node

// Direct database insertion script for admin users
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin(email, password, name = null) {
  try {
    console.log('=== Creating Admin User ===');
    console.log('Email:', email);
    console.log('Name:', name || 'Not provided');
    
    // Connect to database
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (existingUser) {
      console.log('❌ User already exists with this email');
      return false;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✓ Password hashed');
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Created at:', user.createdAt);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function listAdmins() {
  try {
    await prisma.$connect();
    
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('\n=== Current Admin Users ===');
    if (admins.length === 0) {
      console.log('No admin users found');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error listing admins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Main function to handle command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('=== Admin User Creation Script ===');
    console.log('');
    console.log('Usage:');
    console.log('  node create-admin.js <email> <password> [name]');
    console.log('  node create-admin.js --list                    # List existing admins');
    console.log('');
    console.log('Examples:');
    console.log('  node create-admin.js admin@company.com admin123');
    console.log('  node create-admin.js admin@company.com admin123 "John Doe"');
    console.log('  node create-admin.js --list');
    console.log('');
    return;
  }
  
  if (args[0] === '--list' || args[0] === '-l') {
    await listAdmins();
    return;
  }
  
  if (args.length < 2) {
    console.error('❌ Error: Email and password are required');
    console.log('Usage: node create-admin.js <email> <password> [name]');
    process.exit(1);
  }
  
  const email = args[0];
  const password = args[1];
  const name = args[2] || null;
  
  // Basic validation
  if (!email.includes('@')) {
    console.error('❌ Error: Invalid email format');
    process.exit(1);
  }
  
  if (password.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters');
    process.exit(1);
  }
  
  const success = await createAdmin(email, password, name);
  
  if (success) {
    console.log('\n🎉 You can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\nGo to: http://localhost:3000/admin/login');
  }
  
  process.exit(success ? 0 : 1);
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});