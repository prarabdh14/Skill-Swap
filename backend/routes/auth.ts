import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';

const router = Router();

// Helper function to format user data for frontend
const formatUserData = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  location: user.location,
  profilePhoto: user.profilePhoto,
  availability: user.availability,
  isPublic: user.isPublic,
  rating: user.rating,
  swapsCompleted: user.swapsCompleted,
  isAdmin: user.isAdmin,
  isBanned: user.isBanned,
  createdAt: user.createdAt,
  skillsOffered: user.userSkills
    ? user.userSkills.filter((us: any) => us.isOffered).map((us: any) => us.skill)
    : [],
  skillsWanted: user.userSkills
    ? user.userSkills.filter((us: any) => !us.isOffered).map((us: any) => us.skill)
    : [],
  badges: user.badges
    ? user.badges.map((ub: any) => ({
        ...ub.badge,
        unlockedAt: ub.unlockedAt
      }))
    : []
});

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        location,
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: formatUserData(user),
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userSkills: {
          include: {
            skill: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Sign in successful',
      user: formatUserData(user),
      token
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userSkills: {
          include: {
            skill: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: formatUserData(user) });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    console.log('Backend: Received Google OAuth request body:', req.body);
    const { credential } = req.body;

    if (!credential) {
      console.error('Google OAuth: Missing credential');
      return res.status(400).json({ error: 'Google credential is required' });
    }

    if (!process.env.VITE_GOOGLE_CLIENT_ID) {
      console.error('Google OAuth: Missing GOOGLE_CLIENT_ID environment variable');
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

    // Verify the Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_CLIENT_ID
      });
    } catch (error) {
      console.error('Google OAuth: Token verification failed', error);
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      console.error('Google OAuth: Invalid token payload');
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture } = payload;

    if (!email || !name) {
      console.error('Google OAuth: Missing email or name in payload', { email, name });
      return res.status(400).json({ error: 'Invalid Google token payload' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        userSkills: {
          include: {
            skill: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      // Create new user with a placeholder password for OAuth users
      const placeholderPassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(36), 12);
      
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: placeholderPassword, // Required field, but OAuth users won't use it
          profilePhoto: picture || null,
          location: 'Unknown', // Default location
        },
        include: {
          userSkills: {
            include: {
              skill: true
            }
          },
          badges: {
            include: {
              badge: true
            }
          }
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      user: formatUserData(user),
      token
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

export { router as authRoutes }; 