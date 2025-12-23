import React, { useMemo } from "react";
import { motion } from "framer-motion";

const Fireflies = () => {
  // Generate fireflies with random properties
  const fireflies = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 20 + Math.random() * 60,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 8,
      size: 4 + Math.random() * 6,
      driftX: -50 + Math.random() * 100,
      driftY: -30 + Math.random() * 60,
    }));
  }, []);

  return (
    <div className="fireflies-container">
      {fireflies.map((fly) => (
        <motion.div
          key={fly.id}
          className="firefly"
          animate={{
            x: [0, fly.driftX, fly.driftX / 2, fly.driftX * 0.8, 0],
            y: [0, fly.driftY, -fly.driftY / 2, fly.driftY * 0.3, 0],
            opacity: [0, 0.9, 0.4, 0.9, 0],
            scale: [0.5, 1, 0.8, 1.1, 0.5],
          }}
          transition={{
            duration: fly.duration,
            delay: fly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            width: fly.size,
            height: fly.size,
          }}
        />
      ))}
    </div>
  );
};

export default Fireflies;
