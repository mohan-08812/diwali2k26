import { useState } from 'react';
import { motion } from 'framer-motion';
import './NameForm.css';

/**
 * NameForm — Landing screen with a name input and submit button.
 * Shows a glowing diya icon and validates that name is non-empty.
 */
function NameForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <motion.div
      className="name-form-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative stars in background */}
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="form-container"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      >
        {/* Glowing Diya Icon */}
        <div className="diya-icon" aria-hidden="true">
          <div className="diya-glow"></div>
          <div className="diya-flame">
            <div className="flame-inner"></div>
          </div>
          <div className="diya-body">
            <div className="diya-bowl"></div>
            <div className="diya-base"></div>
          </div>
        </div>

        <h1 className="landing-title">Celebrate Diwali with Us</h1>
        <p className="landing-subtitle">✨ The Festival of Lights ✨</p>

        <form onSubmit={handleSubmit} className="name-form" noValidate>
          <div className="input-group">
            <input
              type="text"
              className={`name-input ${error ? 'input-error' : ''}`}
              placeholder="Enter your name..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              aria-label="Your name"
              autoFocus
              maxLength={50}
            />
            {error && <p className="error-text">{error}</p>}
          </div>
          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🪔 Let's Celebrate!
          </motion.button>
        </form>
      </motion.div>

      {/* Decorative bottom diyas for landing page */}
      <div className="landing-diyas" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mini-diya" style={{ animationDelay: `${i * 0.3}s` }}>
            <div className="mini-flame"></div>
            <div className="mini-bowl">🪔</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default NameForm;

