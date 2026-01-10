import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '64px', color: '#2d5016', margin: '0' }}>
        WASTEless
      </h1>
      <p style={{ fontSize: '28px', color: '#666', marginTop: '20px' }}>
        AI Waste Sorting for Dubai
      </p>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px',
        marginTop: '40px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        <p style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
          <strong>✅ Setup Complete!</strong>
        </p>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Your React + TypeScript + Vite app is working perfectly.
        </p>
        <p style={{ color: '#666', marginTop: '16px', fontSize: '14px' }}>
          Ready to add camera & AI features next! 🚀
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
