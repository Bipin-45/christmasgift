import React, { useMemo, useEffect, useState } from "react";

const Fireflies = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce count on mobile for better performance
  const count = isMobile ? 10 : 18;

  // Generate fireflies with random properties
  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 15 + Math.random() * 70,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 4 + Math.random() * 4,
    }));
  }, [count]);

  return (
    <div className="fireflies-container">
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="firefly"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            width: fly.size,
            height: fly.size,
            animationDuration: `${fly.duration}s`,
            animationDelay: `${fly.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Fireflies;
