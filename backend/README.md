# SkillSwap Backend API

This is the backend API server for the SkillSwap application, built with Express.js, TypeScript, and Prisma.

## Features

- **Authentication**: JWT-based authentication with sign up/sign in
- **User Management**: User profiles, skills, and preferences
- **Skill Swapping**: Create and manage skill swap requests
- **Messaging**: Direct messaging between users
- **Admin Panel**: User moderation and announcements
- **Database**: PostgreSQL with Prisma ORM

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your database credentials and JWT secret.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all public users (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/skills` - Add skill to user
- `DELETE /api/users/:id/skills/:skillId` - Remove skill from user

### Skills
- `GET /api/skills` - Get all skills (with filters)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create new skill (admin only)
- `GET /api/skills/categories/list` - Get skill categories

### Swaps
- `GET /api/swaps/user/:userId` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/status` - Update swap status
- `POST /api/swaps/:id/ratings` - Add rating to completed swap

### Messages
- `GET /api/messages/conversation/:userId1/:userId2` - Get conversation
- `GET /api/messages/user/:userId` - Get user's conversations
- `POST /api/messages` - Send message
- `PUT /api/messages/read` - Mark messages as read

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `PUT /api/admin/users/:id/admin` - Make user admin
- `GET /api/admin/announcements` - Get announcements
- `POST /api/admin/announcements` - Create announcement
- `PUT /api/admin/announcements/:id` - Update announcement
- `DELETE /api/admin/announcements/:id` - Delete announcement
- `GET /api/admin/stats` - Get platform statistics

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User profiles and authentication
- **Skills**: Available skills with categories and levels
- **UserSkills**: Junction table linking users to skills (offered/wanted)
- **SwapRequests**: Skill swap requests between users
- **Ratings**: Post-swap ratings and feedback
- **Messages**: Direct messaging between users
- **Badges**: Achievement system
- **AdminAnnouncements**: System announcements

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Error handling middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request 