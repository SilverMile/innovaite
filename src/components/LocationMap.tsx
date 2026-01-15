import React from 'react';

interface LocationMapProps {
  onBack: () => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ onBack }) => {
  const locations = [
    { 
      name: 'Dubai Municipality Recycling Centre', 
      area: 'Al Qusais', 
      distance: '2.3 km', 
      accepts: 'All recyclables', 
      hours: '7 AM - 10 PM',
      phone: '+971 4 206 5555'
    },
    { 
      name: 'Enviroserve E-Waste Collection', 
      area: 'Jebel Ali', 
      distance: '8.5 km', 
      accepts: 'Electronics, batteries', 
      hours: '9 AM - 6 PM',
      phone: '+971 4 801 8484'
    },
    { 
      name: 'Bee\'ah Recycling Point', 
      area: 'Dubai Silicon Oasis', 
      distance: '5.1 km', 
      accepts: 'Plastic, paper, metal, glass', 
      hours: '24/7',
      phone: '+971 6 531 1511'
    },
    { 
      name: 'Carrefour Recycling Station', 
      area: 'Mall of the Emirates', 
      distance: '3.7 km', 
      accepts: 'Plastic bottles, aluminum cans', 
      hours: 'Mall hours (10 AM - 12 AM)',
      phone: '+971 800 627 2336'
    },
    { 
      name: 'The Sustainable City Drop-off', 
      area: 'Dubailand', 
      distance: '12.0 km', 
      accepts: 'All materials + organic', 
      hours: '8 AM - 8 PM',
      phone: '+971 4 256 5656'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ marginBottom: '24px', padding: '12px 24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
          ← Back
        </button>
        
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          🗺️ Recycling Drop-off Locations
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px' }}>
          Find the nearest recycling center in Dubai
        </p>
        
        {/* Search/Filter */}
        <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>💡 <strong>Tip:</strong> Call ahead to confirm hours and accepted materials</p>
        </div>

        {/* Locations List */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
          {locations.map((location, idx) => (
            <div key={idx} style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '24px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#20593a'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{location.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                    <p style={{ margin: 0 }}>📍 {location.area} • {location.distance} away</p>
                    <p style={{ margin: 0 }}>📞 {location.phone}</p>
                  </div>
                </div>
                <span style={{ padding: '6px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '999px', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>Open</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>Accepts:</p>
                  <p style={{ color: '#1f2937', fontWeight: 600, margin: 0 }}>{location.accepts}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>Hours:</p>
                  <p style={{ color: '#1f2937', fontWeight: 600, margin: 0 }}>{location.hours}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(location.name + ' Dubai')}`, '_blank')} 
                  style={{ padding: '12px', background: '#20593a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#065f46'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#20593a'}
                >
                  🧭 Get Directions
                </button>
                <button 
                  onClick={() => window.open(`tel:${location.phone}`, '_blank')} 
                  style={{ padding: '12px', background: 'white', color: '#20593a', border: '2px solid #20593a', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#20593a'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#20593a'; }}
                >
                  📞 Call Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Section */}
        <div style={{ background: '#ecfdf5', border: '2px solid #20593a', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px' }}>
            🚚 Can't Drop Off? Schedule a Pickup!
          </h3>
          <p style={{ color: '#065f46', marginBottom: '20px', fontSize: '16px' }}>
            Partner with professional waste collection services for doorstep pickup
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <button 
              onClick={() => window.open('https://www.gorecapp.com', '_blank')} 
              style={{ padding: '16px', background: 'white', color: '#20593a', border: '2px solid #20593a', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#20593a'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#20593a'; }}
            >
              RECAPP by Veolia →
            </button>
            <button 
              onClick={() => window.open('https://apps.apple.com/ae/app/reloop/id1532063055', '_blank')} 
              style={{ padding: '16px', background: 'white', color: '#20593a', border: '2px solid #20593a', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#20593a'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#20593a'; }}
            >
              ReLoop App →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
