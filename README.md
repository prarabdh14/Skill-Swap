# Skill-Swap 🚀

Team Name- misFits

Team Members: Prarabdh Atrey, Shivangi Srivastva, Diya Agarwal and Dhruv Duggal

A modern skill-sharing platform that connects people who want to learn and teach. Swap your expertise with others in a collaborative learning environment.

![Skill-Swap Banner](https://img.shields.io/badge/Skill--Swap-Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-24.4.0-green?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)

## 🌟 Features

### Core Functionality
- *Skill Discovery*: Browse and search for skills offered by other users
- *Skill Swapping*: Propose and manage skill exchange requests
- *User Profiles*: Comprehensive profiles with skills offered/wanted
- *Messaging System*: Real-time communication between users
- *Rating System*: Rate and review completed skill swaps
- *Badge System*: Achievement badges for active users

### User Experience
- *Modern UI/UX*: Beautiful, responsive design with Tailwind CSS
- *Real-time Updates*: Live notifications and status updates
- *Mobile Responsive*: Works seamlessly on all devices
- *Dark/Light Mode*: Theme support for user preference
- *Admin Panel*: Comprehensive admin dashboard for platform management

### Security & Authentication
- *JWT Authentication*: Secure token-based authentication
- *Google OAuth*: Sign in with Google account
- *Password Hashing*: Secure password storage with bcrypt
- *Role-based Access*: Admin and user role management

## 🛠 Tech Stack

### Frontend
- *React 18* - Modern React with hooks and context
- *TypeScript* - Type-safe development
- *Vite* - Fast build tool and dev server
- *Tailwind CSS* - Utility-first CSS framework
- *Lucide React* - Beautiful icons
- *Framer Motion* - Smooth animations
- *Three.js* - 3D graphics and effects

### Backend
- *Node.js* - JavaScript runtime
- *Express.js* - Web framework
- *TypeScript* - Type-safe backend development
- *Prisma* - Modern database ORM
- *PostgreSQL* - Reliable database
- *JWT* - Authentication tokens
- *bcryptjs* - Password hashing

### Development Tools
- *ESLint* - Code linting
- *Prettier* - Code formatting
- *TypeScript* - Static type checking

## 📋 Prerequisites

Before running this project, make sure you have:

- *Node.js* (v18 or higher)
- *npm* or *yarn* package manager
- *PostgreSQL* database
- *Git* for version control

## 🚀 Quick Start

### 1. Clone the Repository

bash
git clone https://github.com/yourusername/skill-swap.git
cd skill-swap


### 2. Backend Setup

bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env


Edit the .env file with your database configuration:

env
DATABASE_URL="postgresql://username:password@localhost:5432/skillswap"
JWT_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
PORT=5000


### 3. Database Setup

bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed the database with sample data
npm run db:seed


### 4. Start Backend Server

bash
# Development mode
npm run dev

# Production mode
npm run build
npm start


### 5. Frontend Setup

bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env


Edit the frontend .env file:

env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id


### 6. Start Frontend Development Server

bash
npm run dev


The application will be available at http://localhost:5173

## 📁 Project Structure


skill-swap/
├── backend/                 # Backend API server
│   ├── routes/             # API route handlers
│   ├── lib/                # Utility libraries
│   ├── prisma/             # Database schema and migrations
│   └── server.ts           # Main server file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── main.tsx        # Application entry point
│   └── public/             # Static assets
└── README.md               # This file


## 🔧 Available Scripts

### Backend Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data


### Frontend Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint


## 🎯 Key Features Explained

### Skill Management
- Users can add skills they want to offer or learn
- Skills are categorized and have difficulty levels
- Search and filter skills by category, level, or location

### Swap System
- Propose skill swaps with other users
- Accept, reject, or counter-propose swaps
- Track swap status (pending, accepted, completed, cancelled)
- Schedule swap sessions

### Messaging
- Real-time messaging between users
- Message notifications
- Conversation history
- File sharing support

### Rating System
- Rate completed swaps (1-5 stars)
- Leave feedback and comments
- View user ratings and reviews
- Build reputation over time

### Admin Features
- User management (ban/unban, role changes)
- Platform announcements
- Analytics and reporting
- Content moderation

## 🔒 Security Features

- *JWT Authentication*: Secure token-based sessions
- *Password Hashing*: Bcrypt for password security
- *Input Validation*: Server-side validation for all inputs
- *CORS Protection*: Configured CORS for security
- *Rate Limiting*: API rate limiting (can be added)
- *SQL Injection Protection*: Prisma ORM prevents SQL injection

## 🌐 API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/google - Google OAuth
- GET /api/auth/me - Get current user

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user profile
- DELETE /api/users/:id - Delete user (admin)

### Skills
- GET /api/skills - Get all skills
- POST /api/skills - Create new skill
- PUT /api/skills/:id - Update skill
- DELETE /api/skills/:id - Delete skill

### Swaps
- GET /api/swaps - Get user's swaps
- POST /api/swaps - Create swap request
- PUT /api/swaps/:id - Update swap status
- DELETE /api/swaps/:id - Cancel swap

### Messages
- GET /api/messages - Get user's messages
- POST /api/messages - Send message
- PUT /api/messages/:id/read - Mark as read

## 🚀 Deployment

### Backend Deployment (Heroku)
bash
# Set up Heroku
heroku create your-app-name
heroku addons:create heroku-postgresql

# Deploy
git push heroku main


### Frontend Deployment (Vercel)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- *React Team* for the amazing framework
- *Vite Team* for the fast build tool
- *Tailwind CSS* for the utility-first CSS framework
- *Prisma Team* for the modern database ORM
- *Lucide* for the beautiful icons

## 📞 Support

If you have any questions or need help:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

---

*Made with ❤ by the Skill-Swap Team*