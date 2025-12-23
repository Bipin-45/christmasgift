import React, { useMemo } from "react";

// SVG Icons for Christmas decorations
const Snowflake = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    <line x1="12" y1="2" x2="9" y2="5" />
    <line x1="12" y1="2" x2="15" y2="5" />
    <line x1="12" y1="22" x2="9" y2="19" />
    <line x1="12" y1="22" x2="15" y2="19" />
    <line x1="2" y1="12" x2="5" y2="9" />
    <line x1="2" y1="12" x2="5" y2="15" />
    <line x1="22" y1="12" x2="19" y2="9" />
    <line x1="22" y1="12" x2="19" y2="15" />
  </svg>
);

const Bell = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C10.9 2 10 2.9 10 4V4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

const ChristmasTree = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <polygon points="12,2 4,12 8,12 3,20 21,20 16,12 20,12" />
    <rect x="10" y="20" width="4" height="3" />
    <circle cx="12" cy="2" r="1" fill="#ffd700" />
    <circle cx="8" cy="10" r="0.8" fill="#ff4444" />
    <circle cx="14" cy="8" r="0.8" fill="#ffd700" />
    <circle cx="10" cy="14" r="0.8" fill="#44aaff" />
    <circle cx="15" cy="13" r="0.8" fill="#ff4444" />
    <circle cx="7" cy="16" r="0.8" fill="#ffd700" />
    <circle cx="16" cy="17" r="0.8" fill="#44aaff" />
  </svg>
);

const Holly = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <ellipse
      cx="8"
      cy="12"
      rx="5"
      ry="8"
      fill="#228B22"
      transform="rotate(-30 8 12)"
    />
    <ellipse
      cx="16"
      cy="12"
      rx="5"
      ry="8"
      fill="#228B22"
      transform="rotate(30 16 12)"
    />
    <circle cx="10" cy="8" r="2.5" fill="#cc0000" />
    <circle cx="14" cy="8" r="2.5" fill="#cc0000" />
    <circle cx="12" cy="5" r="2.5" fill="#cc0000" />
  </svg>
);

const Candy = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2C10 2 8 3 8 6C8 8 9 10 9 12C9 14 7 18 7 20C7 21.5 8.5 22 10 22"
      stroke="#ff0000"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M12 2C10 2 8 3 8 6C8 8 9 10 9 12C9 14 7 18 7 20C7 21.5 8.5 22 10 22"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="3 3"
    />
    <circle cx="16" cy="6" r="4" fill="#ff0000" />
    <circle cx="16" cy="6" r="4" fill="white" fillOpacity="0.3" />
  </svg>
);

const Star = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
  </svg>
);

const Ornament = ({ size = 24, className = "", color = "#ff4444" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="14" r="8" fill={color} />
    <rect x="10" y="4" width="4" height="4" rx="1" fill="#ffd700" />
    <ellipse
      cx="12"
      cy="14"
      rx="6"
      ry="3"
      fill="white"
      fillOpacity="0.2"
      transform="rotate(-20 12 14)"
    />
  </svg>
);

const decorationTypes = [
  { component: Snowflake, color: "rgba(255, 255, 255, 0.6)" },
  { component: Bell, color: "rgba(255, 215, 0, 0.7)" },
  { component: ChristmasTree, color: "rgba(34, 139, 34, 0.8)" },
  { component: Holly, color: "rgba(34, 139, 34, 0.8)" },
  { component: Star, color: "rgba(255, 215, 0, 0.7)" },
  { component: Ornament, color: "rgba(255, 68, 68, 0.7)" },
  { component: Candy, color: "rgba(255, 255, 255, 0.7)" },
];

const ChristmasDecorations = () => {
  // Generate positions - reduced count for better performance
  const decorations = useMemo(() => {
    const items = [];
    const positions = [
      // Spread across page - ~25 items total for good coverage without lag
      { x: 5, y: 5 },
      { x: 50, y: 3 },
      { x: 92, y: 6 },
      { x: 15, y: 18 },
      { x: 75, y: 15 },
      { x: 8, y: 32 },
      { x: 45, y: 28 },
      { x: 88, y: 35 },
      { x: 22, y: 45 },
      { x: 65, y: 42 },
      { x: 95, y: 48 },
      { x: 5, y: 55 },
      { x: 38, y: 58 },
      { x: 78, y: 52 },
      { x: 18, y: 68 },
      { x: 55, y: 65 },
      { x: 92, y: 70 },
      { x: 8, y: 78 },
      { x: 42, y: 82 },
      { x: 72, y: 75 },
      { x: 25, y: 92 },
      { x: 58, y: 88 },
      { x: 85, y: 95 },
    ];

    positions.forEach((pos, index) => {
      const typeIndex = index % decorationTypes.length;
      const size = 14 + (index % 5) * 3; // Deterministic sizes: 14-26px

      items.push({
        id: index,
        type: decorationTypes[typeIndex],
        x: pos.x,
        y: pos.y,
        size,
      });
    });

    return items;
  }, []);

  return (
    <div className="christmas-decorations">
      {decorations.map((decoration) => {
        const IconComponent = decoration.type.component;
        return (
          <div
            key={decoration.id}
            className="decoration-item"
            style={{
              left: `${decoration.x}%`,
              top: `${decoration.y}%`,
              color: decoration.type.color,
              opacity: 0.6,
              transform: `rotate(${((decoration.id * 15) % 30) - 15}deg)`,
            }}
          >
            <IconComponent
              size={decoration.size}
              color={decoration.type.color}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChristmasDecorations;
