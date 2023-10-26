const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

// Serve the HTML signup form
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/../signup.html');
});

// Handle form submission
app.post('/signup', (req, res) => {
  const userPassword = req.body.userPassword;
  const email = req.body.email;

  // Spawn the Java program
  const javaProcess = spawn('java', ['/../backend/signup', userPassword, email]);

  // Handle Java program output
  javaProcess.stdout.on('data', (data) => {
    console.log('Java Output:', data.toString());
    res.send('Signup successful!');
  });

  javaProcess.stderr.on('data', (data) => {
    console.error('Java Error:', data.toString());
    res.status(500).send('Error during signup.');
  });
});

app.listen(port, () => {
  console.log(`Node.js server is running on http://localhost:${port}`);
});
