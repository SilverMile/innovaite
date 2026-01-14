import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Leaderboard from './components/Leaderboard'
import Analytics from './components/Analytics'

// Types
interface WasteItem {
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'landfill';
  instruction: string;
  energySaved?: number; // kWh saved
}

type Screen = 'home' | 'scanner' | 'results' | 'leaderboard' | 'analytics';

// Energy savings data (kWh per kg) based on EPA and industry data
const ENERGY_SAVINGS: Record<string, number> = {
  'aluminum': 14.0, // 14 kWh per kg [web:89][web:93]
  'plastic': 5.6, // 5.6 kWh per kg [web:88]
  'glass': 0.3, // 0.3 kWh per kg [web:89]
  'paper': 4.1, // 4.1 kWh per kg [web:96]
  'cardboard': 4.1,
  'steel': 1.4, // 1.4 kWh per kg [web:89]
  'organic': 0.5, // Composting energy offset
  'default': 2.0
};

const calculateEnergySaved = (itemName: string): number => {
  const name = itemName.toLowerCase();
  if (name.includes('aluminum') || name.includes('aluminium') || name.includes('can')) return ENERGY_SAVINGS.aluminum;
  if (name.includes('plastic') || name.includes('bottle') || name.includes('pet')) return ENERGY_SAVINGS.plastic;
  if (name.includes('glass')) return ENERGY_SAVINGS.glass;
  if (name.includes('paper') || name.includes('newspaper')) return ENERGY_SAVINGS.paper;
  if (name.includes('cardboard') || name.includes('box')) return ENERGY_SAVINGS.cardboard;
  if (name.includes('steel') || name.includes('metal')) return ENERGY_SAVINGS.steel;
  if (name.includes('organic') || name.includes('food')) return ENERGY_SAVINGS.organic;
  return ENERGY_SAVINGS.default;
};

