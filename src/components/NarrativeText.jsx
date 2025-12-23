import React, { useRef, useState, useEffect } from "react";

const NarrativeText = ({ id, text, mousePos, isMobile, onReveal }) => {
  const textRef = useRef(null);
  const [visibility, setVisibility] = useState(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const checkDistance = () => {
      if (!textRef.current) return;

      const rect = textRef.current.getBoundingClientRect();
      const textCenterX = rect.left + rect.width / 2;
      const textCenterY = rect.top + rect.height / 2;

      // Parse mouse position
      const mouseX = parseFloat(mousePos.x) || window.innerWidth / 2;
      const mouseY = parseFloat(mousePos.y) || window.innerHeight / 2;

      // Calculate distance
      const dx = mouseX - textCenterX;
      const dy = mouseY - textCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Threshold based on device
      const revealRadius = isMobile ? 120 : 200;

      // Calculate visibility (0 to 1)
      let newVisibility = 0;
      if (distance < revealRadius) {
        newVisibility = 1 - distance / revealRadius;
        newVisibility = Math.pow(newVisibility, 0.5); // Ease the curve
      }

      setVisibility(newVisibility);

      // Trigger reveal callback once
      if (newVisibility > 0.5 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onReveal?.(id);
      }
    };

    // Run check frequently for smooth updates
    const interval = setInterval(checkDistance, 16);
    checkDistance(); // Initial check

    return () => clearInterval(interval);
  }, [mousePos, isMobile, id, onReveal]);

  // Calculate styles based on visibility
  const opacity = 0.08 + visibility * 0.92;
  const blur = (1 - visibility) * 3;
  const scale = 0.98 + visibility * 0.02;

  return (
    <section className="narrative-section">
      <div
        ref={textRef}
        className="narrative-text-wrapper"
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
        }}
      >
        <p className="narrative-text">{text}</p>
      </div>
    </section>
  );
};

export default NarrativeText;
