import { Skill } from '../types';

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'technical',
    name: 'Technical & Programming',
    description: 'Software development, programming languages, and technical skills',
    icon: '💻',
    skills: [
      { id: 'tech-1', name: 'JavaScript', category: 'Technical & Programming', level: 'Advanced', description: 'Modern JavaScript and ES6+' },
      { id: 'tech-2', name: 'React', category: 'Technical & Programming', level: 'Expert', description: 'React hooks, context, and performance optimization' },
      { id: 'tech-3', name: 'Python', category: 'Technical & Programming', level: 'Expert', description: 'Data science and web development' },
      { id: 'tech-4', name: 'TypeScript', category: 'Technical & Programming', level: 'Advanced', description: 'Type-safe JavaScript development' },
      { id: 'tech-5', name: 'Node.js', category: 'Technical & Programming', level: 'Advanced', description: 'Server-side JavaScript development' },
      { id: 'tech-6', name: 'SQL', category: 'Technical & Programming', level: 'Intermediate', description: 'Database management and queries' },
      { id: 'tech-7', name: 'Git', category: 'Technical & Programming', level: 'Intermediate', description: 'Version control and collaboration' },
      { id: 'tech-8', name: 'Docker', category: 'Technical & Programming', level: 'Advanced', description: 'Containerization and deployment' },
      { id: 'tech-9', name: 'AWS', category: 'Technical & Programming', level: 'Advanced', description: 'Cloud computing and services' },
      { id: 'tech-10', name: 'Machine Learning', category: 'Technical & Programming', level: 'Expert', description: 'AI and ML algorithms' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative Arts',
    description: 'Visual arts, design, and creative expression',
    icon: '🎨',
    skills: [
      { id: 'creative-1', name: 'Photography', category: 'Creative Arts', level: 'Advanced', description: 'Portrait and landscape photography' },
      { id: 'creative-2', name: 'Digital Art', category: 'Creative Arts', level: 'Intermediate', description: 'Digital painting and illustration' },
      { id: 'creative-3', name: 'Graphic Design', category: 'Creative Arts', level: 'Advanced', description: 'Logo design and visual branding' },
      { id: 'creative-4', name: 'Video Editing', category: 'Creative Arts', level: 'Intermediate', description: 'Video production and editing' },
      { id: 'creative-5', name: 'UI/UX Design', category: 'Creative Arts', level: 'Advanced', description: 'User interface and experience design' },
      { id: 'creative-6', name: 'Drawing', category: 'Creative Arts', level: 'Intermediate', description: 'Traditional drawing and sketching' },
      { id: 'creative-7', name: 'Calligraphy', category: 'Creative Arts', level: 'Beginner', description: 'Beautiful handwriting and lettering' },
      { id: 'creative-8', name: 'Animation', category: 'Creative Arts', level: 'Advanced', description: '2D and 3D animation' }
    ]
  },
  {
    id: 'music',
    name: 'Music & Audio',
    description: 'Musical instruments, production, and audio skills',
    icon: '🎵',
    skills: [
      { id: 'music-1', name: 'Guitar', category: 'Music & Audio', level: 'Intermediate', description: 'Acoustic and electric guitar' },
      { id: 'music-2', name: 'Piano', category: 'Music & Audio', level: 'Advanced', description: 'Classical and contemporary piano' },
      { id: 'music-3', name: 'Music Production', category: 'Music & Audio', level: 'Advanced', description: 'Digital audio workstation and mixing' },
      { id: 'music-4', name: 'Singing', category: 'Music & Audio', level: 'Intermediate', description: 'Vocal training and performance' },
      { id: 'music-5', name: 'Drums', category: 'Music & Audio', level: 'Beginner', description: 'Rhythm and percussion' },
      { id: 'music-6', name: 'Violin', category: 'Music & Audio', level: 'Advanced', description: 'Classical violin performance' },
      { id: 'music-7', name: 'Sound Design', category: 'Music & Audio', level: 'Intermediate', description: 'Audio effects and soundscapes' }
    ]
  },
  {
    id: 'languages',
    name: 'Languages',
    description: 'Foreign languages and communication skills',
    icon: '🌍',
    skills: [
      { id: 'lang-1', name: 'Spanish', category: 'Languages', level: 'Beginner', description: 'Basic conversational Spanish' },
      { id: 'lang-2', name: 'French', category: 'Languages', level: 'Intermediate', description: 'French conversation and grammar' },
      { id: 'lang-3', name: 'German', category: 'Languages', level: 'Beginner', description: 'German basics and pronunciation' },
      { id: 'lang-4', name: 'Mandarin', category: 'Languages', level: 'Beginner', description: 'Chinese language and culture' },
      { id: 'lang-5', name: 'Japanese', category: 'Languages', level: 'Intermediate', description: 'Japanese writing and speaking' },
      { id: 'lang-6', name: 'Italian', category: 'Languages', level: 'Beginner', description: 'Italian conversation and culture' },
      { id: 'lang-7', name: 'Portuguese', category: 'Languages', level: 'Beginner', description: 'Portuguese basics' },
      { id: 'lang-8', name: 'Arabic', category: 'Languages', level: 'Beginner', description: 'Arabic script and conversation' }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Wellness',
    description: 'Health, wellness, and lifestyle skills',
    icon: '🧘',
    skills: [
      { id: 'lifestyle-1', name: 'Cooking', category: 'Lifestyle & Wellness', level: 'Intermediate', description: 'Italian and Mediterranean cuisine' },
      { id: 'lifestyle-2', name: 'Yoga', category: 'Lifestyle & Wellness', level: 'Advanced', description: 'Hatha and Vinyasa yoga' },
      { id: 'lifestyle-3', name: 'Meditation', category: 'Lifestyle & Wellness', level: 'Intermediate', description: 'Mindfulness and meditation techniques' },
      { id: 'lifestyle-4', name: 'Nutrition', category: 'Lifestyle & Wellness', level: 'Advanced', description: 'Healthy eating and meal planning' },
      { id: 'lifestyle-5', name: 'Baking', category: 'Lifestyle & Wellness', level: 'Intermediate', description: 'Pastry and bread making' },
      { id: 'lifestyle-6', name: 'Gardening', category: 'Lifestyle & Wellness', level: 'Beginner', description: 'Organic gardening and plant care' },
      { id: 'lifestyle-7', name: 'Fitness Training', category: 'Lifestyle & Wellness', level: 'Advanced', description: 'Personal training and workout plans' },
      { id: 'lifestyle-8', name: 'Mindfulness', category: 'Lifestyle & Wellness', level: 'Intermediate', description: 'Stress reduction and mental health' }
    ]
  },
  {
    id: 'business',
    name: 'Business & Professional',
    description: 'Professional skills and business development',
    icon: '💼',
    skills: [
      { id: 'business-1', name: 'Public Speaking', category: 'Business & Professional', level: 'Advanced', description: 'Presentation and communication skills' },
      { id: 'business-2', name: 'Project Management', category: 'Business & Professional', level: 'Advanced', description: 'Agile and traditional project management' },
      { id: 'business-3', name: 'Marketing', category: 'Business & Professional', level: 'Intermediate', description: 'Digital marketing and branding' },
      { id: 'business-4', name: 'Sales', category: 'Business & Professional', level: 'Advanced', description: 'Sales techniques and customer relations' },
      { id: 'business-5', name: 'Leadership', category: 'Business & Professional', level: 'Advanced', description: 'Team management and leadership skills' },
      { id: 'business-6', name: 'Negotiation', category: 'Business & Professional', level: 'Intermediate', description: 'Business negotiation strategies' },
      { id: 'business-7', name: 'Financial Planning', category: 'Business & Professional', level: 'Intermediate', description: 'Personal finance and investment' },
      { id: 'business-8', name: 'Entrepreneurship', category: 'Business & Professional', level: 'Advanced', description: 'Starting and running a business' }
    ]
  },
  {
    id: 'crafts',
    name: 'Crafts & DIY',
    description: 'Handmade crafts and do-it-yourself projects',
    icon: '🔨',
    skills: [
      { id: 'crafts-1', name: 'Woodworking', category: 'Crafts & DIY', level: 'Intermediate', description: 'Furniture making and wood crafts' },
      { id: 'crafts-2', name: 'Knitting', category: 'Crafts & DIY', level: 'Beginner', description: 'Hand knitting and crochet' },
      { id: 'crafts-3', name: 'Pottery', category: 'Crafts & DIY', level: 'Intermediate', description: 'Ceramic art and pottery making' },
      { id: 'crafts-4', name: 'Jewelry Making', category: 'Crafts & DIY', level: 'Beginner', description: 'Handmade jewelry and accessories' },
      { id: 'crafts-5', name: 'Sewing', category: 'Crafts & DIY', level: 'Intermediate', description: 'Clothing and textile crafts' },
      { id: 'crafts-6', name: 'Candle Making', category: 'Crafts & DIY', level: 'Beginner', description: 'Handmade candles and soaps' },
      { id: 'crafts-7', name: 'Leather Crafting', category: 'Crafts & DIY', level: 'Intermediate', description: 'Leather goods and accessories' },
      { id: 'crafts-8', name: 'Glass Blowing', category: 'Crafts & DIY', level: 'Advanced', description: 'Glass art and sculpture' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Recreation',
    description: 'Physical activities and recreational sports',
    icon: '⚽',
    skills: [
      { id: 'sports-1', name: 'Tennis', category: 'Sports & Recreation', level: 'Intermediate', description: 'Tennis technique and strategy' },
      { id: 'sports-2', name: 'Swimming', category: 'Sports & Recreation', level: 'Advanced', description: 'Swimming techniques and training' },
      { id: 'sports-3', name: 'Rock Climbing', category: 'Sports & Recreation', level: 'Intermediate', description: 'Indoor and outdoor climbing' },
      { id: 'sports-4', name: 'Golf', category: 'Sports & Recreation', level: 'Beginner', description: 'Golf swing and course management' },
      { id: 'sports-5', name: 'Basketball', category: 'Sports & Recreation', level: 'Intermediate', description: 'Basketball skills and team play' },
      { id: 'sports-6', name: 'Soccer', category: 'Sports & Recreation', level: 'Advanced', description: 'Soccer techniques and tactics' },
      { id: 'sports-7', name: 'Cycling', category: 'Sports & Recreation', level: 'Intermediate', description: 'Road and mountain biking' },
      { id: 'sports-8', name: 'Martial Arts', category: 'Sports & Recreation', level: 'Advanced', description: 'Karate, Judo, and self-defense' }
    ]
  },
  {
    id: 'academic',
    name: 'Academic & Education',
    description: 'Educational subjects and academic skills',
    icon: '📚',
    skills: [
      { id: 'academic-1', name: 'Mathematics', category: 'Academic & Education', level: 'Advanced', description: 'Advanced math and problem solving' },
      { id: 'academic-2', name: 'Physics', category: 'Academic & Education', level: 'Intermediate', description: 'Physics concepts and applications' },
      { id: 'academic-3', name: 'Chemistry', category: 'Academic & Education', level: 'Intermediate', description: 'Chemistry fundamentals and lab work' },
      { id: 'academic-4', name: 'Biology', category: 'Academic & Education', level: 'Advanced', description: 'Biological sciences and research' },
      { id: 'academic-5', name: 'History', category: 'Academic & Education', level: 'Advanced', description: 'World history and historical analysis' },
      { id: 'academic-6', name: 'Literature', category: 'Academic & Education', level: 'Intermediate', description: 'Literary analysis and writing' },
      { id: 'academic-7', name: 'Philosophy', category: 'Academic & Education', level: 'Advanced', description: 'Philosophical thinking and ethics' },
      { id: 'academic-8', name: 'Economics', category: 'Academic & Education', level: 'Intermediate', description: 'Economic theory and analysis' }
    ]
  }
];

// Flatten all skills for easy access
export const allSkills: Skill[] = skillCategories.flatMap(category => category.skills);

// Get skills by category
export const getSkillsByCategory = (categoryId: string): Skill[] => {
  const category = skillCategories.find(cat => cat.id === categoryId);
  return category ? category.skills : [];
};

// Get all category names
export const getCategoryNames = (): string[] => {
  return skillCategories.map(category => category.name);
}; 