// Perplexity API
const identifyWaste = async (imageBase64: string): Promise<WasteItem[]> => {
  try {
    const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY as string;
    
    if (!API_KEY) {
      throw new Error('Perplexity API key not found');
    }

    const prompt = `You are a precise waste identification AI for Dubai, UAE. Analyze this image CAREFULLY.

CRITICAL INSTRUCTIONS:
1. Look at the ACTUAL items in the image - don't guess or assume
2. Be SPECIFIC about materials (e.g., "Glass Bottle" not "Can", "Plastic Straw" not generic "Straw")
3. Only identify items you can CLEARLY see
4. Count each DISTINCT item separately

MATERIAL IDENTIFICATION:
- GLASS: transparent, often green/brown/clear bottles and jars
- PLASTIC: opaque or translucent, bottles/containers (look for PET/HDPE symbols)
- ALUMINUM: metallic, shiny cans for beverages
- CARDBOARD: brown/tan paper material, boxes
- PAPER: white/colored sheets, newspapers
- ORGANIC: food scraps, peels, leftovers

DUBAI WASTE CATEGORIES:
- recyclable: plastic bottles (PET/HDPE), aluminum cans, cardboard, paper, glass bottles/jars
- organic: food waste, fruit/vegetable scraps, garden waste, compostables
- hazardous: batteries, electronics, chemicals, light bulbs, aerosol cans
- landfill: contaminated items, mixed materials, broken ceramics, styrofoam, plastic straws

RESPONSE FORMAT (JSON array only):
[
  {
    "name": "Green Glass Beverage Bottle",
    "category": "recyclable",
    "instruction": "Remove cap and rinse. Glass is 100% recyclable. Place in blue recycling bin. Bee'ah accepts all glass colors. Saves 0.3 kWh of energy per kg recycled."
  }
]

ANALYZE THE IMAGE NOW. Return ONLY the JSON array. No markdown, just raw JSON.`;

    console.log('🔄 Calling Perplexity API...');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
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
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Perplexity API Error:', errorText);
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log('✅ Perplexity Response:', text);
    
    // Extract JSON
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
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No items found');
    }
    
    const validItems = items.filter(item => 
      item.name && 
      item.category && 
      ['recyclable', 'organic', 'hazardous', 'landfill'].includes(item.category) &&
      item.instruction
    ).map(item => ({
      ...item,
      energySaved: calculateEnergySaved(item.name)
    }));
    
    if (validItems.length === 0) {
      throw new Error('No valid items');
    }
    
    return validItems;
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Main App
function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<WasteItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [points, setPoints] = useState(parseInt(localStorage.getItem('wasteless_points') || '0'));
  const [totalEnergySaved, setTotalEnergySaved] = useState(parseFloat(localStorage.getItem('wasteless_energy') || '0'));
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const saveProgress = (newPoints: number, newEnergy: number) => {
    localStorage.setItem('wasteless_points', newPoints.toString());
    localStorage.setItem('wasteless_energy', newEnergy.toFixed(2));
  };

  const getBinInfo = (category: string) => {
    const bins = {
      recyclable: { color: '#2563eb', emoji: '♻️', name: 'Blue Recycling Bin', gradient: 'from-blue-500 to-blue-600' },
      organic: { color: '#16a34a', emoji: '🌱', name: 'Green Organic Bin', gradient: 'from-green-500 to-green-600' },
      hazardous: { color: '#dc2626', emoji: '⚠️', name: 'Red Hazmat Container', gradient: 'from-red-500 to-red-600' },
      landfill: { color: '#6b7280', emoji: '🗑️', name: 'Black General Waste', gradient: 'from-gray-500 to-gray-600' },
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
      alert('Camera access denied');
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
        alert('No items detected. Try again.');
        setIsProcessing(false);
        setScreen('home');
        return;
      }
      
      setItems(identifiedItems);
      setCheckedItems({});
      setSelectedItem(null);
      setScreen('results');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setScreen('home');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleItem = (index: number) => {
    const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newChecked);
    
    // Calculate energy saved
    if (newChecked[index]) {
      const item = items[index];
      const energySaved = item.energySaved || 0;
      const newTotal = totalEnergySaved + energySaved;
      setTotalEnergySaved(newTotal);
      saveProgress(points, newTotal);
    }
  };

  const completeSort = () => {
    const checked = Object.values(checkedItems).filter(Boolean).length;
    const earnedPoints = checked * 10;
    const earnedEnergy = items
      .filter((_, i) => checkedItems[i])
      .reduce((sum, item) => sum + (item.energySaved || 0), 0);
    
    const newPoints = points + earnedPoints;
    const newEnergy = totalEnergySaved + earnedEnergy;
    
    setPoints(newPoints);
    setTotalEnergySaved(newEnergy);
    saveProgress(newPoints, newEnergy);
    
    alert(`🌟 Amazing!\n\n+${earnedPoints} points\n+${earnedEnergy.toFixed(1)} kWh energy saved\n\nTotal: ${newPoints} points | ${newEnergy.toFixed(1)} kWh saved`);
    setScreen('home');
  };

  React.useEffect(() => {
    if (screen === 'scanner') startCamera();
    return () => stopCamera();
  }, [screen]);

  // ANALYTICS SCREEN
  if (screen === 'analytics') {
    return <Analytics points={points} totalEnergySaved={totalEnergySaved} onBack={() => setScreen('home')} />;
  }

  // LEADERBOARD SCREEN
  if (screen === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">WASTEless</h1>
            <button onClick={() => setScreen('home')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
              ← Back
            </button>
          </div>
        </div>
        <Leaderboard />
      </div>
    );
  }

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">WASTEless</h1>
              <p className="text-gray-600 text-sm mt-1">Dubai Smart Waste Initiative 🇦🇪</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setScreen('analytics')} className="px-5 py-2.5 bg-white hover:bg-gray-50 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
                📊 <span className="hidden sm:inline">Analytics</span>
              </button>
              <button onClick={() => setScreen('leaderboard')} className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 rounded-xl font-bold shadow-lg transition-all">
                ⭐ {points}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Points</p>
                <p className="text-4xl font-bold text-green-600">{points}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Energy Saved</p>
                <p className="text-4xl font-bold text-blue-600">{totalEnergySaved.toFixed(1)} <span className="text-2xl">kWh</span></p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{totalEnergySaved.toFixed(1)} kWh</span> = enough energy to power a laptop for <span className="font-semibold">{(totalEnergySaved * 25).toFixed(0)} hours</span> [web:88]
              </p>
            </div>
          </div>

          {/* Scan Button */}
          <button onClick={() => setScreen('scanner')} className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl text-2xl font-bold shadow-2xl transition-all transform hover:scale-[1.02] mb-4">
            📸 SCAN WASTE NOW
          </button>

          {/* How it Works */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <p className="font-bold text-lg text-gray-800 mb-4">💡 How it works:</p>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm">1</span>
                <span><strong>Scan</strong> your waste with your camera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm">2</span>
                <span><strong>AI analyzes</strong> each item instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm">3</span>
                <span><strong>Follow</strong> Dubai-specific sorting instructions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm">4</span>
                <span><strong>Earn points</strong> + track energy saved!</span>
              </li>
            </ol>
          </div>

          {/* Impact Banner */}
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5">
            <p className="text-sm text-blue-900 leading-relaxed">
              🎯 <strong>Dubai 2030 Goal:</strong> Zero waste to landfill. Recycling aluminum saves <strong>95% energy</strong> [web:93] • Glass saves <strong>30%</strong> [web:89] • Paper saves <strong>40-70%</strong> [web:96]
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SCANNER SCREEN
  if (screen === 'scanner') {
    return (
      <div className="relative w-screen h-screen bg-black">
        <button onClick={() => { stopCamera(); setScreen('home'); }} className="fixed top-6 right-6 w-14 h-14 rounded-full bg-black/70 backdrop-blur-md text-white text-2xl z-20 hover:bg-black/90 transition-all">
          ✕
        </button>

        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        <div className="absolute top-20 left-0 right-0 flex flex-col items-center gap-3 px-4">
          <p className="text-white text-xl font-bold bg-black/70 backdrop-blur-md px-8 py-4 rounded-2xl">
            📸 Point camera at waste items
          </p>
          <p className="text-white text-sm bg-black/60 backdrop-blur-md px-6 py-2 rounded-xl">
            Make sure items are clearly visible
          </p>
        </div>

        {isProcessing ? (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 text-center text-white bg-black/80 backdrop-blur-md px-8 py-6 rounded-2xl">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold">🤖 AI is analyzing...</p>
            <p className="text-sm text-gray-300 mt-2">This may take 5-10 seconds</p>
          </div>
        ) : (
          <button onClick={captureImage} className="fixed bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border-4 border-white/30 p-2 hover:scale-95 transition-transform">
            <div className="w-full h-full rounded-full bg-green-600" />
          </button>
        )}
      </div>
    );
  }

  // RESULTS SCREEN
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const selectedItemData = selectedItem !== null ? items[selectedItem] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => setScreen('home')} className="mb-6 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-semibold shadow-md transition-all">
          ← Back to Home
        </button>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">✅ Items Found: {items.length}</h2>
          <p className="text-gray-600 text-lg">Click any card for detailed instructions</p>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const binInfo = getBinInfo(item.category);
            const isChecked = checkedItems[index];
            
            return (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl ${isChecked ? 'border-green-500 bg-green-50' : 'border-gray-200'} ${selectedItem === index ? 'ring-4 ring-blue-300' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button onClick={(e) => { e.stopPropagation(); toggleItem(index); }} className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 hover:border-green-400'}`}>
                    {isChecked && <span className="text-white text-2xl">✓</span>}
                  </button>

                  {/* Content */}
                  <div className="flex-1" onClick={() => setSelectedItem(selectedItem === index ? null : index)}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500 font-medium">#{index + 1}</span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${binInfo.gradient} text-white font-semibold mb-3`}>
                      <span className="text-xl">{binInfo.emoji}</span>
                      <span>{binInfo.name}</span>
                    </div>

                    {selectedItem === index && (
                      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <p className="text-gray-800 leading-relaxed mb-3">
                          <span className="font-semibold text-blue-900">💡 Instructions:</span> {item.instruction}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-blue-900 font-semibold">
                          <span>⚡ Energy saved:</span>
                          <span className="px-3 py-1 bg-yellow-100 rounded-full">{item.energySaved?.toFixed(1)} kWh</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl p-6 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-600 text-sm">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{checkedCount}/{items.length} sorted</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">You'll earn</p>
                <p className="text-2xl font-bold text-green-600">+{checkedCount * 10} pts</p>
              </div>
            </div>
            <button onClick={completeSort} disabled={checkedCount === 0} className={`w-full py-4 rounded-xl text-xl font-bold transition-all ${checkedCount === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg'}`}>
              {checkedCount === 0 ? 'Check items to continue' : '✓ Complete Sorting'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
