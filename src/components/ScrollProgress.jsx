import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  // Transform for the progress bar width
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Fade out near the end
  const opacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [0.6, 0.6, 0]);

  return (
    <motion.div className="scroll-progress-container" style={{ opacity }}>
      <motion.div className="scroll-progress-bar" style={{ width }} />
    </motion.div>
  );
};

export default ScrollProgress;
