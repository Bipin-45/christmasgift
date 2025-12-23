import React, { useMemo, useEffect, useState } from "react";

const Snowflakes = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce count on mobile for better performance
  const count = isMobile ? 20 : 35;

  // Generate snowflakes with random properties
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 0.6 + Math.random() * 0.8,
      opacity: 0.4 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <div className="snowflakes-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake-falling"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;
