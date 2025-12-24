import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";

const ChristmasMusic = ({
  registerAudio,
  playTrack,
  pauseTrack,
  currentPlayingTrack,
  setCurrentPlayingTrack,
  shouldPlay = false,
}) => {
  const audioRef = useRef(null);
  const hasStartedPlaying = useRef(false);

  const christmasTrack = {
    name: "Christmas",
    url: "/wewishyouamerrychirstmas.mp3",
  };

  const START_TIME = 4;
  const isPlaying = currentPlayingTrack === "background";

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

  return (
    <div className="christmas-music-simple">
      <audio
        ref={audioRef}
        src={christmasTrack.url}
        preload="auto"
        playsInline
      />

      <motion.button
        className={`music-btn ${isPlaying ? "playing" : ""}`}
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="music-btn-inner">
          {isPlaying ? <Pause size={18} /> : <Music size={18} />}
        </div>
        {isPlaying && (
          <>
            <span className="music-wave wave1"></span>
            <span className="music-wave wave2"></span>
            <span className="music-wave wave3"></span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ChristmasMusic;
