import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Fireworks from '../Fireworks/Fireworks';
import Diyas from '../Diyas/Diyas';
import Lanterns from '../Lanterns/Lanterns';
import StringLights from '../StringLights/StringLights';
import Rangoli from '../Rangoli/Rangoli';
import BokehOverlay from '../BokehOverlay/BokehOverlay';
import SoundToggle from '../SoundToggle/SoundToggle';
import './Greeting.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 14, stiffness: 220 },
  },
};

function Greeting({ name, onChangeName }) {
  const fireworksRef = useRef(null);
  const soundCallbackRef = useRef(null);

  const handleBurst = useCallback(() => {
    if (soundCallbackRef.current) soundCallbackRef.current();
  }, []);

  const handleReplay = useCallback(() => {
    fireworksRef.current?.replay();
  }, []);

  const greetingLine1 = 'Wishing you a';
  const greetingLine2 = 'Happy Diwali';
  const greetingLine3 = name + '!';

  return (
    <motion.div
      className="greeting-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background layers */}
      <Fireworks ref={fireworksRef} active={true} onBurst={handleBurst} />
      <BokehOverlay />
      <Lanterns />
      <Rangoli />
      <Diyas />
      <StringLights />

      {/* Sound toggle */}
      <SoundToggle onBurstRef={soundCallbackRef} />

      {/* Main greeting content */}
      <div className="greeting-content">
        <motion.div
          className="greeting-text-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* "Wishing you a" */}
          <motion.p
            className="greeting-line greeting-subtitle-text"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {greetingLine1}
          </motion.p>

          {/* "Happy Diwali" */}
          <motion.h1
            className="greeting-line greeting-main-text"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {greetingLine2.split('').map((char, i) => (
              <motion.span
                key={i}
                className="greeting-letter"
                variants={letterVariants}
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Name */}
          <motion.p
            className="greeting-line greeting-name"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: 'spring', damping: 12 }}
          >
            {greetingLine3}
          </motion.p>

          {/* Festive symbols */}
          <motion.div
            className="greeting-symbol"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            🪔 ✨ 🎆 ✨ 🪔
          </motion.div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="greeting-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.button
            className="action-btn replay-btn"
            onClick={handleReplay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎆 Replay Fireworks
          </motion.button>
          <motion.button
            className="action-btn change-name-btn"
            onClick={onChangeName}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✏️ Change Name
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Greeting;
