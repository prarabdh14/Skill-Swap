import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { User } from '../../types';

interface ThreeDCarouselProps {
  users: User[];
  onUserSelect?: (user: User) => void;
  autoRotate?: boolean;
  className?: string;
}

interface CarouselItemProps {
  user: User;
  index: number;
  totalItems: number;
  currentRotation: number;
  onSelect: (user: User) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ user, index, totalItems, currentRotation, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  
  // Calculate position in 3D space
  const radius = 300;
  const angle = (index / totalItems) * Math.PI * 2 + currentRotation;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const scale = Math.cos(angle) * 0.3 + 0.7; // Scale based on position
  const opacity = Math.cos(angle) * 0.3 + 0.7; // Opacity based on position

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-48 h-64 cursor-pointer"
      style={{
        x: x - 96, // Center the card (half width)
        y: -128, // Center the card (half height)
        z: z,
        scale: scale,
        opacity: opacity,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: scale * 1.1,
        z: z + 50,
        transition: { duration: 0.2 }
      }}
      onClick={() => onSelect(user)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`w-full h-full bg-light/95 backdrop-blur-sm rounded-xl shadow-lg border-2 transition-all duration-300 ${
          hovered ? 'border-primary shadow-primary/30' : 'border-secondary'
        }`}
        style={{
          transform: `rotateY(${-angle * 180 / Math.PI}deg)`,
        }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="text-center space-y-3">
            <img
              src={user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-200"
            />
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {user.name}
            </h3>
            <div className="text-xs text-gray-600">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span>⭐ {user.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span>🔄 {user.swapsCompleted} swaps</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {user.skillsOffered.slice(0, 2).map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-1 bg-secondary/20 text-primary text-xs rounded-full"
                >
                  {skill.name}
                </span>
              ))}
              {user.skillsOffered.length > 2 && (
                <span className="px-2 py-1 bg-accent/20 text-primary text-xs rounded-full">
                  +{user.skillsOffered.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
  users,
  onUserSelect,
  autoRotate = true,
  className = ''
}) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentRotation(prev => prev + 0.02);
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onUserSelect?.(user);
  };

  const handleRotateLeft = () => {
    setCurrentRotation(prev => prev - 0.5);
  };

  const handleRotateRight = () => {
    setCurrentRotation(prev => prev + 0.5);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  if (users.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No users available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-96 ${className}`}>
      {/* 3D Carousel Container */}
      <div 
        className="relative w-full h-full bg-gradient-to-br from-primary via-secondary to-accent rounded-xl overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Carousel Items */}
        <div className="relative w-full h-full">
          {users.map((user, index) => (
            <CarouselItem
              key={user.id}
              user={user}
              index={index}
              totalItems={users.length}
              currentRotation={currentRotation}
              onSelect={handleUserSelect}
            />
          ))}
        </div>

        {/* Center Point Indicator */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/30 rounded-full transform -translate-x-2 -translate-y-2" />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRotateLeft}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAutoRotate}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          {isAutoRotating ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRotateRight}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <p>💡 Hover over cards to see details</p>
        <p>🖱️ Click to select a user</p>
        <p>🔄 Use controls to navigate</p>
      </div>

      {/* Selected User Info */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs"
        >
          <h3 className="font-semibold mb-2">{selectedUser.name}</h3>
          <p className="text-sm opacity-90">
            Rating: ⭐ {selectedUser.rating.toFixed(1)} | Swaps: 🔄 {selectedUser.swapsCompleted}
          </p>
          <div className="mt-2">
            <p className="text-xs opacity-75">Skills: {selectedUser.skillsOffered.slice(0, 3).map(s => s.name).join(', ')}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 