import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  onClick?: () => void;
  animationType?: 'pulse' | 'morph' | 'rotate' | 'bounce' | 'scale';
  color?: string;
  disabled?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  size = 24,
  className = '',
  onClick,
  animationType = 'pulse',
  color = 'currentColor',
  disabled = false
}) => {
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const y = useMotionValue(0);

  const scaleTransform = useTransform(scale, [1, 1.2, 1]);
  const rotateTransform = useTransform(rotate, [0, 360]);
  const yTransform = useTransform(y, [0, -10, 0]);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    switch (animationType) {
      case 'pulse':
        scale.set(1.2);
        break;
      case 'morph':
        scale.set(1.1);
        rotate.set(360);
        break;
      case 'rotate':
        rotate.set(360);
        break;
      case 'bounce':
        y.set(-10);
        break;
      case 'scale':
        scale.set(1.3);
        break;
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    scale.set(1);
    rotate.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (disabled || !onClick) return;
    
    // Add click animation
    scale.set(0.9);
    setTimeout(() => scale.set(1), 100);
    onClick();
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'pulse':
        return {
          style: { scale: scaleTransform },
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
        };
      case 'morph':
        return {
          style: { scale: scaleTransform, rotate: rotateTransform },
          whileHover: { scale: 1.1, rotate: 360 },
          transition: { duration: 0.3 }
        };
      case 'rotate':
        return {
          style: { rotate: rotateTransform },
          whileHover: { rotate: 360 },
          transition: { duration: 0.5 }
        };
      case 'bounce':
        return {
          style: { y: yTransform },
          whileHover: { y: -10 },
          animate: { y: [0, -5, 0] },
          transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
        };
      case 'scale':
        return {
          style: { scale: scaleTransform },
          whileHover: { scale: 1.3 },
          whileTap: { scale: 0.9 },
          transition: { duration: 0.2 }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...getAnimationProps()}
    >
      <Icon size={size} color={color} />
    </motion.div>
  );
};

// Specialized animated icons for common actions
export const SwapRequestIcon: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <AnimatedIcon
    icon={require('lucide-react').ArrowLeftRight}
    animationType="morph"
    color="#004030"
    onClick={onClick}
    disabled={disabled}
    className="bg-primary/20 p-2 rounded-full"
  />
);

export const FeedbackIcon: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <AnimatedIcon
    icon={require('lucide-react').MessageSquare}
    animationType="pulse"
    color="#4A9782"
    onClick={onClick}
    disabled={disabled}
    className="bg-secondary/20 p-2 rounded-full"
  />
);

export const LikeIcon: React.FC<{ onClick?: () => void; disabled?: boolean; liked?: boolean }> = ({ onClick, disabled, liked }) => (
  <AnimatedIcon
    icon={liked ? require('lucide-react').Heart : require('lucide-react').Heart}
    animationType="scale"
    color={liked ? "#E74C3C" : "#004030"}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full ${liked ? 'bg-error/20' : 'bg-primary/20'}`}
  />
);

export const ShareIcon: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <AnimatedIcon
    icon={require('lucide-react').Share2}
    animationType="rotate"
    color="#DCD0A8"
    onClick={onClick}
    disabled={disabled}
    className="bg-accent/20 p-2 rounded-full"
  />
);

export const BookmarkIcon: React.FC<{ onClick?: () => void; disabled?: boolean; bookmarked?: boolean }> = ({ onClick, disabled, bookmarked }) => (
  <AnimatedIcon
    icon={bookmarked ? require('lucide-react').Bookmark : require('lucide-react').Bookmark}
    animationType="bounce"
    color={bookmarked ? "#F39C12" : "#004030"}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full ${bookmarked ? 'bg-warning/20' : 'bg-primary/20'}`}
  />
); 