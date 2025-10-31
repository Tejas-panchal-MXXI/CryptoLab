import React, { useState, useEffect } from 'react';

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [strengthInfo, setStrengthInfo] = useState({});
  const [crackTime, setCrackTime] = useState('--');
  const [warnings, setWarnings] = useState([]);
  const [charTypes, setCharTypes] = useState({
    lowercase: false,
    uppercase: false,
    numbers: false,
    special: false
  });

  const commonPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'letmein', 'admin', 'password123'];
  const sequentialPatterns = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'qwerty', 'asdfgh'];

  const calculateEntropy = (pwd) => {
    let poolSize = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    
    if (poolSize === 0) return 0;
    
    return Math.round(pwd.length * Math.log2(poolSize) * 100) / 100;
  };

  const getStrengthInfo = (ent) => {
    if (ent <= 30) return { level: 'Very Weak', color: '#ef4444', percent: Math.min(ent / 30 * 20, 20), desc: 'Extremely vulnerable' };
    if (ent <= 50) return { level: 'Weak', color: '#f59e0b', percent: 20 + (ent - 30) / 20 * 20, desc: 'Vulnerable to basic attacks' };
    if (ent <= 70) return { level: 'Moderate', color: '#eab308', percent: 40 + (ent - 50) / 20 * 20, desc: 'Acceptable with 2FA' };
    if (ent <= 90) return { level: 'Strong', color: '#22c55e', percent: 60 + (ent - 70) / 20 * 20, desc: 'Secure against most attacks' };
    return { level: 'Very Strong', color: '#10b981', percent: Math.min(80 + (ent - 90) / 10 * 20, 100), desc: 'Extremely secure' };
  };

  const calculateCrackTime = (ent) => {
    const guessesPerSecond = 1000000000;
    const totalCombinations = Math.pow(2, ent);
    const seconds = totalCombinations / (2 * guessesPerSecond);
    
    if (seconds < 1) return 'Less than 1 second';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    return `${Math.round(seconds / 3153600000)} centuries`;
  };

  const detectPatterns = (pwd) => {
    const warns = [];
    if (commonPasswords.some(common => pwd.toLowerCase().includes(common))) {
      warns.push('Contains common password patterns');
    }
    if (/(.)\1{2,}/.test(pwd)) {
      warns.push('Contains repeated characters');
    }
    if (sequentialPatterns.some(pattern => pwd.toLowerCase().includes(pattern))) {
      warns.push('Contains sequential patterns');
    }
    if (pwd.length < 8) {
      warns.push('Password is too short');
    }
    return warns;
  };

  useEffect(() => {
    if (password.length === 0) {
      setEntropy(0);
      setStrengthInfo({});
      setCrackTime('--');
      setWarnings([]);
      setCharTypes({ lowercase: false, uppercase: false, numbers: false, special: false });
      return;
    }

    const ent = calculateEntropy(password);
    setEntropy(ent);
    setStrengthInfo(getStrengthInfo(ent));
    setCrackTime(calculateCrackTime(ent));
    setWarnings(detectPatterns(password));
    
    setCharTypes({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password)
    });
  }, [password]);

  const poolSize = (charTypes.lowercase ? 26 : 0) + (charTypes.uppercase ? 26 : 0) + 
                   (charTypes.numbers ? 10 : 0) + (charTypes.special ? 32 : 0);

  return (
    <div className="card">
      <h2>Password Entropy Visualizer</h2>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a password to analyze..."
      />
      
      <div className="entropy-display" style={{ borderColor: strengthInfo.color }}>
        <div className="entropy-score" style={{ color: strengthInfo.color }}>
          {entropy.toFixed(1)}
        </div>
        <div className="entropy-label">bits of entropy</div>
        <div className="entropy-label">
          {strengthInfo.level || 'Enter a password to begin'}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${strengthInfo.percent || 0}%`, 
            background: strengthInfo.color || '#ef4444' 
          }}
        >
          {Math.round(strengthInfo.percent || 0)}%
        </div>
      </div>

      <h3>Character Pool Analysis</h3>
      <div className="char-pool">
        <div className={`char-type ${charTypes.lowercase ? 'active' : 'inactive'}`}>
          <div style={{ fontSize: '1.5em' }}>🔤</div>
          <div>Lowercase (a-z)</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>26 chars</div>
        </div>
        <div className={`char-type ${charTypes.uppercase ? 'active' : 'inactive'}`}>
          <div style={{ fontSize: '1.5em' }}>🔠</div>
          <div>Uppercase (A-Z)</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>26 chars</div>
        </div>
        <div className={`char-type ${charTypes.numbers ? 'active' : 'inactive'}`}>
          <div style={{ fontSize: '1.5em' }}>🔢</div>
          <div>Numbers (0-9)</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>10 chars</div>
        </div>
        <div className={`char-type ${charTypes.special ? 'active' : 'inactive'}`}>
          <div style={{ fontSize: '1.5em' }}>✨</div>
          <div>Special (!@#$%)</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>32 chars</div>
        </div>
      </div>

      <div className="info">
        <strong>⏱️ Estimated Crack Time:</strong>
        <div style={{ fontSize: '1.3em', marginTop: '10px' }}>{crackTime}</div>
      </div>

      {warnings.length > 0 ? (
        warnings.map((w, i) => (
          <div key={i} className="warning">⚠️ {w}</div>
        ))
      ) : password.length > 0 && (
        <div className="info">✓ No common patterns detected</div>
      )}

      {password.length > 0 && (
        <>
          <h3>Detailed Analysis</h3>
          <div className="info">
            <strong>Length:</strong> {password.length} characters<br />
            <strong>Character Pool Size:</strong> {poolSize} possible characters<br />
            <strong>Entropy Formula:</strong> log₂({poolSize}^{password.length}) = {entropy.toFixed(1)} bits<br />
            <strong>Strength:</strong> {strengthInfo.desc}
          </div>
        </>
      )}

      <h3>💡 Password Security Tips</h3>
      <ul className="tips-list">
        <li>Use at least 12 characters for decent security</li>
        <li>Mix uppercase, lowercase, numbers, and symbols</li>
        <li>Avoid dictionary words and personal information</li>
        <li>Don't use sequential patterns like '123' or 'abc'</li>
        <li>Consider using a passphrase with random words</li>
        <li>Use a unique password for each account</li>
        <li>Enable two-factor authentication when available</li>
      </ul>
    </div>
  );
};

export default PasswordAnalyzer;
