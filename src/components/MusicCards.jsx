import React from "react";
import { motion } from "framer-motion";

const MusicCards = () => {
  const tracks = [
    {
      id: 1,
      title: "O Holy Night",
      artist: "Traditional Christmas",
      description:
        "A timeless hymn that fills the soul with reverence and wonder on this sacred night.",
      emoji: "⭐",
    },
    {
      id: 2,
      title: "Carol of the Bells",
      artist: "Ukrainian Carol",
      description:
        "Dancing bells and cascading melodies that capture the magic of Christmas Eve.",
      emoji: "🔔",
    },
    {
      id: 3,
      title: "Silent Night",
      artist: "Franz Xaver Gruber",
      description:
        "Peace descends like fresh snow. All is calm, all is bright.",
      emoji: "❄️",
    },
    {
      id: 4,
      title: "Have Yourself a Merry Little Christmas",
      artist: "Classic Holiday",
      description: "Warm wishes and gentle hope wrapped in nostalgic melody.",
      emoji: "🎄",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="book-cards-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {tracks.map((track) => (
        <motion.article
          key={track.id}
          className="book-card"
          variants={cardVariants}
          whileHover={{
            y: -8,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="book-number">{track.emoji}</span>
          <h3 className="book-title">{track.title}</h3>
          <p className="book-author">by {track.artist}</p>
          <p className="book-description">{track.description}</p>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default MusicCards;
