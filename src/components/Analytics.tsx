import React from 'react';

interface AnalyticsProps {
  points: number;
  totalEnergySaved: number;
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ points, totalEnergySaved, onBack }) => {
  // Calculate equivalent metrics [web:88][web:89][web:96]
  const laptopHours = (totalEnergySaved * 25).toFixed(0); // 10 bottles = 25 hours
  const homesPerYear = (totalEnergySaved / 4100).toFixed(2); // 4100 kWh per year average home
  const co2Saved = (totalEnergySaved * 0.4).toFixed(1); // ~0.4 kg CO2 per kWh
  const treesPlanted = (parseFloat(co2Saved) / 21).toFixed(1); // 21 kg CO2 per tree per year

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Energy Analytics</h1>
            <p className="text-gray-600 text-sm mt-1">Your environmental impact dashboard</p>
          </div>
          <button onClick={onBack} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Total Energy Saved */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
            <p className="text-blue-100 text-sm font-medium mb-2">Total Energy Saved</p>
            <p className="text-6xl font-bold mb-2">{totalEnergySaved.toFixed(1)}</p>
            <p className="text-2xl text-blue-100">kilowatt-hours (kWh)</p>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <p className="text-blue-100 text-sm">That's enough to power:</p>
              <p className="text-xl font-bold mt-1">💻 A laptop for {laptopHours} hours</p>
            </div>
          </div>

          {/* Total Points */}
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl p-8 text-white shadow-2xl">
            <p className="text-amber-100 text-sm font-medium mb-2">Total Points Earned</p>
            <p className="text-6xl font-bold mb-2">{points}</p>
            <p className="text-2xl text-amber-100">reward points</p>
            <div className="mt-6 pt-6 border-t border-amber-300">
              <p className="text-amber-100 text-sm">Items sorted correctly:</p>
              <p className="text-xl font-bold mt-1">♻️ {(points / 10).toFixed(0)} items</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">🌍 Environmental Impact</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <p className="text-5xl mb-3">🌳</p>
              <p className="text-3xl font-bold text-green-700">{treesPlanted}</p>
              <p className="text-gray-600 font-medium mt-2">Trees Equivalent</p>
              <p className="text-sm text-gray-500 mt-1">CO₂ absorption per year</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <p className="text-5xl mb-3">💨</p>
              <p className="text-3xl font-bold text-blue-700">{co2Saved} kg</p>
              <p className="text-gray-600 font-medium mt-2">CO₂ Prevented</p>
              <p className="text-sm text-gray-500 mt-1">Carbon emissions avoided</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <p className="text-5xl mb-3">🏠</p>
              <p className="text-3xl font-bold text-purple-700">{homesPerYear}</p>
              <p className="text-gray-600 font-medium mt-2">Homes/Year</p>
              <p className="text-sm text-gray-500 mt-1">Annual energy equivalent</p>
            </div>
          </div>
        </div>

        {/* Energy Savings by Material */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">⚡ Energy Savings by Material</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">🥫</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Aluminum Cans</p>
                <p className="text-sm text-gray-600">Saves 95% energy vs. new production</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">14.0</p>
                <p className="text-sm text-gray-500">kWh/kg</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🧴</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Plastic Bottles</p>
                <p className="text-sm text-gray-600">10 bottles = 25 hours laptop power</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">5.6</p>
                <p className="text-sm text-gray-500">kWh/kg</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">📄</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Paper & Cardboard</p>
                <p className="text-sm text-gray-600">1 ton = power home for 6 months</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">4.1</p>
                <p className="text-sm text-gray-500">kWh/kg</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🍺</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Glass Bottles</p>
                <p className="text-sm text-gray-600">100% recyclable indefinitely</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">0.3</p>
                <p className="text-sm text-gray-500">kWh/kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dubai Impact Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">🇦🇪 Contributing to Dubai's 2030 Goals</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-emerald-100 text-sm mb-2">Sharjah Waste-to-Energy Plant</p>
              <p className="text-xl font-bold">Powers 28,000 homes [web:97]</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-2">Annual CO₂ Reduction</p>
              <p className="text-xl font-bold">450,000 tonnes displaced [web:97]</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-2">Sharjah Landfill Diversion</p>
              <p className="text-xl font-bold">90% diversion rate [web:94]</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-2">Your Contribution</p>
              <p className="text-xl font-bold">{(points / 10).toFixed(0)} items diverted</p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            📊 <strong>Data Sources:</strong> US EPA Recycling Basics [web:88] • WasteTrade Energy Conservation [web:89] • International Aluminium Institute [web:93] • Recycling Today Paper Stats [web:96] • UAE Waste-to-Energy Projects [web:94][web:97]
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
