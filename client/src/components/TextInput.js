import React from 'react';

const TextInput = ({ value, onChange }) => (
  <div className="text-input">
    <label htmlFor="tts-text">Enter Text:</label>
    <textarea
      id="tts-text"
      rows={4}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Type your text here..."
      style={{ width: '100%', padding: '8px', fontSize: '1rem' }}
    />
  </div>
);

export default TextInput;
