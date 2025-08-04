import React from 'react';
import PropTypes from 'prop-types';

// Avatar color schemes for each mode/voice
const AVATAR_STYLES = {
  news: {
    male: {
      color: '#1a3a6c', // Dark blue suit
      faceColor: '#f8d5c2', // Light skin tone
      hairColor: '#3a3a3a', // Dark hair
      eyeColor: '#4a4a4a', // Dark eyes
      mouthColor: '#b22222', // Darker red lips for contrast
      mouthBorderColor: '#800000', // Very dark red border for more definition
      neckTieColor: '#cc0000', // Red tie
      name: 'News Anchor Michael'
    },
    female: {
      color: '#4a2b40', // Burgundy suit
      faceColor: '#f8d5c2', // Light skin tone
      hairColor: '#6b3e26', // Brown hair
      eyeColor: '#4a4a4a', // Dark eyes
      mouthColor: '#cc5555', // Red lips
      neckTieColor: '#f0f0f0', // Light neck accent
      name: 'News Anchor Jessica'
    }
  },
  podcast: {
    male: {
      color: '#3d6647', // Green casual shirt
      faceColor: '#e8c39e', // Medium skin tone
      hairColor: '#6b3e26', // Brown hair
      eyeColor: '#6b5c3e', // Brown eyes
      mouthColor: '#a83232', // Darker red lips for better visibility
      mouthBorderColor: '#722222', // Dark border for definition
      neckTieColor: '#3d6647', // Matching shirt
      name: 'Podcast Host Dave'
    },
    female: {
      color: '#7c6995', // Purple casual outfit
      faceColor: '#e8c39e', // Medium skin tone
      hairColor: '#1a1a1a', // Black hair
      eyeColor: '#594d33', // Hazel eyes
      mouthColor: '#b55a4c', // Natural lips
      neckTieColor: '#7c6995', // Matching shirt
      name: 'Podcast Host Sarah'
    }
  },
  vlogging: {
    male: {
      color: '#cc3333', // Red hoodie
      faceColor: '#e8c39e', // Medium skin tone
      hairColor: '#e6ac27', // Blonde hair
      eyeColor: '#70a8dd', // Blue eyes
      mouthColor: '#9d2b2b', // Vibrant red lips for contrast
      mouthBorderColor: '#6e1f1f', // Dark border for definition
      neckTieColor: '#cc3333', // Matching shirt
      name: 'Vlogger Jake'
    },
    female: {
      color: '#e86ca0', // Pink sweater
      faceColor: '#e8c39e', // Medium skin tone
      hairColor: '#d44e26', // Red hair
      eyeColor: '#5ea85e', // Green eyes
      mouthColor: '#c77b7a', // Pink lips
      neckTieColor: '#e86ca0', // Matching shirt
      name: 'Vlogger Emma'
    }
  }
};

