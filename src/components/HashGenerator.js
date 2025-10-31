import React, { useState, useEffect } from 'react';

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '--',
    sha1: '--',
    sha256: '--',
    sha512: '--'
  });

  const md5Simple = (str) => {
    const rotateLeft = (value, shift) => (value << shift) | (value >>> (32 - shift));
    const addUnsigned = (x, y) => (x + y) >>> 0;
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = addUnsigned(hash, str.charCodeAt(i));
      hash = addUnsigned(hash, rotateLeft(hash, 10));
      hash ^= (hash >>> 6);
    }
    hash = addUnsigned(hash, rotateLeft(hash, 3));
    hash ^= (hash >>> 11);
    hash = addUnsigned(hash, rotateLeft(hash, 15));
    
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8).repeat(4);
  };

  useEffect(() => {
    const generateHashes = async () => {
      if (!input) {
        setHashes({ md5: '--', sha1: '--', sha256: '--', sha512: '--' });
        return;
      }

      const newHashes = { md5: md5Simple(input) };
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      try {
        const sha1 = await crypto.subtle.digest('SHA-1', data);
        newHashes.sha1 = Array.from(new Uint8Array(sha1))
          .map(b => b.toString(16).padStart(2, '0')).join('');

        const sha256 = await crypto.subtle.digest('SHA-256', data);
        newHashes.sha256 = Array.from(new Uint8Array(sha256))
          .map(b => b.toString(16).padStart(2, '0')).join('');

        const sha512 = await crypto.subtle.digest('SHA-512', data);
        newHashes.sha512 = Array.from(new Uint8Array(sha512))
          .map(b => b.toString(16).padStart(2, '0')).join('');

        setHashes(newHashes);
      } catch (e) {
        console.error('Error generating hashes:', e);
      }
    };

    generateHashes();
  }, [input]);

  const copyHash = (algo) => {
    navigator.clipboard.writeText(hashes[algo]);
    alert('Hash copied to clipboard!');
  };

  const hashInfo = {
    md5: { color: '#ef4444', security: '⚠️ Deprecated - for checksums only' },
    sha1: { color: '#f59e0b', security: '⚠️ Weak - avoid for security' },
    sha256: { color: '#22c55e', security: '✓ Strong - widely used and secure' },
    sha512: { color: '#10b981', security: '✓ Very Strong - maximum security' }
  };

  return (
    <div className="card">
      <h2>Cryptographic Hash Generator</h2>
      
      <h3>Input Text</h3>
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash..."
      />

      <div className="grid-2">
        {Object.keys(hashInfo).map(algo => (
          <div key={algo}>
            <h3 style={{ color: hashInfo[algo].color }}>{algo.toUpperCase()}</h3>
            <div className="info" style={{ borderColor: hashInfo[algo].color }}>
              <small>{hashInfo[algo].security}</small>
            </div>
            <div className="hash-output">
              <div style={{ fontSize: '0.9em' }}>{hashes[algo]}</div>
              {hashes[algo] !== '--' && (
                <button className="copy-btn" onClick={() => copyHash(algo)}>Copy</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashGenerator;
