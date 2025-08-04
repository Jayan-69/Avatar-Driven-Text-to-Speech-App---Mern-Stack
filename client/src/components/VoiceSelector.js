import React from 'react';

const voices = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const VoiceSelector = ({ value, onChange }) => (
  <div className="voice-selector">
    <label>Select Voice:</label>
    {voices.map(voice => (
      <label key={voice.value} style={{ marginRight: 12 }}>
        <input
          type="radio"
          name="voice"
          value={voice.value}
          checked={value === voice.value}
          onChange={() => onChange(voice.value)}
        />
        {voice.label}
      </label>
    ))}
  </div>
);

export default VoiceSelector;
