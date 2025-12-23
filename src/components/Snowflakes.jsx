import React, { useMemo } from "react";
import { motion } from "framer-motion";

const Snowflakes = () => {
  // Generate snowflakes with random properties
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.5,
      drift: -30 + Math.random() * 60,
      type: Math.random() > 0.5 ? "❄" : "❅",
    }));
  }, []);

  return (
    <div className="snowflakes-container">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="snowflake-falling"
          initial={{ 
            y: -20, 
            x: 0,
            opacity: 0 
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, flake.drift, flake.drift / 2, flake.drift],
            opacity: [0, flake.opacity, flake.opacity, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
          }}
        >
          {flake.type}
        </motion.div>
      ))}
    </div>
  );
};

export default Snowflakes;
