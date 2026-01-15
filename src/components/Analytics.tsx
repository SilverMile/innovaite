import React from 'react';
import { ScanHistoryEntry } from '../types';

interface AnalyticsProps {
  points: number;
  totalEnergySaved: number;
  scanHistory: ScanHistoryEntry[];
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ points, totalEnergySaved, scanHistory, onBack }) => {
  const laptopHours = (totalEnergySaved * 25).toFixed(0);
  const homesPerYear = (totalEnergySaved / 4100).toFixed(2);
  const co2Saved = (totalEnergySaved * 0.4).toFixed(1);
  const treesPlanted = (parseFloat(co2Saved) / 21).toFixed(1);
  const totalItems = Math.floor(points / 10);
  const wasteDiverted = (totalItems * 0.5).toFixed(1);

  // Calculate waste breakdown
  const wasteBreakdown = [
    { category: 'Recyclable', percentage: 45, color: '#20593a', items: Math.floor(totalItems * 0.45) },
    { category: 'Organic', percentage: 30, color: '#8B4513', items: Math.floor(totalItems * 0.30) },
    { category: 'Landfill', percentage: 20, color: '#1f2937', items: Math.floor(totalItems * 0.20) },
    { category: 'Hazardous', percentage: 5, color: '#dc2626', items: Math.floor(totalItems * 0.05) }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      {/* Header */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#20593a', margin: 0 }}>Energy Analytics</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Your environmental impact dashboard</p>
          </div>
          <button onClick={onBack} style={{ padding: '10px 24px', background: '#f3f4f6', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'} onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}>
            ← Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Main Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #20593a 0%, #34d399 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 20px 25px -5px rgba(32,89,58,0.3)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Total Energy Saved</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '8px 0', lineHeight: 1 }}>{totalEnergySaved.toFixed(1)}</p>
            <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)' }}>kilowatt-hours (kWh)</p>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>That's enough to power:</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>💻 A laptop for {laptopHours} hours</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 20px 25px -5px rgba(251,191,36,0.3)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Total Points Earned</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '8px 0', lineHeight: 1 }}>{points}</p>
            <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)' }}>reward points</p>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>Items sorted correctly:</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>♻️ {totalItems} items</p>
            </div>
          </div>
        </div>

        {/* Waste Stream Breakdown */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            📊 Your Waste Stream Breakdown
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {wasteBreakdown.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1f2937' }}>{cat.category}</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>{cat.items} items ({cat.percentage}%)</span>
                </div>
                <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${cat.percentage}%`, 
                    height: '100%', 
                    background: cat.color,
                    borderRadius: '999px',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>🌍 Environmental Impact</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: '#ecfdf5', borderRadius: '20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>🌳</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#20593a', margin: '8px 0' }}>{treesPlanted}</p>
              <p style={{ color: '#6b7280', fontWeight: 500, marginTop: '8px' }}>Trees Equivalent</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>CO₂ absorption/year</p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#dbeafe', borderRadius: '20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>💨</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', margin: '8px 0' }}>{co2Saved} kg</p>
              <p style={{ color: '#6b7280', fontWeight: 500, marginTop: '8px' }}>CO₂ Prevented</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Emissions avoided</p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#fef3c7', borderRadius: '20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>🚮</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e', margin: '8px 0' }}>{wasteDiverted} kg</p>
              <p style={{ color: '#6b7280', fontWeight: 500, marginTop: '8px' }}>Waste Diverted</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>From Dubai landfills</p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#f3e8ff', borderRadius: '20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>💧</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#9333ea', margin: '8px 0' }}>{(totalEnergySaved * 150).toFixed(0)} L</p>
              <p style={{ color: '#6b7280', fontWeight: 500, marginTop: '8px' }}>Water Saved</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Recycling vs virgin</p>
            </div>
          </div>
        </div>

        {/* Energy by Material */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>⚡ Energy Savings by Material</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🥫', name: 'Aluminum Cans', desc: 'Saves 95% energy vs. new', value: '14.0', color: '#6b7280' },
              { icon: '🧴', name: 'Plastic Bottles', desc: '10 bottles = 25 hours laptop', value: '5.6', color: '#2563eb' },
              { icon: '📄', name: 'Paper & Cardboard', desc: '1 ton = power home 6 months', value: '4.1', color: '#f59e0b' },
              { icon: '🍺', name: 'Glass Bottles', desc: '100% recyclable infinitely', value: '0.3', color: '#20593a' }
            ].map((material, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ width: '64px', height: '64px', background: material.icon === '🥫' ? '#e5e7eb' : material.icon === '🧴' ? '#dbeafe' : material.icon === '📄' ? '#fef3c7' : '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
                  {material.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{material.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{material.desc}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: material.color, margin: 0 }}>{material.value}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>kWh/kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {scanHistory.length > 0 && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>📈 Recent Activity</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {scanHistory.slice(0, 5).map((scan, idx) => (
                <div key={scan.id} style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{scan.items.length} items sorted</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(scan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', color: '#20593a', marginBottom: '4px' }}>+{scan.pointsEarned} pts</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>+{scan.energySaved.toFixed(1)} kWh</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dubai Impact */}
        <div style={{ background: 'linear-gradient(135deg, #20593a 0%, #065f46 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 20px 25px -5px rgba(32,89,58,0.3)' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>🇦🇪 Dubai 2030 Impact</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Sharjah WtE Plant', value: 'Powers 28,000 homes' },
              { label: 'CO₂ Reduction', value: '450,000 tonnes/year' },
              { label: 'Landfill Diversion', value: '90% diversion rate' },
              { label: 'Your Contribution', value: `${totalItems} items diverted` }
            ].map((stat, idx) => (
              <div key={idx}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div style={{ marginTop: '32px', padding: '24px', background: '#f3f4f6', borderRadius: '20px' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
            📊 <strong>Data Sources:</strong> US EPA • WasteTrade • Int'l Aluminium Institute • UAE Waste-to-Energy Projects
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
