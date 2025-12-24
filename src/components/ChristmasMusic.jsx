import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

const ChristmasMusic = ({
  registerAudio,
  playTrack,
  pauseTrack,
  currentPlayingTrack,
  setCurrentPlayingTrack,
  shouldPlay = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);
  const panelRef = useRef(null);
  const hasStartedPlaying = useRef(false);

  const christmasTrack = {
    name: "Christmas",
    url: "/wewishyouamerrychirstmas.mp3",
  };

  const START_TIME = 4;
  const isPlaying = currentPlayingTrack === "background";

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowControls(false);
      }
    };

    if (showControls) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showControls]);

  // Register audio on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15;
    registerAudio("background", audio);
  }, [registerAudio]);

  // Start playing when shouldPlay becomes true (user clicked enter button)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !shouldPlay || hasStartedPlaying.current) return;

    const startMusic = async () => {
      try {
        audio.currentTime = START_TIME;
        audio.volume = 0.15;
        await audio.play();
        hasStartedPlaying.current = true;
        setCurrentPlayingTrack("background");
      } catch (err) {
        // Silently handle autoplay prevention
      }
    };

    // Small delay for smooth transition
    const timer = setTimeout(startMusic, 300);
    return () => clearTimeout(timer);
  }, [shouldPlay, setCurrentPlayingTrack]);

  // Handle looping
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      audio.currentTime = START_TIME;
      if (currentPlayingTrack === "background") {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentPlayingTrack]);

  // Pause when another track plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentPlayingTrack !== "background" && !audio.paused) {
      audio.pause();
    }
  }, [currentPlayingTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      pauseTrack("background");
    } else {
      if (audio.currentTime < START_TIME) {
        audio.currentTime = START_TIME;
      }
      playTrack("background", audio);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="christmas-music" ref={panelRef}>
      <audio
        ref={audioRef}
        src={christmasTrack.url}
        preload="auto"
        playsInline
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="christmas-music-panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="christmas-music-header">
              <Music size={14} />
              <span>Merry Christmas</span>
            </div>

            <div className="christmas-music-controls">
              <button
                className={`christmas-control-btn ${isPlaying ? "active" : ""}`}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                className={`christmas-control-btn ${isMuted ? "active" : ""}`}
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`christmas-music-toggle ${showControls ? "active" : ""} ${
          isPlaying ? "playing" : ""
        }`}
        onClick={() => setShowControls(!showControls)}
        whileTap={{ scale: 0.95 }}
      >
        <Music size={20} />
        {isPlaying && !isMuted && (
          <motion.span
            className="playing-indicator"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default ChristmasMusic;
