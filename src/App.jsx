import React, { useState, useEffect, useCallback, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Flame,
  TreePine,
  Music2,
  Coffee,
  Clock,
  Star,
  Mail,
  Heart,
  Sparkles,
  Music,
  Play,
  Pause,
} from "lucide-react";
import ChristmasMusic from "./components/ChristmasMusic";
import ChristmasDecorations from "./components/ChristmasDecorations";
import NarrativeText from "./components/NarrativeText";
import Stars from "./components/Stars";
import Snowflakes from "./components/Snowflakes";
import Fireflies from "./components/Fireflies";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import content from "./content.json";
import "./App.css";

// Helper function to get Christmas time display
const getChristmasTime = () => {
  const now = new Date();
  const freezeDate = new Date(2025, 11, 26, 0, 0, 0); // Dec 26, 2025 00:00:00

  // If after Dec 26, 2025 midnight, freeze at Dec 25 2:14 AM
  if (now >= freezeDate) {
    return {
      time: "2:14 AM",
      date: "December 25th",
    };
  }

  // Otherwise show current time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = now.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  return {
    time: `${displayHours}:${displayMinutes} ${ampm}`,
    date: `${months[now.getMonth()]} ${day}${suffix}`,
  };
};

function App() {
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });
  const [isMobile, setIsMobile] = useState(false);
  const [revealedTexts, setRevealedTexts] = useState(new Set());
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null); // null, 'background', or track id
  const [currentTime, setCurrentTime] = useState(getChristmasTime());
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const containerRef = useRef(null);
  const audioRefs = useRef({});

  const { scrollYProgress } = useScroll();

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getChristmasTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle playing a track - pauses all others
  const playTrack = useCallback((trackId, audioElement) => {
    // Pause all other audio
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== trackId && audio && !audio.paused) {
        audio.pause();
      }
    });

    // Play the selected track
    if (audioElement) {
      audioElement.play().catch(() => {});
      setCurrentPlayingTrack(trackId);
    }
  }, []);

  // Handle pausing a track
  const pauseTrack = useCallback(
    (trackId) => {
      const audio = audioRefs.current[trackId];
      if (audio) {
        audio.pause();
      }
      if (currentPlayingTrack === trackId) {
        setCurrentPlayingTrack(null);
      }
    },
    [currentPlayingTrack]
  );

  // Register audio ref
  const registerAudio = useCallback((trackId, audioElement) => {
    audioRefs.current[trackId] = audioElement;
  }, []);

  // Background - deep forest green Christmas atmosphere
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    ["#062c17", "#062c17", "#0a3d22"]
  );

  const sunriseOpacity = useTransform(
    scrollYProgress,
    [0.82, 0.92, 1],
    [0, 0.4, 0.7]
  );

  // Flashlight fades out during sunrise
  const flashlightOpacity = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95],
    [1, 1, 0]
  );

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide intro on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowIntro(false);
      } else {
        setShowIntro(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Throttled mouse/touch movement for flashlight - optimized for 60fps
  const lastMoveTime = useRef(0);
  const rafRef = useRef(null);

  const handleMove = useCallback((clientX, clientY) => {
    const now = Date.now();
    if (now - lastMoveTime.current < 16) return; // 60fps throttle
    lastMoveTime.current = now;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({
        x: `${clientX}px`,
        y: `${clientY}px`,
      });
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMove]);

  // Haptic feedback when text is revealed
  const triggerHaptic = useCallback(
    (id) => {
      if (!revealedTexts.has(id)) {
        setRevealedTexts((prev) => new Set([...prev, id]));
        if (navigator.vibrate) {
          navigator.vibrate(15);
        }
      }
    },
    [revealedTexts]
  );

  // Flashlight radius based on device
  const flashlightRadius = isMobile ? "100px" : "180px";

  // Loading complete handler - also triggers music
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Music will start via the shouldPlay prop change
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {/* Christmas Music - rendered outside conditional to prevent remount */}
      <ChristmasMusic
        registerAudio={registerAudio}
        playTrack={playTrack}
        pauseTrack={pauseTrack}
        currentPlayingTrack={currentPlayingTrack}
        setCurrentPlayingTrack={setCurrentPlayingTrack}
        shouldPlay={!isLoading}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="welcome" onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="main"
            className="app-container"
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated Background */}
            <motion.div
              className="background-layer"
              style={{ backgroundColor }}
            />

            {/* Sunrise Gradient Overlay */}
            <motion.div
              className="sunrise-overlay"
              style={{ opacity: sunriseOpacity }}
            />

            {/* Stars */}
            <Stars />

            {/* Falling Snowflakes */}
            <Snowflakes />

            {/* Floating Fireflies */}
            <Fireflies />

            {/* Christmas Decorations */}
            <ChristmasDecorations />

            {/* Flashlight Effect Layer */}
            <motion.div
              className="flashlight-layer"
              style={{
                "--mouse-x": mousePos.x,
                "--mouse-y": mousePos.y,
                "--flashlight-radius": flashlightRadius,
                opacity: flashlightOpacity,
              }}
            />

            {/* Warm glow around cursor */}
            <div
              className="cursor-glow"
              style={{
                "--mouse-x": mousePos.x,
                "--mouse-y": mousePos.y,
              }}
            />

            {/* Scroll Progress */}
            <ScrollProgress />

            {/* Main Journey Content */}
            <main className="journey-container">
              {/* Hero Section - The Starting Point */}
              <section className="hero-section">
                {/* Ambient particles */}
                <div className="hero-particles">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="hero-particle"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.2, 0.6, 0.2],
                        y: [-20, -40, -20],
                        x: [0, i % 2 === 0 ? 10 : -10, 0],
                      }}
                      transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                      style={{
                        left: `${15 + i * 14}%`,
                        top: `${30 + (i % 3) * 15}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Clock/Timestamp - Main Header */}
                <motion.div
                  className="hero-timestamp"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                >
                  <motion.div
                    className="timestamp-glow"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Clock className="timestamp-icon" size={18} />
                  <span className="timestamp-time">{currentTime.time}</span>
                  <span className="timestamp-divider">•</span>
                  <span className="timestamp-date">{currentTime.date}</span>
                </motion.div>

                {/* Lamp Icon with enhanced glow */}
                <motion.div
                  className="lamp-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                >
                  <motion.div
                    className="lamp-pulse"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <svg viewBox="-10 -10 120 120" className="lamp-svg">
                    <defs>
                      <radialGradient id="lampGlow" cx="50%" cy="30%" r="60%">
                        <stop
                          offset="0%"
                          stopColor="#ffd700"
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="40%"
                          stopColor="#ffb347"
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor="#ffd700"
                          stopOpacity="0"
                        />
                      </radialGradient>
                      <filter
                        id="lampBlur"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur stdDeviation="3" />
                      </filter>
                    </defs>
                    <circle
                      cx="50"
                      cy="40"
                      r="35"
                      fill="url(#lampGlow)"
                      filter="url(#lampBlur)"
                    />
                    <circle cx="50" cy="40" r="25" fill="url(#lampGlow)" />
                    <path
                      d="M42 58 L38 85 L62 85 L58 58 Z"
                      fill="none"
                      stroke="#ffd700"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                    <ellipse
                      cx="50"
                      cy="58"
                      rx="10"
                      ry="3"
                      fill="none"
                      stroke="#ffd700"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                  </svg>
                </motion.div>

                {/* Setting Statement - Sub Header */}
                <motion.p
                  className="hero-setting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                >
                  {content.heroSection.setting}
                </motion.p>

                {/* Atmosphere text */}
                <motion.p
                  className="hero-atmosphere"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                >
                  {content.heroSection.atmosphere}
                </motion.p>

                {/* Instruction hint */}
                <motion.p
                  className="hero-instruction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 1, delay: 2 }}
                >
                  {isMobile
                    ? content.subtitle.mobile
                    : content.subtitle.desktop}
                </motion.p>

                {/* Scroll Guide - Animated indicator */}
                <AnimatePresence>
                  {showIntro && (
                    <motion.div
                      className="scroll-guide"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, delay: 2.5 }}
                    >
                      <motion.div
                        className="scroll-guide-line"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1, delay: 2.8 }}
                      />
                      <span className="scroll-guide-text">
                        {content.heroSection.scrollGuide}
                      </span>
                      <motion.div
                        className="scroll-guide-icon"
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                      <motion.div
                        className="scroll-guide-glow"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Narrative Sections */}
              {content.narrativeFragments.map((fragment) => (
                <NarrativeText
                  key={fragment.id}
                  id={fragment.id}
                  text={fragment.text}
                  mousePos={mousePos}
                  isMobile={isMobile}
                  onReveal={triggerHaptic}
                />
              ))}

              {/* Music Suggestions Section */}
              <section className="music-section">
                <motion.div
                  className="music-section-content"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h2
                    className="music-section-heading"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {content.musicSection.heading}
                  </motion.h2>
                  <motion.p
                    className="music-section-subheading"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  >
                    {content.musicSection.subheading}
                  </motion.p>

                  <div className="vinyl-records-container">
                    {content.musicSection.tracks.map((track, index) => {
                      const isPlaying =
                        currentPlayingTrack === `track-${track.id}`;
                      return (
                        <motion.div
                          key={track.id}
                          className={`vinyl-record-wrapper ${
                            isPlaying ? "playing" : ""
                          }`}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15, duration: 0.6 }}
                          onClick={() => {
                            const audio =
                              audioRefs.current[`track-${track.id}`];
                            if (isPlaying) {
                              pauseTrack(`track-${track.id}`);
                            } else {
                              playTrack(`track-${track.id}`, audio);
                            }
                          }}
                        >
                          <audio
                            ref={(el) => registerAudio(`track-${track.id}`, el)}
                            src={track.src}
                            preload="metadata"
                            onEnded={() => setCurrentPlayingTrack(null)}
                          />
                          <div
                            className={`vinyl-record ${
                              isPlaying ? "spinning" : ""
                            }`}
                            style={{ "--record-color": track.color }}
                          >
                            <div className="vinyl-grooves"></div>
                            <div className="vinyl-label">
                              {isPlaying ? (
                                <Pause
                                  size={16}
                                  className="vinyl-icon visible"
                                />
                              ) : (
                                <Play
                                  size={16}
                                  className="vinyl-icon visible"
                                />
                              )}
                            </div>
                            <div className="vinyl-shine"></div>
                          </div>
                          <div className="vinyl-sleeve">
                            <div className="sleeve-content">
                              <span className="track-title">{track.title}</span>
                              <span className="track-artist">
                                {track.artist}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.p
                    className="section-why-chosen"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {content.musicSection.whyChosen}
                  </motion.p>
                </motion.div>
              </section>

              {/* Movie Recommendations Section */}
              <section className="movie-section">
                <motion.div
                  className="movie-section-content"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h2
                    className="movie-section-heading"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {content.movieSection.heading}
                  </motion.h2>
                  <motion.p
                    className="movie-section-subheading"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  >
                    {content.movieSection.subheading}
                  </motion.p>

                  <div className="movie-cards-container">
                    {content.movieSection.movies.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        className="movie-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.7 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                      >
                        <div className="movie-poster">
                          <img src={movie.image} alt={movie.title} />
                          <div className="movie-overlay">
                            <span className="movie-year">{movie.year}</span>
                          </div>
                        </div>
                        <div className="movie-info">
                          <h3 className="movie-title">{movie.title}</h3>
                          <p className="movie-description">
                            {movie.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    className="section-why-chosen"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {content.movieSection.whyChosen}
                  </motion.p>
                </motion.div>
              </section>

              {/* Christmas Ending Section */}
              <section className="sunrise-section">
                <motion.div
                  className="sunrise-content"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="sunrise-glow christmas-glow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.3 }}
                    viewport={{ once: true }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <motion.div
                    className="sparkle-decoration"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Sparkles size={20} className="sparkle-icon left" />
                    <Sparkles size={20} className="sparkle-icon right" />
                  </motion.div>

                  <motion.h2
                    className="sunrise-heading"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  >
                    {content.endingSection.heading}
                  </motion.h2>

                  <motion.p
                    className="sunrise-subheading christmas-message"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                  >
                    {content.endingSection.subheading}
                  </motion.p>

                  {/* Interactive Letter/Envelope */}
                  <motion.div
                    className="envelope-wrapper"
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  >
                    <motion.div
                      className={`christmas-envelope ${
                        isLetterOpen ? "opened" : ""
                      }`}
                      onClick={() => setIsLetterOpen(!isLetterOpen)}
                      whileHover={{ scale: isLetterOpen ? 1 : 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="envelope-back"></div>
                      <motion.div
                        className={`envelope-flap ${
                          isLetterOpen ? "flap-open" : ""
                        }`}
                        animate={{ rotateX: isLetterOpen ? -180 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                      <div className="envelope-front">
                        <Mail size={24} className="envelope-icon" />
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isLetterOpen && (
                        <motion.div
                          key="letter-modal"
                          className="letter-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsLetterOpen(false)}
                        >
                          <motion.div
                            className="letter-content"
                            initial={{ y: 50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.15,
                              ease: "easeOut",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="letter-paper">
                              <div className="letter-header">
                                <Sparkles size={16} />
                                <span>{content.letter.header}</span>
                                <Sparkles size={16} />
                              </div>
                              <p className="letter-body">
                                {content.letter.body}
                              </p>
                              <div className="letter-signature">
                                <Heart size={14} className="heart-icon" />
                                <span>{content.letter.signature}</span>
                              </div>
                              <p className="tap-close-hint">
                                {content.letter.closeHint}
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {!isLetterOpen && (
                    <motion.p
                      className="tap-hint"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      {content.endingSection.tapHint}
                    </motion.p>
                  )}

                  {/* Riddle Section */}
                  <motion.div
                    className="riddle-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <motion.div
                      className="riddle-decoration"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    <motion.h3
                      className="riddle-heading"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    >
                      {content.riddleSection.heading}
                    </motion.h3>
                    <motion.p
                      className="riddle-subheading"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                    >
                      {content.riddleSection.subheading}
                    </motion.p>

                    <motion.div
                      className="riddle-card"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.35,
                        ease: "easeOut",
                      }}
                    >
                      <div className="riddle-clues">
                        {content.riddleSection.riddles.map((riddle, index) => (
                          <motion.p
                            key={riddle.id}
                            className="riddle-clue no-number"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 * (index + 1) }}
                          >
                            {riddle.text}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.footer
                    className="christmas-footer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <div className="footer-divider">
                      <span className="footer-star">
                        <Star size={12} />
                      </span>
                    </div>
                    <p className="footer-year">{content.footer.year}</p>
                    <p
                      className="footer-made-with"
                      onClick={() => setEasterEggClicks((prev) => prev + 1)}
                      style={{ cursor: "default" }}
                    >
                      {content.footer.madeWith.split("11.11").length > 1 ? (
                        <>
                          {content.footer.madeWith.split("11.11")[0]}
                          <span className="footer-1111">11.11</span>
                          {content.footer.madeWith.split("11.11")[1]}
                        </>
                      ) : (
                        content.footer.madeWith
                      )}
                    </p>
                    <AnimatePresence>
                      {easterEggClicks >= 3 && (
                        <motion.a
                          href="https://instagram.com/bipin11.11"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="secret-easter-egg"
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.4, type: "spring" }}
                        >
                          ✨ Hello Naina ✨
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </motion.footer>
                </motion.div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
