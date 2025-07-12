import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Helper function to format skill data consistently
const formatSkill = (skill: any) => ({
  id: skill.id,
  name: skill.name,
  category: skill.category,
  level: skill.level.charAt(0) + skill.level.slice(1).toLowerCase(), // Convert BEGINNER to Beginner
  description: skill.description
});

// Helper function to format user data consistently
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
    .filter((us: any) => us.isOffered)
    .map((us: any) => formatSkill(us.skill)),
  skillsWanted: user.userSkills
    .filter((us: any) => !us.isOffered)
    .map((us: any) => formatSkill(us.skill)),
  badges: user.badges.map((ub: any) => ({
    ...ub.badge,
    unlockedAt: ub.unlockedAt
  }))
});

// Get all users (for discovery)
router.get('/', async (req, res) => {
  try {
    const { search, category, level, skill, matchType } = req.query;

    let whereClause: any = {
      isPublic: true,
      isBanned: false
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
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

    // Filter by skill category and level if provided
    let filteredUsers = users;
    if (category || level) {
      filteredUsers = users.filter(user => {
        return user.userSkills.some(userSkill => {
          const skill = userSkill.skill;
          const categoryMatch = !category || skill.category === category;
          const levelMatch = !level || skill.level === level;
          return categoryMatch && levelMatch;
        });
      });
    }

    // Filter by specific skill if provided
    if (skill) {
      filteredUsers = filteredUsers.filter(user => {
        return user.userSkills.some(userSkill => 
          userSkill.skill.name.toLowerCase().includes((skill as string).toLowerCase()) ||
          userSkill.skill.category.toLowerCase().includes((skill as string).toLowerCase())
        );
      });
    }

    // Format user data
    const formattedUsers = filteredUsers.map(user => formatUserData(user));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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
      return res.status(404).json({ error: 'User not found' });
    }

    // Format user data
    const userData = formatUserData(user);

    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, profilePhoto, availability, isPublic } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        location,
        profilePhoto,
        availability,
        isPublic
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add skill to user
router.post('/:id/skills', async (req, res) => {
  try {
    const { id } = req.params;
    const { skillId, isOffered } = req.body;

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check if user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId_isOffered: {
          userId: id,
          skillId,
          isOffered
        }
      }
    });

    if (existingUserSkill) {
      return res.status(400).json({ error: 'User already has this skill' });
    }

    // Add skill to user
    const userSkill = await prisma.userSkill.create({
      data: {
        userId: id,
        skillId,
        isOffered
      },
      include: {
        skill: true
      }
    });

    res.status(201).json({
      message: 'Skill added successfully',
      userSkill
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Remove skill from user
router.delete('/:id/skills/:skillId', async (req, res) => {
  try {
    const { id, skillId } = req.params;
    const { isOffered } = req.query;

    await prisma.userSkill.deleteMany({
      where: {
        userId: id,
        skillId,
        isOffered: isOffered === 'true'
      }
    });

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
});

// Update user skills (bulk update)
router.put('/:id/skills', async (req, res) => {
  try {
    const { id } = req.params;
    const { skillsOffered, skillsWanted } = req.body;

    // Delete all existing user skills
    await prisma.userSkill.deleteMany({
      where: { userId: id }
    });

    // Add new offered skills
    if (skillsOffered && skillsOffered.length > 0) {
      await prisma.userSkill.createMany({
        data: skillsOffered.map((skillId: string) => ({
          userId: id,
          skillId,
          isOffered: true
        }))
      });
    }

    // Add new wanted skills
    if (skillsWanted && skillsWanted.length > 0) {
      await prisma.userSkill.createMany({
        data: skillsWanted.map((skillId: string) => ({
          userId: id,
          skillId,
          isOffered: false
        }))
      });
    }

    // Get updated user with skills
    const updatedUser = await prisma.user.findUnique({
      where: { id },
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

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format user data
    const userData = formatUserData(updatedUser);

    res.json({
      message: 'Skills updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

export { router as userRoutes }; 