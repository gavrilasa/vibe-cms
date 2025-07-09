// Simple test script to check registration
const testRegistration = async () => {
  console.log('Testing registration endpoint...');
  
  const testData = {
    email: 'admin@test.com',
    password: 'admin123'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response body:', result);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Test simple endpoint first
const testSimple = async () => {
  console.log('Testing simple endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/simple-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Simple endpoint status:', response.status);
    const result = await response.json();
    console.log('Simple endpoint result:', result);
    
  } catch (error) {
    console.error('Simple test failed:', error);
  }
};

// Run tests
testSimple().then(() => {
  console.log('\n--- Now testing registration ---\n');
  testRegistration();
});