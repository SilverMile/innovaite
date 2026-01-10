import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Award, BarChart3, CheckCircle } from 'lucide-react';
import { identifyWaste, WasteItem } from './utils/geminiService';
import './App.css';

type Screen = 'home' | 'scanner' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<WasteItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [points, setPoints] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const webcamRef = useRef<Webcam>(null);

  const getBinInfo = (category: string) => {
    const bins = {
      recyclable: { color: '#4a90e2', emoji: '♻️', name: 'Blue Recycling Bin' },
      organic: { color: '#27ae60', emoji: '🌱', name: 'Green Organic Bin' },
      hazardous: { color: '#e74c3c', emoji: '⚠️', name: 'Red Hazmat Container' },
      landfill: { color: '#7f8c8d', emoji: '🗑️', name: 'Black General Waste' },
    };
    return bins[category as keyof typeof bins] || bins.landfill;
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert('Could not capture image. Please try again.');
      return;
    }

    setIsProcessing(true);
    try {
      const identifiedItems = await identifyWaste(imageSrc);
      
      if (identifiedItems.length === 0) {
        alert('No items detected. Please try again with better lighting.');
        setIsProcessing(false);
        return;
      }
      
      setItems(identifiedItems);
      setCheckedItems({});
      setScreen('results');
    } catch (error) {
      alert('Error identifying items. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completeSort = () => {
    const checked = Object.values(checkedItems).filter(Boolean).length;
    const earned = checked * 10;
    setPoints(points + earned);
    
    alert(`🎉 Great Job!\n\nYou earned ${earned} points for sorting ${checked} items!\n\nTotal Points: ${points + earned}`);
    setScreen('home');
  };

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <div className="app">
        <div className="container">
          <header className="header">
            <h1 className="title">WASTEless</h1>
            <div className="points-badge">⭐ {points}</div>
          </header>

          <div className="stats-card">
            <h2 className="stats-title">Dubai Smart Waste</h2>
            <p className="stats-value">Ready to sort!</p>
            <p className="stats-subtext">Scan waste to earn points 🌱</p>
          </div>

          <button className="btn btn-primary" onClick={() => setScreen('scanner')}>
            <Camera size={24} />
            SCAN WASTE
          </button>

          <button className="btn btn-secondary" onClick={() => alert('Leaderboard coming soon! 🏆')}>
            <Award size={20} />
            Leaderboard
          </button>

          <button className="btn btn-tertiary" onClick={() => alert('Statistics coming soon! 📊')}>
            <BarChart3 size={20} />
            My Stats
          </button>

          <div className="info-card">
            <p><strong>How it works:</strong></p>
            <ol>
              <li>📸 Scan your waste pile</li>
              <li>🤖 AI identifies items</li>
              <li>♻️ Follow sorting instructions</li>
              <li>⭐ Earn points for each item</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // SCANNER SCREEN
  if (screen === 'scanner') {
    return (
      <div className="app scanner-screen">
        <button className="back-btn" onClick={() => setScreen('home')}>✕</button>
        
        <div className="webcam-container">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
            videoConstraints={{ 
              facingMode: 'environment',
              width: 1280,
              height: 720
            }}
          />
          <div className="scanner-overlay">
            <p className="instruction-text">📸 Point camera at waste items</p>
            <p className="instruction-subtext">Make sure items are clearly visible</p>
          </div>
        </div>

        {isProcessing ? (
          <div className="processing">
            <div className="spinner"></div>
            <p>Identifying items...</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>This may take a few seconds</p>
          </div>
        ) : (
          <button className="capture-btn" onClick={captureImage}>
            <div className="capture-btn-inner"></div>
          </button>
        )}
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === 'results') {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    
    return (
      <div className="app">
        <div className="container">
          <button className="back-btn-results" onClick={() => setScreen('home')}>← Back</button>
          
          <h2 className="results-header">Items Found: {items.length}</h2>
          <p className="results-subheader">Tap each item as you sort it correctly</p>

          <div className="items-list">
            {items.map((item, index) => {
              const binInfo = getBinInfo(item.category);
              const isChecked = checkedItems[index];

              return (
                <div
                  key={index}
                  className={`item-card ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleItem(index)}
                >
                  <div className="item-header">
                    <span className="item-number">#{index + 1}</span>
                    {isChecked && <CheckCircle size={24} color="#27ae60" />}
                  </div>

                  <h3 className="item-name">{item.name}</h3>

                  <div className="bin-badge" style={{ backgroundColor: binInfo.color }}>
                    <span className="bin-emoji">{binInfo.emoji}</span>
                    <span className="bin-name">{binInfo.name}</span>
                  </div>

                  <p className="instruction">💡 {item.instruction}</p>
                </div>
              );
            })}
          </div>

          <button 
            className="btn btn-primary complete-btn" 
            onClick={completeSort}
            disabled={checkedCount === 0}
          >
            ✓ Complete Sorting ({checkedCount}/{items.length})
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
