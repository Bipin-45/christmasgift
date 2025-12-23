import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TreePine, Heart } from "lucide-react";
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

  return (
    <motion.div
      className="welcome-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
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
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
