import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;

    let whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });

    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get skill by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({
      where: { id }
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// Create new skill (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, category, level, description } = req.body;

    // Validate input
    if (!name || !category || !level) {
      return res.status(400).json({ error: 'Name, category, and level are required' });
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: {
        name_category: {
          name,
          category
        }
      }
    });

    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists in this category' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level,
        description
      }
    });

    res.status(201).json({
      message: 'Skill created successfully',
      skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Get skill categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.skill.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    const categoryList = categories.map(cat => cat.category);
    res.json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export { router as skillRoutes }; 