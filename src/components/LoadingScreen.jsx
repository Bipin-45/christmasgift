import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TreePine, Heart, Star, Gift, Snowflake } from "lucide-react";
import content from "../content.json";

const LoadingScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    if (isFading) return;
    setIsFading(true);
  };

  const handleAnimationComplete = () => {
    if (isFading) {
      onComplete();
    }
  };

  // Floating particles configuration
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    duration: 4 + Math.random() * 3,
    x: Math.random() * 100,
    size: 8 + Math.random() * 8,
  }));

  return (
    <motion.div
      className="welcome-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
      {/* Floating golden particles */}
      <div className="welcome-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="welcome-particle"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [-20, -150],
              x: [0, particle.id % 2 === 0 ? 20 : -20, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${particle.x}%`,
              fontSize: particle.size,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Corner decorations */}
      <motion.div
        className="welcome-corner-decor top-left"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Snowflake size={24} />
      </motion.div>
      <motion.div
        className="welcome-corner-decor top-right"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
      >
        <Star size={20} />
      </motion.div>
      <motion.div
        className="welcome-corner-decor bottom-left"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
      >
        <Gift size={22} />
      </motion.div>
      <motion.div
        className="welcome-corner-decor bottom-right"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        <Snowflake size={20} />
      </motion.div>

      <div className="welcome-content">
        {/* Decorative top */}
        <motion.div
          className="welcome-decoration"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Sparkles size={20} className="welcome-sparkle" />
          <TreePine size={28} className="welcome-tree" />
          <Sparkles size={20} className="welcome-sparkle" />
        </motion.div>

        {/* Glowing orb behind title */}
        <motion.div
          className="welcome-glow-orb"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main greeting */}
        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.welcomeScreen.title}
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {content.welcomeScreen.subtitle}
        </motion.p>

        {/* Intent message */}
        <motion.div
          className="welcome-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>{content.welcomeScreen.message}</p>
          <span className="welcome-heart">
            <Heart size={14} fill="currentColor" />
          </span>
        </motion.div>

        {/* Enter button */}
        <motion.button
          className="welcome-enter-btn"
          onClick={handleEnter}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{content.welcomeScreen.buttonText}</span>
          <Sparkles size={16} />
        </motion.button>
      </div>

      {/* Background decorations */}
      <div className="welcome-bg-decor">
        <div className="welcome-snowflake s1">❄</div>
        <div className="welcome-snowflake s2">❄</div>
        <div className="welcome-snowflake s3">✦</div>
        <div className="welcome-snowflake s4">❄</div>
        <div className="welcome-snowflake s5">✦</div>
        <div className="welcome-snowflake s6">❅</div>
        <div className="welcome-snowflake s7">✧</div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
