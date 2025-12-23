import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== SNOWFLAKE CATCHER GAME ====================
export const SnowflakeCatcher = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [snowflakes, setSnowflakes] = useState([]);
  const [basketPos, setBasketPos] = useState(50);
  const [gameActive, setGameActive] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef(null);
  const targetScore = 8;

  // Spawn snowflakes
  useEffect(() => {
    if (!gameActive) return;

    const spawn = () => {
      const id = Date.now() + Math.random();
      setSnowflakes((prev) => [
        ...prev,
        {
          id,
          x: Math.random() * 80 + 10,
          char: Math.random() > 0.3 ? "❄️" : "✨",
          speed: 3 + Math.random() * 2,
        },
      ]);
    };

    spawn();
    const interval = setInterval(spawn, 1200);
    return () => clearInterval(interval);
  }, [gameActive]);

  // Move basket with mouse/touch
  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(10, Math.min(90, x)));
  }, []);

  // Check collision
  useEffect(() => {
    const checkCollision = () => {
      setSnowflakes((prev) => {
        let caught = false;
        const remaining = prev.filter((flake) => {
          const flakeBottom = flake.y || 0;
          const isNearBasket = Math.abs(flake.x - basketPos) < 12;
          const isAtCatchHeight = flakeBottom > 75 && flakeBottom < 90;

          if (isNearBasket && isAtCatchHeight && !caught) {
            caught = true;
            return false;
          }
          return flakeBottom < 100;
        });

        if (caught) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore >= targetScore) {
              setGameActive(false);
              setShowSuccess(true);
              setTimeout(() => onComplete?.(), 2000);
            }
            if (navigator.vibrate) navigator.vibrate(15);
            return newScore;
          });
        }
        return remaining;
      });
    };

    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [basketPos, onComplete]);

  // Animate snowflakes falling
  useEffect(() => {
    if (!gameActive) return;

    const animate = () => {
      setSnowflakes((prev) =>
        prev
          .map((flake) => ({
            ...flake,
            y: (flake.y || 0) + flake.speed * 0.5,
          }))
          .filter((f) => (f.y || 0) < 100)
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [gameActive]);

  return (
    <div
      className="game-container snowflake-catcher"
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="game-header">
        <span className="game-title">❄️ Catch the Snowflakes</span>
        <span className="game-score">
          {score} / {targetScore}
        </span>
      </div>

      <div className="game-area">
        {snowflakes.map((flake) => (
          <motion.span
            key={flake.id}
            className="falling-snowflake"
            style={{ left: `${flake.x}%`, top: `${flake.y || 0}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {flake.char}
          </motion.span>
        ))}

        <motion.div
          className="catcher-basket"
          style={{ left: `${basketPos}%` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          🧺
        </motion.div>
      </div>

      <p className="game-hint">
        Move{" "}
        {typeof window !== "undefined" && "ontouchstart" in window
          ? "your finger"
          : "your mouse"}{" "}
        to catch snowflakes!
      </p>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="game-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="success-emoji">🎉</span>
            <span>Wonderful! You caught them all!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== TREE DECORATOR GAME ====================
export const TreeDecorator = ({ onComplete }) => {
  const [ornaments, setOrnaments] = useState([]);
  const [selectedOrnament, setSelectedOrnament] = useState("🔴");
  const [treeComplete, setTreeComplete] = useState(false);
  const targetOrnaments = 6;

  const ornamentOptions = ["🔴", "🟡", "🔵", "⭐", "🎀", "🔔", "💝", "✨"];

  const handleTreeClick = (e) => {
    if (treeComplete || ornaments.length >= targetOrnaments) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Only allow ornaments within tree shape (triangle approximation)
    const treeTop = 15;
    const treeBottom = 85;
    const treeCenter = 50;
    const progress = (y - treeTop) / (treeBottom - treeTop);
    const maxWidth = progress * 40;

    if (y > treeTop && y < treeBottom && Math.abs(x - treeCenter) < maxWidth) {
      const newOrnament = {
        id: Date.now(),
        x,
        y,
        emoji: selectedOrnament,
        rotation: Math.random() * 20 - 10,
      };

      setOrnaments((prev) => {
        const updated = [...prev, newOrnament];
        if (updated.length >= targetOrnaments) {
          setTreeComplete(true);
          setTimeout(() => onComplete?.(), 2000);
        }
        return updated;
      });

      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className="game-container tree-decorator">
      <div className="game-header">
        <span className="game-title">🎄 Decorate the Tree</span>
        <span className="game-score">
          {ornaments.length} / {targetOrnaments}
        </span>
      </div>

      <div className="ornament-palette">
        {ornamentOptions.map((orn) => (
          <button
            key={orn}
            className={`palette-item ${
              selectedOrnament === orn ? "selected" : ""
            }`}
            onClick={() => setSelectedOrnament(orn)}
          >
            {orn}
          </button>
        ))}
      </div>

      <div className="tree-area" onClick={handleTreeClick}>
        <div className="christmas-tree">
          <div className="tree-star">⭐</div>
          <div className="tree-body">🎄</div>
        </div>

        {ornaments.map((orn) => (
          <motion.span
            key={orn.id}
            className="placed-ornament"
            style={{
              left: `${orn.x}%`,
              top: `${orn.y}%`,
              transform: `rotate(${orn.rotation}deg)`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: orn.rotation }}
          >
            {orn.emoji}
          </motion.span>
        ))}
      </div>

      <p className="game-hint">Tap on the tree to place ornaments!</p>

      <AnimatePresence>
        {treeComplete && (
          <motion.div
            className="game-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="success-emoji">🌟</span>
            <span>Beautiful! Your tree is magical!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== CANDLE LIGHTER GAME ====================
export const CandleLighter = ({ onComplete }) => {
  const [litCandles, setLitCandles] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(0);
  const totalCandles = 5;

  const handleCandleClick = (index) => {
    if (index !== currentCandle || litCandles.includes(index)) return;

    setLitCandles((prev) => [...prev, index]);
    setCurrentCandle((prev) => prev + 1);

    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);

    if (index === totalCandles - 1) {
      setTimeout(() => onComplete?.(), 2000);
    }
  };

  return (
    <div className="game-container candle-lighter">
      <div className="game-header">
        <span className="game-title">🕯️ Light the Candles</span>
        <span className="game-score">
          {litCandles.length} / {totalCandles}
        </span>
      </div>

      <p className="game-instruction">
        Light each candle in order, left to right...
      </p>

      <div className="candles-row">
        {Array.from({ length: totalCandles }).map((_, i) => (
          <motion.button
            key={i}
            className={`candle ${litCandles.includes(i) ? "lit" : ""} ${
              i === currentCandle ? "next" : ""
            }`}
            onClick={() => handleCandleClick(i)}
            whileHover={i === currentCandle ? { scale: 1.1 } : {}}
            whileTap={i === currentCandle ? { scale: 0.95 } : {}}
          >
            <AnimatePresence>
              {litCandles.includes(i) && (
                <motion.span
                  className="flame"
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.2, 1],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    scale: { repeat: Infinity, duration: 0.8 },
                    y: { repeat: Infinity, duration: 1.2 },
                  }}
                >
                  🔥
                </motion.span>
              )}
            </AnimatePresence>
            <span className="candle-body">🕯️</span>
          </motion.button>
        ))}
      </div>

      <p className="game-hint">
        {litCandles.length < totalCandles
          ? `Tap candle ${currentCandle + 1} to light it`
          : "All candles lit! ✨"}
      </p>

      <AnimatePresence>
        {litCandles.length === totalCandles && (
          <motion.div
            className="game-success candle-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="success-emoji">✨</span>
            <span>The room glows with warmth and hope...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== GIFT UNWRAPPER GAME ====================
export const GiftUnwrapper = ({ onComplete }) => {
  const [unwrapProgress, setUnwrapProgress] = useState(0);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const targetProgress = 100;

  const handleShake = () => {
    if (revealed) return;

    setShakeCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsUnwrapping(true);
      }
      return next;
    });

    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleUnwrap = () => {
    if (!isUnwrapping || revealed) return;

    setUnwrapProgress((prev) => {
      const next = Math.min(prev + 8, 100);
      if (next >= 100 && !revealed) {
        setRevealed(true);
        if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100]);
        setTimeout(() => onComplete?.(), 2500);
      }
      return next;
    });
  };

  const gifts = ["🧸", "📚", "🎨", "🎮", "💎", "🌟"];
  const revealedGift = gifts[Math.floor(Math.random() * gifts.length)];

  return (
    <div className="game-container gift-unwrapper">
      <div className="game-header">
        <span className="game-title">🎁 Unwrap Your Gift</span>
      </div>

      {!isUnwrapping ? (
        <>
          <motion.button
            className="gift-box-btn"
            onClick={handleShake}
            animate={{
              rotate: shakeCount > 0 ? [0, -5, 5, -5, 5, 0] : 0,
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="gift-emoji">🎁</span>
            <span className="gift-ribbon">🎀</span>
          </motion.button>
          <p className="game-hint">
            {shakeCount < 3
              ? `Shake the gift! (${shakeCount}/3 shakes)`
              : "Ready to unwrap!"}
          </p>
        </>
      ) : (
        <>
          <div
            className="unwrap-area"
            onMouseMove={handleUnwrap}
            onTouchMove={handleUnwrap}
          >
            <div
              className="wrapping-paper"
              style={{
                clipPath: `inset(0 ${100 - unwrapProgress}% 0 0)`,
                opacity: 1 - (unwrapProgress / 100) * 0.7,
              }}
            >
              <span>🎁</span>
            </div>

            <motion.div
              className="gift-reveal"
              style={{ opacity: unwrapProgress / 100 }}
              animate={revealed ? { scale: [1, 1.3, 1.1] } : {}}
            >
              {revealed ? (
                <span className="revealed-gift">{revealedGift}</span>
              ) : (
                <span className="mystery">?</span>
              )}
            </motion.div>

            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ width: `${unwrapProgress}%` }}
              />
            </div>
          </div>

          <p className="game-hint">
            {!revealed ? "Swipe across the gift to unwrap!" : ""}
          </p>
        </>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div
            className="game-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="success-emoji">🎊</span>
            <span>A magical gift, just for you!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== MAIN STORY JOURNEY ====================
const ImmersiveGames = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);

  const scenes = [
    {
      id: 0,
      type: "story",
      title: "A Winter's Beginning",
      text: "The snow falls gently outside your window. Christmas Eve has arrived, and magic stirs in the cold night air. Something calls to you from beyond the frost...",
      emoji: "🌨️",
      nextText: "Step into the snow...",
    },
    {
      id: 1,
      type: "game",
      game: "snowflake",
      title: "The Snowfall",
      intro:
        "As you step outside, the snowflakes dance around you. Perhaps if you catch enough, they'll show you the way...",
    },
    {
      id: 2,
      type: "story",
      title: "The Forest Path",
      text: "The snowflakes lead you to an old cabin in the woods. Through the window, you see a beautiful Christmas tree waiting to be decorated. The door creaks open at your touch...",
      emoji: "🏠",
      nextText: "Enter the cabin...",
    },
    {
      id: 3,
      type: "game",
      game: "tree",
      title: "The Wishing Tree",
      intro:
        "This isn't any ordinary tree—it's the Wishing Tree. Each ornament placed with love carries a dream into the stars...",
    },
    {
      id: 4,
      type: "story",
      title: "The Quiet Room",
      text: "With the tree aglow, you notice a row of candles on the windowsill. They wait in darkness, each one holding a memory of Christmases past. Perhaps it's time to bring them back to light...",
      emoji: "🪟",
      nextText: "Approach the candles...",
    },
    {
      id: 5,
      type: "game",
      game: "candle",
      title: "Candles of Memory",
      intro:
        "Each flame you light awakens a warm memory. Light them in order, and let the past embrace the present...",
    },
    {
      id: 6,
      type: "story",
      title: "The Gift",
      text: "As the final candle flickers to life, you notice something that wasn't there before—a gift, wrapped in starlight, with your name written in frost. It has waited a long time for this moment...",
      emoji: "✨",
      nextText: "Open your gift...",
    },
    {
      id: 7,
      type: "game",
      game: "gift",
      title: "Your Christmas Gift",
      intro:
        "Some gifts hold more than what meets the eye. This one holds a piece of Christmas magic itself...",
    },
    {
      id: 8,
      type: "ending",
      title: "Christmas Morning",
      text: "As the first light of Christmas morning touches the snow, you realize the true gift was the journey itself. The magic lives in every snowflake caught, every light kindled, every moment of wonder. Merry Christmas, dear traveler. May your heart always find its way home.",
      emoji: "🌅",
    },
  ];

  const handleGameComplete = (gameId) => {
    setCompletedGames((prev) => [...prev, gameId]);
    setTimeout(() => setCurrentScene((prev) => prev + 1), 500);
  };

  const handleNext = () => {
    setCurrentScene((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setCompletedGames([]);
  };

  const scene = scenes[currentScene];

  return (
    <div className="immersive-journey">
      {/* Progress indicator */}
      <div className="journey-progress">
        {scenes.map((s, i) => (
          <span
            key={s.id}
            className={`progress-dot ${i <= currentScene ? "active" : ""} ${
              i === currentScene ? "current" : ""
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="scene-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          {scene.type === "story" && (
            <div className="story-scene">
              <motion.span
                className="scene-emoji"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {scene.emoji}
              </motion.span>
              <h3 className="scene-title">{scene.title}</h3>
              <p className="scene-text">{scene.text}</p>
              <motion.button
                className="scene-next-btn"
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {scene.nextText}
              </motion.button>
            </div>
          )}

          {scene.type === "game" && (
            <div className="game-scene">
              <h3 className="scene-title">{scene.title}</h3>
              <p className="scene-intro">{scene.intro}</p>

              {scene.game === "snowflake" && (
                <SnowflakeCatcher
                  onComplete={() => handleGameComplete("snowflake")}
                />
              )}
              {scene.game === "tree" && (
                <TreeDecorator onComplete={() => handleGameComplete("tree")} />
              )}
              {scene.game === "candle" && (
                <CandleLighter
                  onComplete={() => handleGameComplete("candle")}
                />
              )}
              {scene.game === "gift" && (
                <GiftUnwrapper onComplete={() => handleGameComplete("gift")} />
              )}
            </div>
          )}

          {scene.type === "ending" && (
            <div className="ending-scene">
              <motion.div
                className="ending-stars"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                ⭐ 🌟 ✨ 💫 ⭐
              </motion.div>
              <motion.span
                className="scene-emoji large"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {scene.emoji}
              </motion.span>
              <h3 className="scene-title">{scene.title}</h3>
              <p className="scene-text">{scene.text}</p>

              <div className="journey-summary">
                <span>Your Journey: </span>
                {completedGames.includes("snowflake") && "❄️ "}
                {completedGames.includes("tree") && "🎄 "}
                {completedGames.includes("candle") && "🕯️ "}
                {completedGames.includes("gift") && "🎁 "}
              </div>

              <motion.button
                className="restart-btn"
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                ✨ Experience Again
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveGames;
