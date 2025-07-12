import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all users (for discovery)
router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;

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

    // Format user data
    const formattedUsers = filteredUsers.map(user => ({
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
        .filter(us => us.isOffered)
        .map(us => us.skill),
      skillsWanted: user.userSkills
        .filter(us => !us.isOffered)
        .map(us => us.skill),
      badges: user.badges.map(ub => ({
        ...ub.badge,
        unlockedAt: ub.unlockedAt
      }))
    }));

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
    const userData = {
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
        .filter(us => us.isOffered)
        .map(us => us.skill),
      skillsWanted: user.userSkills
        .filter(us => !us.isOffered)
        .map(us => us.skill),
      badges: user.badges.map(ub => ({
        ...ub.badge,
        unlockedAt: ub.unlockedAt
      }))
    };

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

export { router as userRoutes }; 