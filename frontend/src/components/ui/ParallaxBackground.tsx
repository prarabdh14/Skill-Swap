import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

// Parallax Layer Component
const ParallaxLayer: React.FC<{
  speed: number;
  children: React.ReactNode;
  className?: string;
}> = ({ speed, children, className = '' }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed]);

  return (
    <motion.div
      style={{ y }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Floating Particles Component
const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Gradient Orbs Component
const GradientOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl"
        style={{ top: '60%', right: '15%' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-r from-accent/20 to-light/20 rounded-full blur-3xl"
        style={{ bottom: '20%', left: '50%' }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Geometric Shapes Component
const GeometricShapes: React.FC = () => {
  const shapes = [
    { id: 1, type: 'triangle', color: 'from-primary/30 to-secondary/30', position: 'top-20 left-20' },
    { id: 2, type: 'circle', color: 'from-secondary/30 to-accent/30', position: 'top-40 right-32' },
    { id: 3, type: 'square', color: 'from-accent/30 to-light/30', position: 'bottom-32 left-40' },
    { id: 4, type: 'hexagon', color: 'from-primary/30 to-accent/30', position: 'bottom-20 right-20' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute w-32 h-32 bg-gradient-to-br ${shape.color} ${shape.position}`}
          style={{
            clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                      shape.type === 'circle' ? 'circle(50%)' :
                      shape.type === 'square' ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' :
                      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + shape.id * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Simple 3D-like Elements (CSS only)
const Simple3DElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-24 h-24 bg-primary/20 rounded-full"
        style={{ top: '20%', left: '15%' }}
        animate={{
          y: [-10, 10, -10],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-32 h-32 bg-secondary/20 rounded-lg"
        style={{ top: '60%', right: '20%' }}
        animate={{
          y: [10, -10, 10],
          rotate: [0, 180, 360],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-20 h-20 bg-accent/20 rounded-full"
        style={{ bottom: '30%', left: '60%' }}
        animate={{
          x: [-15, 15, -15],
          y: [-15, 15, -15],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  children,
  className = '',
  intensity = 'medium'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'light': return 0.5;
      case 'medium': return 1;
      case 'heavy': return 1.5;
      default: return 1;
    }
  };

  const multiplier = getIntensityMultiplier();

  return (
    <div ref={containerRef} className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
      
      {/* Parallax Layer 1: 3D-like Elements (Slowest) */}
      <ParallaxLayer speed={-100 * multiplier} className="z-10">
        <Simple3DElements />
      </ParallaxLayer>

      {/* Parallax Layer 2: Gradient Orbs (Medium) */}
      <ParallaxLayer speed={-50 * multiplier} className="z-20">
        <GradientOrbs />
      </ParallaxLayer>

      {/* Parallax Layer 3: Geometric Shapes (Medium) */}
      <ParallaxLayer speed={-30 * multiplier} className="z-30">
        <GeometricShapes />
      </ParallaxLayer>

      {/* Parallax Layer 4: Floating Particles (Fastest) */}
      <ParallaxLayer speed={-20 * multiplier} className="z-40">
        <FloatingParticles />
      </ParallaxLayer>

      {/* Content Layer */}
      <div className="relative z-50">
        {children}
      </div>

      {/* Additional Depth Layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
        style={{
          opacity: useTransform(
            useScroll().scrollY,
            [0, 500],
            [0, 0.3]
          ).get(),
        }}
      />
    </div>
  );
};

// Simplified version for specific sections
export const SectionParallax: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 