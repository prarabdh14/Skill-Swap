import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
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
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isBanned }
    });

    res.json({
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      user
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Make user admin
router.put('/users/:id/admin', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isAdmin }
    });

    res.json({
      message: `User ${isAdmin ? 'made admin' : 'removed from admin'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({ error: 'Failed to update admin status' });
  }
});

// Get all announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await prisma.adminAnnouncement.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ error: 'Title, message, and type are required' });
    }

    const announcement = await prisma.adminAnnouncement.create({
      data: {
        title,
        message,
        type
      }
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, isActive } = req.body;

    const announcement = await prisma.adminAnnouncement.update({
      where: { id },
      data: {
        title,
        message,
        type,
        isActive
      }
    });

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.adminAnnouncement.delete({
      where: { id }
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalSwaps,
      completedSwaps,
      totalSkills,
      totalMessages
    ] = await Promise.all([
      prisma.user.count(),
      prisma.swapRequest.count(),
      prisma.swapRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.skill.count(),
      prisma.message.count()
    ]);

    res.json({
      totalUsers,
      totalSwaps,
      completedSwaps,
      totalSkills,
      totalMessages,
      completionRate: totalSwaps > 0 ? (completedSwaps / totalSwaps * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export { router as adminRoutes }; 