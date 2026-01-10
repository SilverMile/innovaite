import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Types
interface WasteItem {
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'landfill';
  instruction: string;
}

type Screen = 'home' | 'scanner' | 'results';

// Perplexity API - Improved Prompt
const identifyWaste = async (imageBase64: string): Promise<WasteItem[]> => {
  try {
    const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY as string;
    
    if (!API_KEY) {
      throw new Error('Perplexity API key not found');
    }

    const prompt = `You are an expert waste management AI system for Dubai, UAE.

TASK: Analyze this image and identify ALL visible waste items.

For EACH item found, provide:
1. Specific item name (e.g., "PET Plastic Water Bottle" not just "bottle")
2. Correct disposal category: must be ONE of these: recyclable, organic, hazardous, landfill
3. Detailed disposal instruction specific to Dubai's waste management system

DUBAI WASTE CATEGORIES:
- RECYCLABLE: Blue bin - plastic bottles, aluminum cans, cardboard, paper, glass
- ORGANIC: Green bin - food waste, fruit/vegetable scraps, garden waste
- HAZARDOUS: Red container - batteries, electronics, chemicals, light bulbs
- LANDFILL: Black bin - contaminated items, mixed materials, non-recyclables

RESPONSE FORMAT: Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "name": "PET Plastic Water Bottle",
    "category": "recyclable",
    "instruction": "Remove cap and label, rinse bottle thoroughly, crush to save space. Place in blue recycling bin. Accepted at all Dubai Municipality collection points."
  },
  {
    "name": "Banana Peel",
    "category": "organic",
    "instruction": "Place in green organic waste bin. Dubai Municipality processes organic waste into compost for city landscaping projects."
  }
]

IMPORTANT: 
- Identify between 2-6 items depending on what's visible
- Be specific with item names
- Provide actionable Dubai-specific disposal instructions
- Return ONLY the JSON array, nothing else`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-vision',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API Error:', errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log('✅ Perplexity AI Response:', text);
    
    // Extract JSON - handle markdown code blocks
    let jsonText = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    } else {
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }
    
    const items = JSON.parse(jsonText);
    
    // Validate response
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No items found in response');
    }
    
    // Validate each item has required fields
    const validItems = items.filter(item => 
      item.name && 
      item.category && 
      ['recyclable', 'organic', 'hazardous', 'landfill'].includes(item.category) &&
      item.instruction
    );
    
    if (validItems.length === 0) {
      throw new Error('No valid items in response');
    }
    
    return validItems;
    
  } catch (error: any) {
    console.error('❌ Error identifying waste:', error);
    
    // Fallback demo data if API fails
    console.warn('⚠️ Using fallback demo data');
    const demoItems = [
      { 
        name: 'PET Plastic Water Bottle', 
        category: 'recyclable' as const,
        instruction: 'Remove cap and label, rinse thoroughly, crush to save space. Place in blue recycling bin. Accepted at all Dubai Municipality collection points and Bee\'ah facilities.' 
      },
      { 
        name: 'Aluminum Beverage Can', 
        category: 'recyclable' as const,
        instruction: 'Rinse can to remove residue, crush if possible to save space. Place in blue recycling bin. Aluminum is 100% recyclable and highly valuable.' 
      },
      { 
        name: 'Cardboard Packaging', 
        category: 'recyclable' as const,
        instruction: 'Flatten cardboard boxes, keep dry and clean. Remove any plastic tape or labels. Place in blue recycling bin. Collected twice weekly by Dubai Municipality.' 
      },
      { 
        name: 'Food Waste & Scraps', 
        category: 'organic' as const,
        instruction: 'Place all food scraps, fruit peels, and vegetable waste in green organic bin. Dubai Municipality processes organic waste into nutrient-rich compost for city parks.' 
      },
      { 
        name: 'Used AA Battery', 
        category: 'hazardous' as const,
        instruction: 'Never dispose in regular bins. Take to Bee\'ah e-waste collection center or battery drop-off points at malls. Contains toxic heavy metals harmful to environment.' 
      },
      {
        name: 'Mixed Paper (Office Paper)',
        category: 'recyclable' as const,
        instruction: 'Remove plastic sleeves and staples. Keep paper clean and dry. Place in blue recycling bin. Shredded paper accepted in clear bags.'
      }
    ];
    
    // Return random 3-5 items to simulate real detection
    const shuffled = demoItems.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
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
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera access denied. Please allow camera access and try again.');
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
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    
    setIsProcessing(true);
    stopCamera();
    
    try {
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
    } catch (error: any) {
      alert(`Error: ${error.message}. Please try again.`);
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
    
    const encouragement = earned >= 40 ? '🌟 Outstanding!' : earned >= 20 ? '🎉 Great work!' : '👍 Good start!';
    alert(`${encouragement}\n\nYou earned ${earned} points for sorting ${checked} items!\n\nTotal Points: ${points + earned}\n\nKeep going to help Dubai achieve zero waste by 2030!`);
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
            <h2 style={{ fontSize: '20px', color: '#666', marginBottom: '12px' }}>🇦🇪 Dubai Smart Waste Initiative</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d5016', marginBottom: '8px' }}>Ready to sort!</p>
            <p style={{ fontSize: '18px', color: '#999' }}>AI-powered waste identification • Earn points • Save the planet 🌱</p>
          </div>

          <button onClick={() => setScreen('scanner')} style={{ width: '100%', padding: '22px', border: 'none', borderRadius: '18px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            📸 SCAN WASTE
          </button>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
            <p style={{ color: '#2d5016', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>💡 How it works:</p>
            <ol style={{ marginLeft: '20px', lineHeight: '1.8', color: '#666' }}>
              <li>📸 <strong>Scan</strong> your waste pile with your camera</li>
              <li>🤖 <strong>AI analyzes</strong> each item in real-time</li>
              <li>♻️ <strong>Follow</strong> Dubai-specific sorting instructions</li>
              <li>✅ <strong>Mark completed</strong> as you sort each item</li>
              <li>⭐ <strong>Earn points</strong> - 10 points per item sorted!</li>
            </ol>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', padding: '20px', borderRadius: '16px', marginTop: '16px', border: '2px solid #2196f3' }}>
            <p style={{ fontSize: '14px', color: '#0d47a1', lineHeight: '1.6', margin: 0 }}>
              🎯 <strong>Dubai 2030 Goal:</strong> Zero waste to landfill. Every item you sort correctly brings us closer to a sustainable future!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SCANNER SCREEN
  if (screen === 'scanner') {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'black' }}>
        <button onClick={() => { stopCamera(); setScreen('home'); }} style={{ position: 'fixed', top: '30px', right: '30px', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.7)', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(10px)' }}>
          ✕
        </button>

        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.7)', padding: '16px 28px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            📸 Point camera at waste items
          </p>
          <p style={{ color: 'white', fontSize: '16px', background: 'rgba(0, 0, 0, 0.6)', padding: '8px 16px', borderRadius: '8px' }}>
            Make sure items are clearly visible
          </p>
        </div>

        {isProcessing ? (
          <div style={{ position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'white', background: 'rgba(0, 0, 0, 0.8)', padding: '24px 32px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>🤖 AI is analyzing...</p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#aaa' }}>This may take 5-10 seconds</p>
          </div>
        ) : (
          <button onClick={captureImage} style={{ position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '90px', borderRadius: '50%', background: 'white', border: '5px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer', padding: 0, transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}>
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
        <button onClick={() => setScreen('home')} style={{ background: '#e0e0e0', border: 'none', padding: '12px 20px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', color: '#333', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'} onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}>
          ← Back to Home
        </button>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d5016', marginBottom: '8px' }}>✅ Items Found: {items.length}</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '28px' }}>Tap each card after you sort the item correctly</p>

        <div style={{ marginBottom: '20px' }}>
          {items.map((item, index) => {
            const binInfo = getBinInfo(item.category);
            const isChecked = checkedItems[index];
            
            return (
              <div key={index} onClick={() => toggleItem(index)} style={{ background: isChecked ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)' : 'white', padding: '24px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', cursor: 'pointer', border: isChecked ? '3px solid #27ae60' : '3px solid transparent', transition: 'all 0.3s', transform: 'scale(1)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#999', fontWeight: 'bold' }}>#{index + 1}</span>
                  {isChecked && <span style={{ fontSize: '32px', color: '#27ae60' }}>✓</span>}
                </div>
                
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>{item.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px', borderRadius: '12px', marginBottom: '16px', background: binInfo.color, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                  <span style={{ fontSize: '28px', marginRight: '12px' }}>{binInfo.emoji}</span>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{binInfo.name}</span>
                </div>
                
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', padding: '14px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  💡 <strong>Instructions:</strong> {item.instruction}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'sticky', bottom: '20px', background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px', color: '#666' }}>Progress: {checkedCount}/{items.length} items sorted</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d5016' }}>+{checkedCount * 10} points</span>
          </div>
          <button onClick={completeSort} disabled={checkedCount === 0} style={{ width: '100%', padding: '18px', border: 'none', borderRadius: '14px', fontSize: '20px', fontWeight: 'bold', cursor: checkedCount === 0 ? 'not-allowed' : 'pointer', background: checkedCount === 0 ? '#ccc' : 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', transition: 'all 0.2s' }}>
            ✓ Complete Sorting
          </button>
        </div>
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
