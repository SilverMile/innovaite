import React from 'react';
import { ScanHistoryEntry } from '../types';

interface HistoryProps {
  scanHistory: ScanHistoryEntry[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ scanHistory, onBack }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'white', padding: '24px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ marginBottom: '24px', padding: '12px 24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
          ← Back
        </button>
        
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          📋 Scan History
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px' }}>
          Track your recycling journey
        </p>
        
        {scanHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ fontSize: '64px', marginBottom: '16px' }}>📦</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>No scans yet</p>
            <p style={{ color: '#6b7280' }}>Start scanning to build your history!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {scanHistory.map((scan, idx) => (
              <div key={scan.id} style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#20593a'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {new Date(scan.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                      +{scan.pointsEarned} pts
                    </span>
                    <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                      +{scan.energySaved.toFixed(1)} kWh
                    </span>
                  </div>
                </div>
                
                <p style={{ color: '#1f2937', fontWeight: 600, marginBottom: '12px', fontSize: '18px' }}>
                  {scan.items.length} items sorted
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {scan.items.slice(0, 5).map((item, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: '#f3f4f6', borderRadius: '999px', fontSize: '13px', color: '#4b5563' }}>
                      {item.name}
                    </span>
                  ))}
                  {scan.items.length > 5 && (
                    <span style={{ padding: '6px 12px', background: '#f3f4f6', borderRadius: '999px', fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
                      +{scan.items.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {scanHistory.length > 0 && (
          <div style={{ marginTop: '32px', padding: '24px', background: '#ecfdf5', border: '2px solid #20593a', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#065f46', marginBottom: '16px' }}>
              📊 Total Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>Total Scans</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#20593a' }}>{scanHistory.length}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>Total Items</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#20593a' }}>
                  {scanHistory.reduce((sum, scan) => sum + scan.items.length, 0)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>Total Points</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#20593a' }}>
                  {scanHistory.reduce((sum, scan) => sum + scan.pointsEarned, 0)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>Total Energy</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#20593a' }}>
                  {scanHistory.reduce((sum, scan) => sum + scan.energySaved, 0).toFixed(1)} kWh
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
