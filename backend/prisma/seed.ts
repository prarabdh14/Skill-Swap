import { PrismaClient, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

const predefinedSkills = [
  // Technical & Programming
  { id: 'tech-1', name: 'JavaScript', category: 'Technical & Programming', level: SkillLevel.ADVANCED, description: 'Modern JavaScript and ES6+' },
  { id: 'tech-2', name: 'React', category: 'Technical & Programming', level: SkillLevel.EXPERT, description: 'React hooks, context, and performance optimization' },
  { id: 'tech-3', name: 'Python', category: 'Technical & Programming', level: SkillLevel.EXPERT, description: 'Data science and web development' },
  { id: 'tech-4', name: 'TypeScript', category: 'Technical & Programming', level: SkillLevel.ADVANCED, description: 'Type-safe JavaScript development' },
  { id: 'tech-5', name: 'Node.js', category: 'Technical & Programming', level: SkillLevel.ADVANCED, description: 'Server-side JavaScript development' },
  { id: 'tech-6', name: 'SQL', category: 'Technical & Programming', level: SkillLevel.INTERMEDIATE, description: 'Database management and queries' },
  { id: 'tech-7', name: 'Git', category: 'Technical & Programming', level: SkillLevel.INTERMEDIATE, description: 'Version control and collaboration' },
  { id: 'tech-8', name: 'Docker', category: 'Technical & Programming', level: SkillLevel.ADVANCED, description: 'Containerization and deployment' },
  { id: 'tech-9', name: 'AWS', category: 'Technical & Programming', level: SkillLevel.ADVANCED, description: 'Cloud computing and services' },
  { id: 'tech-10', name: 'Machine Learning', category: 'Technical & Programming', level: SkillLevel.EXPERT, description: 'AI and ML algorithms' },

  // Creative Arts
  { id: 'creative-1', name: 'Photography', category: 'Creative Arts', level: SkillLevel.ADVANCED, description: 'Portrait and landscape photography' },
  { id: 'creative-2', name: 'Digital Art', category: 'Creative Arts', level: SkillLevel.INTERMEDIATE, description: 'Digital painting and illustration' },
  { id: 'creative-3', name: 'Graphic Design', category: 'Creative Arts', level: SkillLevel.ADVANCED, description: 'Logo design and visual branding' },
  { id: 'creative-4', name: 'Video Editing', category: 'Creative Arts', level: SkillLevel.INTERMEDIATE, description: 'Video production and editing' },
  { id: 'creative-5', name: 'UI/UX Design', category: 'Creative Arts', level: SkillLevel.ADVANCED, description: 'User interface and experience design' },
  { id: 'creative-6', name: 'Drawing', category: 'Creative Arts', level: SkillLevel.INTERMEDIATE, description: 'Traditional drawing and sketching' },
  { id: 'creative-7', name: 'Calligraphy', category: 'Creative Arts', level: SkillLevel.BEGINNER, description: 'Beautiful handwriting and lettering' },
  { id: 'creative-8', name: 'Animation', category: 'Creative Arts', level: SkillLevel.ADVANCED, description: '2D and 3D animation' },

  // Music & Audio
  { id: 'music-1', name: 'Guitar', category: 'Music & Audio', level: SkillLevel.INTERMEDIATE, description: 'Acoustic and electric guitar' },
  { id: 'music-2', name: 'Piano', category: 'Music & Audio', level: SkillLevel.ADVANCED, description: 'Classical and contemporary piano' },
  { id: 'music-3', name: 'Music Production', category: 'Music & Audio', level: SkillLevel.ADVANCED, description: 'Digital audio workstation and mixing' },
  { id: 'music-4', name: 'Singing', category: 'Music & Audio', level: SkillLevel.INTERMEDIATE, description: 'Vocal training and performance' },
  { id: 'music-5', name: 'Drums', category: 'Music & Audio', level: SkillLevel.BEGINNER, description: 'Rhythm and percussion' },
  { id: 'music-6', name: 'Violin', category: 'Music & Audio', level: SkillLevel.ADVANCED, description: 'Classical violin performance' },
  { id: 'music-7', name: 'Sound Design', category: 'Music & Audio', level: SkillLevel.INTERMEDIATE, description: 'Audio effects and soundscapes' },

  // Languages
  { id: 'lang-1', name: 'Spanish', category: 'Languages', level: SkillLevel.BEGINNER, description: 'Basic conversational Spanish' },
  { id: 'lang-2', name: 'French', category: 'Languages', level: SkillLevel.INTERMEDIATE, description: 'French conversation and grammar' },
  { id: 'lang-3', name: 'German', category: 'Languages', level: SkillLevel.BEGINNER, description: 'German basics and pronunciation' },
  { id: 'lang-4', name: 'Mandarin', category: 'Languages', level: SkillLevel.BEGINNER, description: 'Chinese language and culture' },
  { id: 'lang-5', name: 'Japanese', category: 'Languages', level: SkillLevel.INTERMEDIATE, description: 'Japanese writing and speaking' },
  { id: 'lang-6', name: 'Italian', category: 'Languages', level: SkillLevel.BEGINNER, description: 'Italian conversation and culture' },
  { id: 'lang-7', name: 'Portuguese', category: 'Languages', level: SkillLevel.BEGINNER, description: 'Portuguese basics' },
  { id: 'lang-8', name: 'Arabic', category: 'Languages', level: SkillLevel.BEGINNER, description: 'Arabic script and conversation' },

  // Lifestyle & Wellness
  { id: 'lifestyle-1', name: 'Cooking', category: 'Lifestyle & Wellness', level: SkillLevel.INTERMEDIATE, description: 'Italian and Mediterranean cuisine' },
  { id: 'lifestyle-2', name: 'Yoga', category: 'Lifestyle & Wellness', level: SkillLevel.ADVANCED, description: 'Hatha and Vinyasa yoga' },
  { id: 'lifestyle-3', name: 'Meditation', category: 'Lifestyle & Wellness', level: SkillLevel.INTERMEDIATE, description: 'Mindfulness and meditation techniques' },
  { id: 'lifestyle-4', name: 'Nutrition', category: 'Lifestyle & Wellness', level: SkillLevel.ADVANCED, description: 'Healthy eating and meal planning' },
  { id: 'lifestyle-5', name: 'Baking', category: 'Lifestyle & Wellness', level: SkillLevel.INTERMEDIATE, description: 'Pastry and bread making' },
  { id: 'lifestyle-6', name: 'Gardening', category: 'Lifestyle & Wellness', level: SkillLevel.BEGINNER, description: 'Organic gardening and plant care' },
  { id: 'lifestyle-7', name: 'Fitness Training', category: 'Lifestyle & Wellness', level: SkillLevel.ADVANCED, description: 'Personal training and workout plans' },
  { id: 'lifestyle-8', name: 'Mindfulness', category: 'Lifestyle & Wellness', level: SkillLevel.INTERMEDIATE, description: 'Stress reduction and mental health' },

  // Business & Professional
  { id: 'business-1', name: 'Public Speaking', category: 'Business & Professional', level: SkillLevel.ADVANCED, description: 'Presentation and communication skills' },
  { id: 'business-2', name: 'Project Management', category: 'Business & Professional', level: SkillLevel.ADVANCED, description: 'Agile and traditional project management' },
  { id: 'business-3', name: 'Marketing', category: 'Business & Professional', level: SkillLevel.INTERMEDIATE, description: 'Digital marketing and branding' },
  { id: 'business-4', name: 'Sales', category: 'Business & Professional', level: SkillLevel.ADVANCED, description: 'Sales techniques and customer relations' },
  { id: 'business-5', name: 'Leadership', category: 'Business & Professional', level: SkillLevel.ADVANCED, description: 'Team management and leadership skills' },
  { id: 'business-6', name: 'Negotiation', category: 'Business & Professional', level: SkillLevel.INTERMEDIATE, description: 'Business negotiation strategies' },
  { id: 'business-7', name: 'Financial Planning', category: 'Business & Professional', level: SkillLevel.INTERMEDIATE, description: 'Personal finance and investment' },
  { id: 'business-8', name: 'Entrepreneurship', category: 'Business & Professional', level: SkillLevel.ADVANCED, description: 'Starting and running a business' },

  // Crafts & DIY
  { id: 'crafts-1', name: 'Woodworking', category: 'Crafts & DIY', level: SkillLevel.INTERMEDIATE, description: 'Furniture making and wood crafts' },
  { id: 'crafts-2', name: 'Knitting', category: 'Crafts & DIY', level: SkillLevel.BEGINNER, description: 'Hand knitting and crochet' },
  { id: 'crafts-3', name: 'Pottery', category: 'Crafts & DIY', level: SkillLevel.INTERMEDIATE, description: 'Ceramic art and pottery making' },
  { id: 'crafts-4', name: 'Jewelry Making', category: 'Crafts & DIY', level: SkillLevel.BEGINNER, description: 'Handmade jewelry and accessories' },
  { id: 'crafts-5', name: 'Sewing', category: 'Crafts & DIY', level: SkillLevel.INTERMEDIATE, description: 'Clothing and textile crafts' },
  { id: 'crafts-6', name: 'Candle Making', category: 'Crafts & DIY', level: SkillLevel.BEGINNER, description: 'Handmade candles and soaps' },
  { id: 'crafts-7', name: 'Leather Crafting', category: 'Crafts & DIY', level: SkillLevel.INTERMEDIATE, description: 'Leather goods and accessories' },
  { id: 'crafts-8', name: 'Glass Blowing', category: 'Crafts & DIY', level: SkillLevel.ADVANCED, description: 'Glass art and sculpture' },

  // Sports & Recreation
  { id: 'sports-1', name: 'Tennis', category: 'Sports & Recreation', level: SkillLevel.INTERMEDIATE, description: 'Tennis technique and strategy' },
  { id: 'sports-2', name: 'Swimming', category: 'Sports & Recreation', level: SkillLevel.ADVANCED, description: 'Swimming techniques and training' },
  { id: 'sports-3', name: 'Rock Climbing', category: 'Sports & Recreation', level: SkillLevel.INTERMEDIATE, description: 'Indoor and outdoor climbing' },
  { id: 'sports-4', name: 'Golf', category: 'Sports & Recreation', level: SkillLevel.BEGINNER, description: 'Golf swing and course management' },
  { id: 'sports-5', name: 'Basketball', category: 'Sports & Recreation', level: SkillLevel.INTERMEDIATE, description: 'Basketball skills and team play' },
  { id: 'sports-6', name: 'Soccer', category: 'Sports & Recreation', level: SkillLevel.ADVANCED, description: 'Soccer techniques and tactics' },
  { id: 'sports-7', name: 'Cycling', category: 'Sports & Recreation', level: SkillLevel.INTERMEDIATE, description: 'Road and mountain biking' },
  { id: 'sports-8', name: 'Martial Arts', category: 'Sports & Recreation', level: SkillLevel.ADVANCED, description: 'Karate, Judo, and self-defense' },

  // Academic & Education
  { id: 'academic-1', name: 'Mathematics', category: 'Academic & Education', level: SkillLevel.ADVANCED, description: 'Advanced math and problem solving' },
  { id: 'academic-2', name: 'Physics', category: 'Academic & Education', level: SkillLevel.INTERMEDIATE, description: 'Physics concepts and applications' },
  { id: 'academic-3', name: 'Chemistry', category: 'Academic & Education', level: SkillLevel.INTERMEDIATE, description: 'Chemistry fundamentals and lab work' },
  { id: 'academic-4', name: 'Biology', category: 'Academic & Education', level: SkillLevel.ADVANCED, description: 'Biological sciences and research' },
  { id: 'academic-5', name: 'History', category: 'Academic & Education', level: SkillLevel.ADVANCED, description: 'World history and historical analysis' },
  { id: 'academic-6', name: 'Literature', category: 'Academic & Education', level: SkillLevel.INTERMEDIATE, description: 'Literary analysis and writing' },
  { id: 'academic-7', name: 'Philosophy', category: 'Academic & Education', level: SkillLevel.ADVANCED, description: 'Philosophical thinking and ethics' },
  { id: 'academic-8', name: 'Economics', category: 'Academic & Education', level: SkillLevel.INTERMEDIATE, description: 'Economic theory and analysis' }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing skills
  await prisma.skill.deleteMany({});
  console.log('🗑️  Cleared existing skills');

  // Create predefined skills
  for (const skillData of predefinedSkills) {
    await prisma.skill.create({
      data: skillData
    });
  }
  console.log(`✅ Created ${predefinedSkills.length} predefined skills`);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 