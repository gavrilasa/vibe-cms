#!/usr/bin/env node

// Admin management script with more features
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
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
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n=== Current Admin Users ===');
    if (admins.length === 0) {
      console.log('No admin users found');
    } else {
      console.log(`Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Created: ${admin.createdAt.toLocaleString()}`);
        console.log('');
      });
    }
    
    return admins;
    
  } catch (error) {
    console.error('Error listing admins:', error);
    return [];
  }
}

async function createAdmin() {
  try {
    console.log('\n=== Create New Admin User ===');
    
    const email = await question('Enter email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return false;
    }
    
    const password = await questionHidden('Enter password (min 6 chars): ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      return false;
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (existingUser) {
      console.log('❌ User already exists with this email');
      return false;
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  }
}

async function deleteAdmin() {
  try {
    const admins = await listAdmins();
    if (admins.length === 0) {
      return false;
    }
    
    const indexStr = await question('\nEnter the number of the admin to delete (or 0 to cancel): ');
    const index = parseInt(indexStr) - 1;
    
    if (index === -1) {
      console.log('Cancelled');
      return false;
    }
    
    if (index < 0 || index >= admins.length) {
      console.log('❌ Invalid selection');
      return false;
    }
    
    const adminToDelete = admins[index];
    const confirm = await question(`Are you sure you want to delete ${adminToDelete.email}? (yes/no): `);
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Cancelled');
      return false;
    }
    
    await prisma.user.delete({
      where: { id: adminToDelete.id }
    });
    
    console.log(`✅ Admin user ${adminToDelete.email} deleted successfully`);
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting admin user:', error);
    return false;
  }
}

async function changePassword() {
  try {
    const admins = await listAdmins();
    if (admins.length === 0) {
      return false;
    }
    
    const indexStr = await question('\nEnter the number of the admin to change password (or 0 to cancel): ');
    const index = parseInt(indexStr) - 1;
    
    if (index === -1) {
      console.log('Cancelled');
      return false;
    }
    
    if (index < 0 || index >= admins.length) {
      console.log('❌ Invalid selection');
      return false;
    }
    
    const adminToUpdate = admins[index];
    const newPassword = await questionHidden(`Enter new password for ${adminToUpdate.email}: `);
    
    if (!newPassword || newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      return false;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: adminToUpdate.id },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ Password updated for ${adminToUpdate.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error changing password:', error);
    return false;
  }
}

async function showMenu() {
  console.log('\n=== Admin Management Menu ===');
  console.log('1. List all admin users');
  console.log('2. Create new admin user');
  console.log('3. Delete admin user');
  console.log('4. Change admin password');
  console.log('5. Exit');
  console.log('');
  
  const choice = await question('Select an option (1-5): ');
  
  switch (choice) {
    case '1':
      await listAdmins();
      break;
    case '2':
      await createAdmin();
      break;
    case '3':
      await deleteAdmin();
      break;
    case '4':
      await changePassword();
      break;
    case '5':
      console.log('Goodbye!');
      rl.close();
      await prisma.$disconnect();
      process.exit(0);
      break;
    default:
      console.log('❌ Invalid option');
      break;
  }
  
  // Show menu again
  setTimeout(showMenu, 1000);
}

async function main() {
  try {
    await prisma.$connect();
    console.log('✓ Connected to database');
    
    console.log('=== Admin User Management System ===');
    console.log('This tool allows you to manage admin users directly in the database');
    
    await showMenu();
    
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});