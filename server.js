require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');
const questionnaireRoutes = require('./routes/questionnaireRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const USERS_FILE = path.join(__dirname, 'users.json');
const NEWSLETTER_FILE = path.join(__dirname, 'newsletter-signups.json');
const publicDir = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'swn-skin-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.static(publicDir));

function ensureJsonFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function readJsonFile(filePath, defaultValue) {
  ensureJsonFile(filePath, defaultValue);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data || JSON.stringify(defaultValue));
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function getTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// Questionnaire routes
app.use('/api', questionnaireRoutes);

// Newsletter signup
app.post('/signup', async function (req, res) {
  try {
    const email = (req.body.email || '').trim();
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const signups = readJsonFile(NEWSLETTER_FILE, []);
    const alreadyExists = signups.some(function (entry) {
      return entry.email.toLowerCase() === email.toLowerCase();
    });

    if (!alreadyExists) {
      signups.push({
        id: Date.now(),
        email,
        createdAt: new Date().toISOString(),
      });
      writeJsonFile(NEWSLETTER_FILE, signups);
    }

    const transporter = getTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Your 10% Off Code',
        text: 'Thanks for signing up! Your discount code is WELCOME10.',
      });

      return res.status(200).json({
        message: 'Success! Check your email for your discount code.',
      });
    }

    return res.status(200).json({
      message: 'Signup saved! Email sending is not configured yet, but your discount code is WELCOME10.',
    });
  } catch (error) {
    console.error('Newsletter signup failed:', error);
    return res.status(500).json({ message: 'Failed to process signup.' });
  }
});

// Account signup
app.post('/api/signup', async function (req, res) {
  try {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const email = (req.body.email || '').trim();
    const password = (req.body.password || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'First name, last name, email, and password are required.',
      });
    }

    const users = readJsonFile(USERS_FILE, []);

    const existingUser = users.find(function (user) {
      return user.email.toLowerCase() === email.toLowerCase();
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Account already exists with that email.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    req.session.user = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };

    return res.json({
      message: 'Account created successfully.',
      user: req.session.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error while creating account.' });
  }
});

// Account login
app.post('/api/login', async function (req, res) {
  try {
    const email = (req.body.email || '').trim();
    const password = (req.body.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readJsonFile(USERS_FILE, []);

    const user = users.find(function (item) {
      return item.email.toLowerCase() === email.toLowerCase();
    });

    if (!user) {
      return res.status(400).json({ message: 'No account found with that email.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return res.json({
      message: 'Signed in successfully.',
      user: req.session.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error while signing in.' });
  }
});

// Current session user
app.get('/api/me', function (req, res) {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false });
  }

  return res.json({
    loggedIn: true,
    user: req.session.user,
  });
});

// Fallback for frontend routes
app.use(function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on http://127.0.0.1:${PORT}/`);
});