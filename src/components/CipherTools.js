import React, { useState } from 'react';

const CipherTools = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [cipherType, setCipherType] = useState('caesar');
  const [shift, setShift] = useState(3);

  const handleEncrypt = () => {
    let result = '';
    switch (cipherType) {
      case 'caesar':
        result = caesarCipher(inputText, shift);
        break;
      case 'rot13':
        result = rot13(inputText);
        break;
      case 'atbash':
        result = atbashCipher(inputText);
        break;
      case 'base64':
        result = btoa(inputText);
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
  };

  const handleDecrypt = () => {
    let result = '';
    switch (cipherType) {
      case 'caesar':
        result = caesarCipher(inputText, -shift);
        break;
      case 'rot13':
        result = rot13(inputText);
        break;
      case 'atbash':
        result = atbashCipher(inputText);
        break;
      case 'base64':
        try {
          result = atob(inputText);
        } catch (e) {
          result = 'Invalid Base64 string';
        }
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
  };

  const caesarCipher = (text, shift) => {
    return text.split('').map(char => {
      if (/[a-z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift + 26) % 26) + 97);
      } else if (/[A-Z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift + 26) % 26) + 65);
      } else {
        return char;
      }
    }).join('');
  };

  const rot13 = (text) => {
    return caesarCipher(text, 13);
  };

  const atbashCipher = (text) => {
    return text.split('').map(char => {
      if (/[a-z]/.test(char))
        return String.fromCharCode(219 - char.charCodeAt(0)); // a=97, z=122 → 219-97=122, 219-122=97
      else if (/[A-Z]/.test(char))
        return String.fromCharCode(155 - char.charCodeAt(0)); // A=65, Z=90 → 155-65=90, 155-90=65
      else
        return char;
    }).join('');
  };

  return (
    <div className="card">
      <h2>Cryptographic Ciphers</h2>
      <div>
        <label>Select Cipher Type: </label>
        <select value={cipherType} onChange={(e) => setCipherType(e.target.value)}>
          <option value="caesar">Caesar (Shift)</option>
          <option value="rot13">ROT13</option>
          <option value="atbash">Atbash</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      {cipherType === 'caesar' && (
        <div style={{ marginTop: '10px' }}>
          <label>Shift: {shift}</label>
          <input
            type="range"
            min="1"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
          />
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <textarea
          placeholder="Input text..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt} style={{ marginLeft: '10px' }}>Decrypt</button>
      </div>
      <h3 style={{ marginTop: '20px' }}>Result:</h3>
      <textarea value={outputText} readOnly rows={4} />
    </div>
  );
};

export default CipherTools;