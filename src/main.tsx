import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleGenerativeAI } from '@google/generative-ai'
import './index.css'

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

// Types
interface WasteItem {
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'landfill';
  instruction: string;
}

type Screen = 'home' | 'scanner' | 'results';

// Gemini AI Function
// Gemini AI Function - GEMINI 2.0 FLASH (LATEST)
const identifyWaste = async (imageBase64: string): Promise<WasteItem[]> => {
  try {
    // Use Gemini 2.0 Flash - the newest model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'
    });

    const prompt = `Analyze this image and identify all waste items visible. 
    For each item, provide:
    1. Item name
    2. Bin category: recyclable, organic, hazardous, or landfill
    3. Brief disposal instruction for Dubai, UAE
    
    Format response as valid JSON array only:
    [
      {
        "name": "Plastic Bottle",
        "category": "recyclable",
        "instruction": "Remove cap and rinse before recycling"
      }
    ]
    
    Return ONLY the JSON array, no other text.`;

    // Generate content with image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = result.response;
    const text = response.text();
    
    console.log('✅ AI Response:', text);
    
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON array in AI response');
  } catch (error) {
    console.error('❌ Error identifying waste:', error);
    throw error;
  }
};


// Main App Component
function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<WasteItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [points, setPoints] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getBinInfo = (category: string) => {
    const bins = {
      recyclable: { color: '#4a90e2', emoji: '♻️', name: 'Blue Recycling Bin' },
      organic: { color: '#27ae60', emoji: '🌱', name: 'Green Organic Bin' },
      hazardous: { color: '#e74c3c', emoji: '⚠️', name: 'Red Hazmat Container' },
      landfill: { color: '#7f8c8d', emoji: '🗑️', name: 'Black General Waste' },
    };
    return bins[category as keyof typeof bins] || bins.landfill;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied. Please allow camera access.');
      setScreen('home');
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg');
    
    setIsProcessing(true);
    stopCamera();
    
    try {
      // REAL GEMINI AI CALL
      const identifiedItems = await identifyWaste(imageBase64);
      
      if (identifiedItems.length === 0) {
        alert('No items detected. Please try again with better lighting.');
        setIsProcessing(false);
        setScreen('home');
        return;
      }
      
      setItems(identifiedItems);
      setCheckedItems({});
      setScreen('results');
    } catch (error) {
      alert('Error identifying items. Please check your API key and try again.');
      console.error(error);
      setScreen('home');
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
    alert(`🎉 Great Job!\n\nYou earned ${earned} points!\nTotal: ${points + earned}`);
    setScreen('home');
  };

  React.useEffect(() => {
    if (screen === 'scanner') {
      startCamera();
    }
    return () => stopCamera();
  }, [screen]);

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#2d5016', margin: 0 }}>WASTEless</h1>
            <div style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', padding: '12px 20px', borderRadius: '25px', fontSize: '22px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' }}>
              ⭐ {points}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', padding: '32px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
            <h2 style={{ fontSize: '20px', color: '#666', marginBottom: '12px' }}>Dubai Smart Waste</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d5016', marginBottom: '8px' }}>Ready to sort!</p>
            <p style={{ fontSize: '18px', color: '#999' }}>Scan waste to earn points 🌱</p>
          </div>

          <button onClick={() => setScreen('scanner')} style={{ width: '100%', padding: '22px', border: 'none', borderRadius: '18px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            📸 SCAN WASTE
          </button>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
            <p style={{ color: '#2d5016', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>How it works:</p>
            <ol style={{ marginLeft: '20px', lineHeight: '1.8', color: '#666' }}>
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
      <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'black' }}>
        <button onClick={() => { stopCamera(); setScreen('home'); }} style={{ position: 'fixed', top: '30px', right: '30px', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.7)', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', zIndex: 10 }}>
          ✕
        </button>

        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.7)', padding: '16px 28px', borderRadius: '12px' }}>
            📸 Point camera at waste items
          </p>
        </div>

        {isProcessing ? (
          <div style={{ position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'white', background: 'rgba(0, 0, 0, 0.8)', padding: '24px 32px', borderRadius: '16px' }}>
            <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p>🤖 AI is analyzing...</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>This may take 5-10 seconds</p>
          </div>
        ) : (
          <button onClick={captureImage} style={{ position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '90px', borderRadius: '50%', background: 'white', border: '5px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer', padding: 0 }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#2d5016', margin: '5px' }} />
          </button>
        )}
      </div>
    );
  }

  // RESULTS SCREEN
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setScreen('home')} style={{ background: '#e0e0e0', border: 'none', padding: '12px 20px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', color: '#333' }}>
          ← Back
        </button>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d5016', marginBottom: '8px' }}>Items Found: {items.length}</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '28px' }}>Tap each item as you sort it correctly</p>

        {items.map((item, index) => {
          const binInfo = getBinInfo(item.category);
          const isChecked = checkedItems[index];
          
          return (
            <div key={index} onClick={() => toggleItem(index)} style={{ background: isChecked ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)' : 'white', padding: '24px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', cursor: 'pointer', border: isChecked ? '3px solid #27ae60' : '3px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', color: '#999', fontWeight: 'bold' }}>#{index + 1}</span>
                {isChecked && <span style={{ fontSize: '24px', color: '#27ae60' }}>✓</span>}
              </div>
              
              <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>{item.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px', borderRadius: '12px', marginBottom: '16px', background: binInfo.color, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>{binInfo.emoji}</span>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{binInfo.name}</span>
              </div>
              
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                💡 {item.instruction}
              </p>
            </div>
          );
        })}

        <button onClick={completeSort} disabled={checkedCount === 0} style={{ width: '100%', padding: '22px', border: 'none', borderRadius: '18px', fontSize: '20px', fontWeight: 'bold', cursor: checkedCount === 0 ? 'not-allowed' : 'pointer', background: checkedCount === 0 ? '#ccc' : 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', marginTop: '20px' }}>
          ✓ Complete Sorting ({checkedCount}/{items.length})
        </button>
      </div>
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
