import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface ThreeDProfileCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export const ThreeDProfileCard: React.FC<ThreeDProfileCardProps> = ({ front, back, className = '' }) => {
  const [flipped, setFlipped] = React.useState(false);
  const rotateY = useMotionValue(0);
  const rotate = useTransform(rotateY, [0, 180], ["0deg", "180deg"]);

  const handleMouseEnter = () => {
    setFlipped(true);
    rotateY.set(180);
  };
  const handleMouseLeave = () => {
    setFlipped(false);
    rotateY.set(0);
  };

  return (
    <div
      className={`perspective-1000 w-full h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateY: rotate, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full min-h-[320px]"
      >
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ zIndex: flipped ? 0 : 2 }}
        >
          {front}
        </div>
        <div
          className="absolute w-full h-full backface-hidden rotate-y-180"
          style={{ zIndex: flipped ? 2 : 0 }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

// CSS for 3D effect (add to global CSS or module)
// .perspective-1000 { perspective: 1000px; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); } 