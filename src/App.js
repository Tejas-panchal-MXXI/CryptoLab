import React, { useState } from 'react';
import './styles/App.css';
import LetterGlitch from './components/LetterGlitch';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import CipherTools from './components/CipherTools';
import HashGenerator from './components/HashGenerator';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: '🔐 Password Analyzer', component: <PasswordAnalyzer /> },
    { id: 1, name: '🔄 Cipher Tools', component: <CipherTools /> },
    { id: 2, name: '#️⃣ Hash Generator', component: <HashGenerator /> }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <LetterGlitch
        glitchSpeed={50}
        glitchColors={['#00ffd0', '#a855f7', '#61b3dc']}
        centerVignette={false}
        outerVignette={true}
        smooth={true}
        characters={"ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"}
      />
      <div className="container">
        <header>
          <h1>CryptoLab</h1>
          <p>Interactive Cryptography Learning Playground</p>
        </header>
        <div className="tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <div className="tab-content-wrapper">
          {tabs[activeTab].component}
        </div>
        <footer>
          <p>⚠️ For educational purposes only. Use proper cryptographic libraries in production.</p>
          <p style={{ marginTop: '10px' }}>Built for learning cryptography</p>
        </footer>
      </div>
    </div>
  );
}

export default App;



