import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import PropTypes from 'prop-types';

// Model paths from reliable CDN
const MODELS = {
  femaleIdle: 'https://threejs.org/examples/models/gltf/Fox.glb',
  femaleSpeaking: 'https://threejs.org/examples/models/gltf/Fox.glb'
};

// 3D Avatar model
function AvatarModel({ voice, speaking, mouthOpen }) {
  const group = useRef();
  // Select model based on voice and speaking state
  let modelUrl;
  if (voice === 'male') {
    modelUrl = speaking ? MODELS.maleSpeaking : MODELS.maleIdle;
  } else {
    modelUrl = speaking ? MODELS.femaleSpeaking : MODELS.femaleIdle;
  }

  // Animation states
  const [rotation, setRotation] = useState(0);

  // Animate based on speaking
  useEffect(() => {
    let animationFrame;
    if (speaking) {
      const animate = () => {
        setRotation(prev => prev + 0.01);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    } else {
      setRotation(0); // Reset rotation to default when not speaking
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [speaking]);

  return (
    <group ref={group} rotation={[0, rotation, 0]}>
      <mesh>
        <Model url={modelUrl} scale={voice === 'male' ? 0.01 : 0.01} />
      </mesh>
    </group>
  );
}

// Load actual 3D model
function Model({ url, scale = 1 }) {
  const { scene } = useGLTF(url);
  
  return (
    <primitive 
      object={scene} 
      scale={scale} 
      position={[0, -2, 0]} 
    />
  );
}

// Main 3D Avatar Display Component
const Simple3DAvatar = ({ mode, voice, speaking, mouthOpen = 0, paused = false, resetVideo = false }) => {
  // Show boy video for male, 3D fox for female
  const videoRef = useRef(null);

  useEffect(() => {
    if (voice !== 'male') return;
    const video = videoRef.current;
    if (!video) return;
    if (resetVideo) {
      video.pause();
      video.currentTime = 0;
    } else if (speaking && !paused) {
      video.play();
    } else if (paused) {
      video.pause();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [voice, speaking, paused, resetVideo]);

  if (voice === 'male') {
    // Inject animated pip up effect only once
    if (typeof window !== 'undefined' && !document.getElementById('pipup-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pipup-keyframes';
      style.innerHTML = `
        @keyframes pipUpGlow {
          0% { box-shadow: 0 0 0 0 rgba(93,158,255,0.00), 0 0 0 0 rgba(93,158,255,0.00); transform: scale(1); }
          40% { box-shadow: 0 0 48px 12px rgba(93,158,255,0.32), 0 0 0 8px rgba(93,158,255,0.16); transform: scale(1.09); }
          100% { box-shadow: 0 0 32px 8px rgba(93,158,255,0.45), 0 0 0 6px rgba(93,158,255,0.18); transform: scale(1.04); }
        }
        .avatar-pipup-glow {
          animation: pipUpGlow 0.45s cubic-bezier(.19,1,.22,1);
          box-shadow: 0 0 32px 8px rgba(93,158,255,0.45), 0 0 0 6px rgba(93,158,255,0.18) !important;
          transform: scale(1.04) !important;
        }
      `;
      document.head.appendChild(style);
    }
    return (
      <div
        className={speaking ? 'avatar-pipup-glow' : ''}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          backgroundColor: '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '16/9',
          minHeight: 0,
          minWidth: 0,
          boxShadow: !speaking
            ? '0 4px 32px 0 rgba(93,158,255,0.10)'
            : undefined,
          transform: !speaking ? 'scale(1)' : undefined,
          transition: 'box-shadow 0.3s, transform 0.25s cubic-bezier(.19,1,.22,1)',
          zIndex: 2,
        }}
      >
        <video
          ref={videoRef}
          src={process.env.PUBLIC_URL + '/avatars/boy.mp4'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: 'transparent',
            borderRadius: '1.5rem',
            boxShadow: speaking ? '0 0 32px 8px rgba(93,158,255,0.25)' : 'none',
            filter: paused ? 'grayscale(60%) brightness(0.7)' : 'none',
            transition: 'box-shadow 0.3s, filter 0.2s',
          }}
          muted
          playsInline
          controls={false}
        />
      </div>
    );
  }
  // Default: female = 3D fox
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0'
    }}>
      <Canvas style={{ background: 'linear-gradient(to bottom, #87CEEB, #e0e0e0)' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <AvatarModel 
          voice={voice} 
          speaking={paused ? false : speaking} 
          mouthOpen={mouthOpen} 
        />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI/3}
          maxPolarAngle={Math.PI/1.8}
        />
      </Canvas>
      
      {/* Voice indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        {voice === 'male' ? 'Male Voice' : 'Female Voice'}
      </div>
      
      {/* Mode indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
      </div>
      
      {/* Speaking indicator */}
      {speaking && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,0,0,0.7)',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          animation: 'pulse 1s infinite alternate'
        }}>
          SPEAKING
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

Simple3DAvatar.propTypes = {
  mode: PropTypes.string.isRequired,
  voice: PropTypes.string.isRequired,
  speaking: PropTypes.bool,
  mouthOpen: PropTypes.number
};

export default Simple3DAvatar;
