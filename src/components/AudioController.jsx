import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AudioController = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const tracks = [
    {
      id: "rain",
      name: "Midnight Rain",
      icon: "🌧️",
      // Soft rain ambient sounds
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "piano",
      name: "Lofi Piano",
      icon: "🎹",
      // Melancholic piano
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "library",
      name: "Library Whispers",
      icon: "📚",
      // Quiet ambient
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    },
    {
      id: "insects",
      name: "Night Insects",
      icon: "🦗",
      // Night ambiance
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
    }
  }, [currentTrack]);

  const handleTrackSelect = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Haptic feedback on mobile when selecting track
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="audio-controller">
      <audio ref={audioRef} />

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className="audio-panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="audio-panel-header">Soundscape</div>

            <div className="track-list">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  className={`track-item ${
                    currentTrack?.id === track.id ? "active" : ""
                  }`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <span className="track-icon">{track.icon}</span>
                  <span className="track-name">{track.name}</span>
                </button>
              ))}
            </div>

            {currentTrack && (
              <div className="audio-controls">
                <button
                  className={`control-btn ${isPlaying ? "active" : ""}`}
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button
                  className={`control-btn ${isMuted ? "active" : ""}`}
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`audio-toggle-btn ${isPanelOpen ? "active" : ""}`}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle audio panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {isPlaying ? (
            <>
              <path d="M12 3v18" />
              <path d="M8 8v8" />
              <path d="M16 6v12" />
              <path d="M4 11v2" />
              <path d="M20 10v4" />
            </>
          ) : (
            <>
              <circle cx="5.5" cy="17.5" r="2.5" />
              <circle cx="17.5" cy="15.5" r="2.5" />
              <path d="M8 17V5l12-2v12" />
            </>
          )}
        </svg>
      </motion.button>
    </div>
  );
};

export default AudioController;
