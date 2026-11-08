import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import NameForm from './components/NameForm/NameForm';
import RocketIntro from './components/RocketIntro/RocketIntro';
import Greeting from './components/Greeting/Greeting';
import './App.css';

/**
 * App — manages the 3-step transition:
 * 1. 'landing'  → User enters their name
 * 2. 'intro'    → Rocket launches, shoots up, and bursts
 * 3. 'greeting' → "Happy Diwali, [Name]!" reveals with all animations
 */
function App() {
  const [name, setName] = useState('');
  const [screen, setScreen] = useState('landing'); // 'landing' | 'intro' | 'greeting'

  const handleSubmit = useCallback((submittedName) => {
    setName(submittedName);
    setScreen('intro'); // launch rocket first!
  }, []);

  const handleRocketComplete = useCallback(() => {
    setScreen('greeting'); // reveal wishes after explosion!
  }, []);

  const handleChangeName = useCallback(() => {
    setScreen('landing');
    setName('');
  }, []);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <NameForm key="landing" onSubmit={handleSubmit} />
        )}

        {screen === 'intro' && (
          <RocketIntro key="intro" onComplete={handleRocketComplete} />
        )}

        {screen === 'greeting' && (
          <Greeting key="greeting" name={name} onChangeName={handleChangeName} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
