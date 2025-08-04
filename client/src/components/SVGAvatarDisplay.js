import React from 'react';
import PropTypes from 'prop-types';

// Avatar color schemes for each mode/voice
const AVATAR_STYLES = {
  news: {
    male: {
      skinColor: '#f8d5c2',
      hairColor: '#3a3a3a',
      suitColor: '#1a3a6c',
      tieColor: '#cc0000',
      eyeColor: '#4a4a4a',
      mouthColor: '#b22222',
      name: 'News Anchor Michael'
    },
    female: {
      skinColor: '#f8d5c2',
      hairColor: '#6b3e26',
      suitColor: '#4a2b40',
      neckColor: '#f0f0f0',
      eyeColor: '#4a4a4a', 
      mouthColor: '#cc5555',
      name: 'News Anchor Jessica'
    }
  },
  podcast: {
    male: {
      skinColor: '#e8c39e',
      hairColor: '#6b3e26',
      suitColor: '#3d6647',
      tieColor: '#3d6647',
      eyeColor: '#6b5c3e',
      mouthColor: '#a83232',
      name: 'Podcast Host Dave'
    },
    female: {
      skinColor: '#e8c39e',
      hairColor: '#1a1a1a',
      suitColor: '#7c6995',
      neckColor: '#7c6995',
      eyeColor: '#594d33',
      mouthColor: '#b55a4c',
      name: 'Podcast Host Sarah'
    }
  },
  vlogging: {
    male: {
      skinColor: '#e8c39e',
      hairColor: '#e6ac27',
      suitColor: '#cc3333',
      tieColor: '#cc3333',
      eyeColor: '#70a8dd',
      mouthColor: '#9d2b2b',
      name: 'Vlogger Jake'
    },
    female: {
      skinColor: '#e8c39e',
      hairColor: '#d44e26',
      suitColor: '#e86ca0',
      neckColor: '#e86ca0',
      eyeColor: '#5ea85e',
      mouthColor: '#c77b7a',
      name: 'Vlogger Emma'
    }
  }
};

const SVGAvatarDisplay = ({ mode, voice, speaking, mouthOpen = 0 }) => {
  // Make sure we have valid mode and voice
  const safeMode = AVATAR_STYLES[mode] ? mode : 'news';
  const safeVoice = AVATAR_STYLES[safeMode][voice] ? voice : 'male';
  
  // Get the avatar configuration based on mode and voice
  const avatarConfig = AVATAR_STYLES[safeMode][safeVoice];
  
  // SVG animation helpers
  const getHeadAnimation = () => {
    if (speaking && safeMode === 'vlogging') {
      return 'headTilt 3s infinite';
    }
    return 'none';
  };
  
  const getBodyAnimation = () => {
    if (speaking && safeMode === 'vlogging') {
      return 'bodyBounce 1s infinite';
    }
    return 'none';
  };
  
  // Calculate mouth dimensions based on speaking state and mouthOpen value
  const mouthHeight = speaking ? Math.max(5, mouthOpen * 0.3) : 3;
  const mouthWidth = voice === 'male' ? 22 : 18;
  
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#22252B',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }}>
      {/* Gender label */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '3px 10px',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        {voice === 'male' ? '♂️ Male' : '♀️ Female'}
      </div>
      
      {/* SVG Avatar */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 200" 
        style={{ 
          overflow: 'visible',
          filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))'
        }}
      >
        {/* Body */}
        <rect 
          x="70" 
          y="130" 
          width="60" 
          height="70" 
          fill={avatarConfig.suitColor} 
          rx="5"
          style={{
            animation: getBodyAnimation()
          }}
        />
        
        {/* Neck tie/accessory */}
        {voice === 'male' ? (
          <polygon 
            points="95,130 105,130 110,170 90,170" 
            fill={avatarConfig.tieColor} 
          />
        ) : (
          <rect 
            x="85" 
            y="125" 
            width="30" 
            height="10" 
            fill={avatarConfig.neckColor || avatarConfig.suitColor} 
            rx="3"
          />
        )}
        
        {/* Head */}
        <g style={{ animation: getHeadAnimation() }}>
          <circle 
            cx="100" 
            cy="90" 
            r="40" 
            fill={avatarConfig.skinColor} 
          />
          
          {/* Hair */}
          {voice === 'male' ? (
            <path 
              d="M60,80 Q100,40 140,80 V70 Q100,30 60,70 Z" 
              fill={avatarConfig.hairColor}
            />
          ) : (
            <path 
              d="M60,90 Q100,30 140,90 V80 Q100,20 60,80 Z" 
              fill={avatarConfig.hairColor}
            />
          )}
          
          {/* Eyes */}
          <circle cx="85" cy="80" r="5" fill={avatarConfig.eyeColor} />
          <circle cx="115" cy="80" r="5" fill={avatarConfig.eyeColor} />
          
          {/* Eyebrows */}
          <rect x="75" cy="70" width="20" height="3" rx="2" fill={avatarConfig.hairColor} transform="rotate(-10,85,70)" />
          <rect x="105" cy="70" width="20" height="3" rx="2" fill={avatarConfig.hairColor} transform="rotate(10,115,70)" />
          
          {/* Animated mouth - changes height based on mouthOpen value */}
          <g>
            {/* Mouth outline */}
            <rect 
              x={100 - mouthWidth/2}
              y="105"
              width={mouthWidth}
              height={mouthHeight}
              rx={mouthHeight/2}
              fill="#000000"
            />
            
            {/* Mouth interior */}
            <rect 
              x={100 - (mouthWidth-4)/2}
              y="106"
              width={mouthWidth-4}
              height={mouthHeight-2}
              rx={(mouthHeight-2)/2}
              fill={speaking ? "#ff0000" : avatarConfig.mouthColor}
            />
            
            {/* Teeth when speaking */}
            {speaking && mouthHeight > 8 && (
              <rect 
                x={100 - (mouthWidth-8)/2}
                y="107"
                width={mouthWidth-8}
                height="4"
                fill="#ffffff"
              />
            )}
          </g>
        </g>
      </svg>
      
      {/* Name tag */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        {avatarConfig.name}
      </div>
      
      {/* Speaking indicator with animation */}
      {speaking && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 'bold',
          zIndex: 10,
          opacity: 1,
          animation: 'speakingPulse 1s infinite alternate'
        }}>
          SPEAKING
        </div>
      )}
      
      {/* Add a style tag with the keyframes animations */}
      <style>
        {`
          @keyframes speakingPulse {
            0% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          @keyframes bodyBounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(3px); }
          }
          @keyframes headTilt {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
          }
        `}
      </style>
    </div>
  );
};

SVGAvatarDisplay.propTypes = {
  mode: PropTypes.string.isRequired,
  voice: PropTypes.string.isRequired,
  speaking: PropTypes.bool,
  mouthOpen: PropTypes.number
};

SVGAvatarDisplay.defaultProps = {
  speaking: false,
  mouthOpen: 0
};

export default SVGAvatarDisplay;
