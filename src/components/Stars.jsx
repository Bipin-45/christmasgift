import React, { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Stars = ({ mousePos }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.7, 0.85], [1, 0.8, 0]);

  const elements = useMemo(() => {
    const items = [];

    // Magic dust particles - these will sparkle when light passes over
    for (let i = 0; i < 60; i++) {
      items.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        baseOpacity: 0.08 + Math.random() * 0.07,
        type: "dust",
      });
    }

    // Gentle snowflakes
    for (let i = 0; i < 25; i++) {
      items.push({
        id: 100 + i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 10,
        baseOpacity: 0.05 + Math.random() * 0.1,
        type: "snowflake",
      });
    }

    // Golden sparkle stars
    for (let i = 0; i < 15; i++) {
      items.push({
        id: 200 + i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 6,
        baseOpacity: 0.1 + Math.random() * 0.15,
        type: "sparkle",
      });
    }

    return items;
  }, []);

  return (
    <motion.div className="stars-container" style={{ opacity }}>
      {elements.map((el) => {
        if (el.type === "snowflake") {
          return (
            <div
              key={el.id}
              className="snowflake-magic falling"
              style={{
                left: `${el.left}%`,
                width: el.size,
                height: el.size,
                opacity: el.baseOpacity,
                animationDelay: `${el.delay}s`,
                animationDuration: `${el.duration}s`,
              }}
            />
          );
        }
        if (el.type === "sparkle") {
          return (
            <div
              key={el.id}
              className="golden-sparkle"
              style={{
                left: `${el.left}%`,
                top: `${el.top}%`,
                width: el.size,
                height: el.size,
                opacity: el.baseOpacity,
                animationDelay: `${el.delay}s`,
              }}
            />
          );
        }
        return (
          <div
            key={el.id}
            className="magic-dust"
            style={{
              left: `${el.left}%`,
              top: `${el.top}%`,
              width: el.size,
              height: el.size,
              opacity: el.baseOpacity,
              animationDelay: `${el.delay}s`,
            }}
          />
        );
      })}
    </motion.div>
  );
};

export default Stars;
