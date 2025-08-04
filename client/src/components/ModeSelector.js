import React from 'react';

const modes = [
  { label: 'News', value: 'news' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Vlogging', value: 'vlogging' },
];

const ModeSelector = ({ value, onChange }) => (
  <div className="mode-selector">
    <label>Select Mode:</label>
    {modes.map(mode => (
      <label key={mode.value} style={{ marginRight: 12 }}>
        <input
          type="radio"
          name="mode"
          value={mode.value}
          checked={value === mode.value}
          onChange={() => onChange(mode.value)}
        />
        {mode.label}
      </label>
    ))}
  </div>
);

export default ModeSelector;
