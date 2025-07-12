import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all swaps for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const swaps = await prisma.swapRequest.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        requester: true,
        receiver: true,
        requesterSkill: true,
        receiverSkill: true,
        ratings: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(swaps);
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// Create new swap request
router.post('/', async (req, res) => {
  try {
    const { requesterId, receiverId, requesterSkillId, receiverSkillId, message, scheduledDate } = req.body;

    // Validate input
    if (!requesterId || !receiverId || !requesterSkillId || !receiverSkillId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if users exist
    const [requester, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: requesterId } }),
      prisma.user.findUnique({ where: { id: receiverId } })
    ]);

    if (!requester || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if skills exist
    const [requesterSkill, receiverSkill] = await Promise.all([
      prisma.skill.findUnique({ where: { id: requesterSkillId } }),
      prisma.skill.findUnique({ where: { id: receiverSkillId } })
    ]);

    if (!requesterSkill || !receiverSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Create swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId,
        receiverId,
        requesterSkillId,
        receiverSkillId,
        message,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null
      },
      include: {
        requester: true,
        receiver: true,
        requesterSkill: true,
        receiverSkill: true
      }
    });

    res.status(201).json({
      message: 'Swap request created successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

// Update swap status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const swapRequest = await prisma.swapRequest.update({
      where: { id },
      data: { status },
      include: {
        requester: true,
        receiver: true,
        requesterSkill: true,
        receiverSkill: true
      }
    });

    // Create notifications based on status change
    if (status === 'ACCEPTED') {
      // Notify requester that their swap was accepted
      await prisma.notification.create({
        data: {
          userId: swapRequest.requesterId,
          title: 'Swap Request Accepted!',
          message: `${swapRequest.receiver.name} accepted your swap request for ${swapRequest.requesterSkill.name} ↔ ${swapRequest.receiverSkill.name}`,
          type: 'SWAP_ACCEPTED',
          relatedId: swapRequest.id
        }
      });
    } else if (status === 'REJECTED') {
      // Notify requester that their swap was rejected
      await prisma.notification.create({
        data: {
          userId: swapRequest.requesterId,
          title: 'Swap Request Rejected',
          message: `${swapRequest.receiver.name} rejected your swap request for ${swapRequest.requesterSkill.name} ↔ ${swapRequest.receiverSkill.name}`,
          type: 'SWAP_REJECTED',
          relatedId: swapRequest.id
        }
      });
    } else if (status === 'COMPLETED') {
      // Notify both users that the swap is completed
      await Promise.all([
        prisma.notification.create({
          data: {
            userId: swapRequest.requesterId,
            title: 'Swap Completed!',
            message: `Your swap with ${swapRequest.receiver.name} for ${swapRequest.requesterSkill.name} ↔ ${swapRequest.receiverSkill.name} has been completed!`,
            type: 'SWAP_COMPLETED',
            relatedId: swapRequest.id
          }
        }),
        prisma.notification.create({
          data: {
            userId: swapRequest.receiverId,
            title: 'Swap Completed!',
            message: `Your swap with ${swapRequest.requester.name} for ${swapRequest.requesterSkill.name} ↔ ${swapRequest.receiverSkill.name} has been completed!`,
            type: 'SWAP_COMPLETED',
            relatedId: swapRequest.id
          }
        })
      ]);

      // Increment swapsCompleted for both users
      await Promise.all([
        prisma.user.update({
          where: { id: swapRequest.requesterId },
          data: { swapsCompleted: { increment: 1 } }
        }),
        prisma.user.update({
          where: { id: swapRequest.receiverId },
          data: { swapsCompleted: { increment: 1 } }
        })
      ]);
    }

    res.json({
      message: 'Swap status updated successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Update swap status error:', error);
    res.status(500).json({ error: 'Failed to update swap status' });
  }
});

// Add rating to completed swap
router.post('/:id/ratings', async (req, res) => {
  try {
    const { id } = req.params;
    const { raterId, ratedUserId, rating, feedback } = req.body;

    // Check if swap exists and is completed
    const swap = await prisma.swapRequest.findUnique({
      where: { id }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only rate completed swaps' });
    }

    // Check if rating already exists
    const existingRating = await prisma.rating.findUnique({
      where: {
        swapId_raterId: {
          swapId: id,
          raterId
        }
      }
    });

    if (existingRating) {
      return res.status(400).json({ error: 'Rating already exists for this swap' });
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        swapId: id,
        raterId,
        ratedUserId,
        rating,
        feedback
      }
    });

    // Update user's average rating
    const userRatings = await prisma.rating.findMany({
      where: { ratedUserId }
    });

    const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

    await prisma.user.update({
      where: { id: ratedUserId },
      data: { rating: averageRating }
    });

    res.status(201).json({
      message: 'Rating added successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

export { router as swapRoutes }; 