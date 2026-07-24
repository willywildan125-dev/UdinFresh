async function test() {
  console.log('Testing driver login endpoint using native fetch...');
  try {
    const res = await fetch('http://localhost:5000/api/supir/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'ahmad@udinfresh.com',
        password: 'admin123'
      })
    });
    
    const data = await res.status === 200 || res.status === 401 || res.status === 400 ? await res.json() : await res.text();
    console.log('Response Status:', res.status);
    console.log('Response Data:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    
    if (data.success && data.token) {
      console.log('✅ TEST PASSED: Driver successfully authenticated with bcrypt & received JWT token.');
    } else {
      console.log('❌ TEST FAILED: Login failed.');
    }
  } catch (err) {
    console.error('Connection/Test error:', err.message);
  }
}

test();
