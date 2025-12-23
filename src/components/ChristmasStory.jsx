import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChristmasStory = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [choices, setChoices] = useState({});
  const [collectedItems, setCollectedItems] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [ornamentsCaught, setOrnamentsCaught] = useState(0);
  const [fallingOrnament, setFallingOrnament] = useState(null);

  // Story chapters with choices
  const chapters = [
    {
      id: 0,
      title: "The Journey Begins",
      text: "The clock strikes midnight on Christmas Eve. You're curled up by the window, watching snow blanket the sleeping town below. A soft glow catches your eye—something magical stirs in the attic above...",
      prompt: "What do you do?",
      choices: [
        {
          id: "investigate",
          text: "🕯️ Light a candle and investigate",
          next: 1,
        },
        { id: "listen", text: "👂 Stay quiet and listen carefully", next: 1 },
      ],
      bgEmoji: "🌙",
    },
    {
      id: 1,
      title: "The Attic Discovery",
      text: "Creaking stairs lead you upward. Dust motes dance in moonbeams. There, in the corner, sits an old music box—its melody faint but familiar. Beside it, a letter addressed simply: 'To the one who believes.'",
      prompt: "The music box begins to play...",
      choices: [
        { id: "open", text: "📜 Open the mysterious letter", next: 2 },
        { id: "wind", text: "🎵 Wind up the music box", next: 2 },
      ],
      bgEmoji: "✨",
      collectible: { emoji: "🎵", name: "Music Box Melody" },
    },
    {
      id: 2,
      title: "The Christmas Wish",
      text: "The letter unfolds with a whisper of old paper and pine. Written in silver ink: 'One wish, freely given on Christmas Eve, holds the power to ripple across all the winters yet to come. What does your heart truly long for?'",
      prompt: "Close your eyes and make your wish...",
      choices: [
        {
          id: "peace",
          text: "🕊️ I wish for peace and warmth for all",
          next: 3,
        },
        { id: "together", text: "💝 I wish to be with those I love", next: 3 },
        { id: "magic", text: "✨ I wish to keep believing in magic", next: 3 },
      ],
      bgEmoji: "⭐",
      collectible: { emoji: "📜", name: "Silver Letter" },
    },
    {
      id: 3,
      title: "The Gift",
      text: "As your wish takes form, the attic transforms. Starlight pours through the window. The music box plays louder now—a carol you know by heart. You realize: the magic was never in the attic. It was in you, all along.",
      prompt: "Merry Christmas, dreamer.",
      choices: [],
      bgEmoji: "🎄",
      collectible: { emoji: "⭐", name: "Christmas Star" },
      isEnding: true,
    },
  ];

  // Catch falling ornaments mini-game
  useEffect(() => {
    if (currentChapter >= 2) {
      const spawnOrnament = () => {
        const ornaments = ["🎄", "⭐", "🎁", "🔔", "❄️", "🍪", "🎅"];
        setFallingOrnament({
          id: Date.now(),
          emoji: ornaments[Math.floor(Math.random() * ornaments.length)],
          left: Math.random() * 80 + 10,
        });

        setTimeout(() => setFallingOrnament(null), 3000);
      };

      const interval = setInterval(spawnOrnament, 4000);
      return () => clearInterval(interval);
    }
  }, [currentChapter]);

  const catchOrnament = useCallback(() => {
    if (fallingOrnament) {
      setOrnamentsCaught((prev) => prev + 1);
      setFallingOrnament(null);
      if (navigator.vibrate) navigator.vibrate(20);
    }
  }, [fallingOrnament]);

  const handleChoice = (choice) => {
    setChoices((prev) => ({ ...prev, [currentChapter]: choice.id }));

    // Collect item if chapter has one
    const chapter = chapters[currentChapter];
    if (
      chapter.collectible &&
      !collectedItems.find((i) => i.name === chapter.collectible.name)
    ) {
      setCollectedItems((prev) => [...prev, chapter.collectible]);
      if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    }

    if (choice.next !== undefined) {
      setTimeout(() => setCurrentChapter(choice.next), 500);
    }
  };

  const handleStarClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5 && !showReward) {
        setShowReward(true);
        if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);
      }
      return newCount;
    });
  };

  const currentChapterData = chapters[currentChapter];

  return (
    <div className="christmas-story">
      {/* Collected Items Display */}
      <motion.div
        className="collected-items"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="collected-label">Your Journey:</span>
        <div className="items-row">
          {collectedItems.map((item, i) => (
            <motion.span
              key={item.name}
              className="collected-item"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              title={item.name}
            >
              {item.emoji}
            </motion.span>
          ))}
          {collectedItems.length === 0 && (
            <span className="no-items">Collect memories along the way...</span>
          )}
        </div>
      </motion.div>

      {/* Mini-game: Catch falling ornaments */}
      <AnimatePresence>
        {fallingOrnament && (
          <motion.button
            key={fallingOrnament.id}
            className="falling-ornament-btn"
            style={{ left: `${fallingOrnament.left}%` }}
            initial={{ top: "-10%", opacity: 0 }}
            animate={{ top: "80%", opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 3, ease: "linear" }}
            onClick={catchOrnament}
            whileHover={{ scale: 1.3 }}
          >
            {fallingOrnament.emoji}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ornament counter */}
      {ornamentsCaught > 0 && (
        <motion.div
          className="ornament-counter"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🎁 {ornamentsCaught} caught!
        </motion.div>
      )}

      {/* Story Chapter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter}
          className="story-chapter"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Chapter background emoji */}
          <motion.span
            className="chapter-bg-emoji"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            onClick={handleStarClick}
          >
            {currentChapterData.bgEmoji}
          </motion.span>

          <h3 className="chapter-title">{currentChapterData.title}</h3>

          <p className="chapter-text">{currentChapterData.text}</p>

          {currentChapterData.collectible && (
            <motion.div
              className="collectible-notice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              ✨ You found: {currentChapterData.collectible.emoji}{" "}
              {currentChapterData.collectible.name}
            </motion.div>
          )}

          <p className="chapter-prompt">{currentChapterData.prompt}</p>

          {/* Choices */}
          <div className="story-choices">
            {currentChapterData.choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                className="story-choice-btn"
                onClick={() => handleChoice(choice)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {choice.text}
              </motion.button>
            ))}
          </div>

          {/* Ending */}
          {currentChapterData.isEnding && (
            <motion.div
              className="story-ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="ending-stars">⭐ 🌟 ✨ 🌟 ⭐</div>
              <p className="ending-message">
                Your Christmas wish has been sealed in starlight.
                <br />
                May it find its way to you.
              </p>
              <button
                className="restart-btn"
                onClick={() => {
                  setCurrentChapter(0);
                  setChoices({});
                  setCollectedItems([]);
                }}
              >
                🔄 Begin Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Secret reward for clicking star */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="secret-reward"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <span className="reward-text">🎁 Secret Found!</span>
            <span className="reward-sub">
              You discovered the hidden magic ✨
            </span>
            <button onClick={() => setShowReward(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChristmasStory;
