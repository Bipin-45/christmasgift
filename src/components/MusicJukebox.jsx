import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MusicJukebox = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vinylSpin, setVinylSpin] = useState(false);
  const [likes, setLikes] = useState({});

  const tracks = [
    {
      id: 1,
      title: "O Holy Night",
      artist: "Traditional",
      mood: "reverent",
      color: "#8b4557",
      story:
        "In the quiet of midnight, this hymn rises like starlight through stained glass windows. Close your eyes and feel centuries of wonder.",
      vinyl: "🎵",
    },
    {
      id: 2,
      title: "Carol of the Bells",
      artist: "Ukrainian Carol",
      mood: "magical",
      color: "#2d5a4e",
      story:
        "Silver bells cascade like snowflakes in a dance. Each note rings with the excitement of children on Christmas morning.",
      vinyl: "🔔",
    },
    {
      id: 3,
      title: "Silent Night",
      artist: "Franz Gruber",
      mood: "peaceful",
      color: "#3d4a6e",
      story:
        "The world holds its breath. Snow falls softly. Somewhere, a mother hums to her sleeping child.",
      vinyl: "❄️",
    },
    {
      id: 4,
      title: "White Christmas",
      artist: "Irving Berlin",
      mood: "nostalgic",
      color: "#6b4a3d",
      story:
        "Memories of Christmases past drift through the melody—laughter, warmth, the crinkle of wrapping paper.",
      vinyl: "🎄",
    },
  ];

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    setVinylSpin(true);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleLike = (trackId, e) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setVinylSpin(!vinylSpin);
  };

  return (
    <div className="music-jukebox">
      <div className="jukebox-header">
        <motion.div
          className="jukebox-icon"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📻
        </motion.div>
        <h3 className="jukebox-title">Christmas Jukebox</h3>
        <p className="jukebox-subtitle">Tap a record to hear its story</p>
      </div>

      {/* Vinyl Player */}
      <AnimatePresence>
        {selectedTrack && (
          <motion.div
            className="vinyl-player"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ "--track-color": selectedTrack.color }}
          >
            <div className="vinyl-container" onClick={togglePlay}>
              <motion.div
                className="vinyl-disc"
                animate={{ rotate: vinylSpin ? 360 : 0 }}
                transition={{
                  duration: 3,
                  repeat: vinylSpin ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <div className="vinyl-center">
                  <span className="vinyl-emoji">{selectedTrack.vinyl}</span>
                </div>
                <div className="vinyl-grooves" />
              </motion.div>
              <div className="vinyl-arm" data-playing={isPlaying} />
            </div>

            <div className="now-playing">
              <span className="now-playing-label">
                {isPlaying ? "♪ Now Playing" : "⏸ Paused"}
              </span>
              <h4 className="now-playing-title">{selectedTrack.title}</h4>
              <p className="now-playing-artist">{selectedTrack.artist}</p>
              <p className="now-playing-story">{selectedTrack.story}</p>

              <div className="player-controls">
                <button className="control-btn-player" onClick={togglePlay}>
                  {isPlaying ? "⏸" : "▶️"}
                </button>
                <button
                  className={`control-btn-player heart ${
                    likes[selectedTrack.id] ? "liked" : ""
                  }`}
                  onClick={(e) => handleLike(selectedTrack.id, e)}
                >
                  {likes[selectedTrack.id] ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Grid */}
      <div className="track-grid">
        {tracks.map((track, index) => (
          <motion.button
            key={track.id}
            className={`track-record ${
              selectedTrack?.id === track.id ? "active" : ""
            }`}
            onClick={() => handleTrackSelect(track)}
            style={{ "--track-color": track.color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="record-disc">
              <span className="record-emoji">{track.vinyl}</span>
            </div>
            <div className="record-info">
              <span className="record-title">{track.title}</span>
              <span className="record-mood">{track.mood}</span>
            </div>
            {likes[track.id] && <span className="record-liked">❤️</span>}
          </motion.button>
        ))}
      </div>

      {/* Mini interaction hint */}
      <motion.p
        className="jukebox-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        💡 Tip: Click the vinyl to play/pause • Double-tap to like
      </motion.p>
    </div>
  );
};

export default MusicJukebox;