const AvatarDisplay = ({ mode, voice, speaking, mouthOpen = 0 }) => {
  // Make sure we have valid mode and voice
  const safeMode = AVATAR_STYLES[mode] ? mode : 'news';
  const safeVoice = AVATAR_STYLES[safeMode][voice] ? voice : 'male';
  
  // Get the avatar configuration based on mode and voice
  const avatarConfig = AVATAR_STYLES[safeMode][safeVoice];
  
  return (
    <div className="avatar-display" style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#22252B'
    }}>
      {/* CSS-based animated avatar */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '20px',
        borderRadius: '8px',
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
        
        {/* Body */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '190px' : '170px',
          height: '100px',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: avatarConfig.color,
          borderRadius: '50px 50px 0 0',
          zIndex: 1,
          // Add slight animation when speaking
          transition: 'transform 0.3s',
          ...(speaking && mode === 'vlogging' ? {
            animation: 'bodyBounce 1s infinite'
          } : {})
        }}></div>
        
        {/* Neck tie/accessory */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '30px' : '50px',
          height: voice === 'male' ? '60px' : '20px',
          bottom: voice === 'male' ? '0' : '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: avatarConfig.neckTieColor,
          ...(voice === 'male' ? {
            clipPath: 'polygon(0% 0%, 100% 0%, 60% 100%, 40% 100%)'
          } : {
            borderRadius: '10px'
          }),
          zIndex: 2
        }}></div>
        
        {/* Head */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: voice === 'male' ? '150px' : '145px',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: avatarConfig.faceColor,
          borderRadius: voice === 'male' ? '70px 70px 60px 60px' : '75px 75px 60px 60px',
          zIndex: 2,
          // Add slight animation when speaking
          ...(speaking && mode === 'vlogging' ? {
            animation: 'headTilt 2s infinite'
          } : {})
        }}></div>
        
        {/* Hair */}
        <div style={{
          position: 'absolute',
          width: '130px',
          height: voice === 'male' ? '35px' : '60px',
          top: voice === 'male' ? '25px' : '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: avatarConfig.hairColor,
          borderRadius: voice === 'male' ? '60px 60px 0 0' : '60px 60px 50px 50px',
          zIndex: 1
        }}></div>
        
        {/* Left eye */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '10px' : '12px',
          height: voice === 'male' ? '12px' : '14px',
          borderRadius: '50%',
          top: '80px',
          left: 'calc(50% - 30px)',
          backgroundColor: avatarConfig.eyeColor,
          zIndex: 3
        }}></div>
        
        {/* Right eye */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '10px' : '12px',
          height: voice === 'male' ? '12px' : '14px',
          borderRadius: '50%',
          top: '80px',
          right: 'calc(50% - 30px)',
          backgroundColor: avatarConfig.eyeColor,
          zIndex: 3
        }}></div>
        
        {/* Left eyebrow */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '20px' : '15px',
          height: voice === 'male' ? '5px' : '4px',
          borderRadius: '5px',
          top: voice === 'male' ? '65px' : '63px',
          left: 'calc(50% - 35px)',
          transform: 'rotate(-10deg)',
          backgroundColor: avatarConfig.hairColor,
          zIndex: 3
        }}></div>
        
        {/* Right eyebrow */}
        <div style={{
          position: 'absolute',
          width: voice === 'male' ? '20px' : '15px',
          height: voice === 'male' ? '5px' : '4px',
          borderRadius: '5px',
          top: voice === 'male' ? '65px' : '63px',
          right: 'calc(50% - 35px)',
          transform: 'rotate(10deg)',
          backgroundColor: avatarConfig.hairColor,
          zIndex: 3
        }}></div>
        
        {/* Animated mouth */}
        {voice === 'male' ? (
          // SUPER OBVIOUS CARTOON LIPS - Impossible to miss
          <>
            {/* Outer lip border - bold black outline */}
            <div style={{
              position: 'absolute',
              width: '70px',  // Very wide
              height: speaking ? `${Math.max(25, mouthOpen * 2)}px` : '18px', // Tall even when not speaking
              borderRadius: '35px',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '4px solid black',  // Very thick border
              backgroundColor: 'transparent',
              zIndex: 4
            }}></div>
            
            {/* Main lip fill - bright red */}
            <div style={{
              position: 'absolute',
              width: '64px',
              height: speaking ? `${Math.max(19, mouthOpen * 1.9)}px` : '12px',
              borderRadius: '32px', 
              bottom: '43px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ff0000', // Pure red
              zIndex: 3
            }}></div>
            
            {/* Lip shine - glossy effect */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '6px',
              borderRadius: '20px',
              bottom: speaking ? `${55 + (mouthOpen * 0.7)}px` : '49px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255,255,255,0.6)', // White shine
              zIndex: 5
            }}></div>

            {/* Lip divider line */}
            <div style={{
              position: 'absolute',
              width: '64px',
              height: '2px',
              bottom: '49px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#990000',
              zIndex: 5,
              display: speaking ? 'none' : 'block' // Only show when not speaking
            }}></div>
          </>
        ) : (
          // Female mouth (unchanged)
          <div style={{
            position: 'absolute',
            width: speaking ? `${40 + mouthOpen * 0.2}px` : '40px',
            height: speaking ? `${mouthOpen}px` : '2px',
            borderRadius: '0 0 20px 20px',
            bottom: '45px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: avatarConfig.mouthColor,
            boxShadow: speaking ? `inset 0 ${mouthOpen/3}px 10px rgba(0,0,0,0.3)` : 'none',
            zIndex: 3,
            transition: 'all 0.05s ease-in-out'
          }}></div>
        )}
        
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
      </div>
      
      {/* Speaking indicator with animation */}
      {speaking && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
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
      
      {/* Mouth animation debug info */}
      {speaking && (
        <div style={{ 
          position: 'absolute', 
          bottom: '5px', 
          left: '5px', 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          color: 'white',
          fontSize: '10px',
          padding: '2px 5px',
          borderRadius: '3px',
          zIndex: 10
        }}>
          Mouth: {Math.round(mouthOpen)}%
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
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-50%) translateY(3px); }
          }
          @keyframes headTilt {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            25% { transform: translateX(-50%) rotate(-2deg); }
            75% { transform: translateX(-50%) rotate(2deg); }
          }
        `}
      </style>
    </div>
  );
};

AvatarDisplay.propTypes = {
  mode: PropTypes.string.isRequired,
  voice: PropTypes.string.isRequired,
  speaking: PropTypes.bool,
  mouthOpen: PropTypes.number
};

AvatarDisplay.defaultProps = {
  speaking: false,
  mouthOpen: 0
};

export default AvatarDisplay;
