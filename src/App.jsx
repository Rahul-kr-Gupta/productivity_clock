import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import KnowledgePool from './components/KnowledgePool';
import RewardNotification from './components/RewardNotification';

function App() {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Gamification Logic: 1 coin every 10 minutes (600 seconds)
  useEffect(() => {
    if (time > 0 && time % 600 === 0) {
      setCoins((prev) => prev + 1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  }, [time]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Left Side: Timer */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Timer time={time} isRunning={isRunning} setIsRunning={setIsRunning} setTime={setTime} />
      </div>

      {/* Enhanced Divider with Glow */}
      <div style={{
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, var(--gradient-primary), transparent)',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
        position: 'relative'
      }} />

      {/* Right Side: Knowledge Visualization */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-secondary)'
      }}>
        <KnowledgePool time={time} coins={coins} />
      </div>

      {/* Reward Notification */}
      {showReward && <RewardNotification />}
    </div>
  );
}

export default App;
