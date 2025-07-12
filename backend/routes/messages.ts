import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get messages between two users
router.get('/conversation/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId1 },
              { receiverId: userId2 }
            ]
          },
          {
            AND: [
              { senderId: userId2 },
              { receiverId: userId1 }
            ]
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all conversations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Group messages by conversation
    const conversations = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      // Count unread messages
      if (message.receiverId === userId && !message.isRead) {
        conversations.get(otherUserId).unreadCount++;
      }
    });

    const conversationList = Array.from(conversations.values());
    res.json(conversationList);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Send a message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Validate input
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'Sender, receiver, and content are required' });
    }

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } })
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
router.put('/read', async (req, res) => {
  try {
    const { userId, senderId } = req.body;

    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export { router as messageRoutes }; 