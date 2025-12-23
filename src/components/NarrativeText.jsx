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

      // Larger threshold for easier reveal on desktop
      const revealRadius = isMobile ? 150 : 280;

      // Calculate visibility (0 to 1)
      let newVisibility = 0;
      if (distance < revealRadius) {
        newVisibility = 1 - distance / revealRadius;
        newVisibility = Math.pow(newVisibility, 0.4); // Smoother curve for easier reveal
      }

      setVisibility(newVisibility);

      // Trigger reveal callback once
      if (newVisibility > 0.3 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onReveal?.(id);
      }
    };

    // Run immediately on mouse position change
    checkDistance();
  }, [mousePos, isMobile, id, onReveal]);

  // Calculate styles based on visibility with smoother interpolation
  const smoothVisibility = visibility * visibility * (3 - 2 * visibility); // Smoothstep function
  const opacity = 0.1 + smoothVisibility * 0.9;
  const blur = (1 - smoothVisibility) * 2.5;
  const scale = 0.99 + smoothVisibility * 0.01;

  return (
    <section className="narrative-section">
      <div
        ref={textRef}
        className="narrative-text-wrapper"
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
          transition: 'opacity 0.15s ease, filter 0.15s ease, transform 0.15s ease',
        }}
      >
        <p className="narrative-text">{text}</p>
      </div>
    </section>
  );
};

export default NarrativeText;
