import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

// Default avatar URLs - using publicly available 3D models
const AVATAR_MODELS = {
  news: {
    male: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/business-man/model.gltf',
    female: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/business-woman/model.gltf'
  },
  podcast: {
    male: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/casual-man/model.gltf',
    female: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/casual-woman/model.gltf'
  },
  vlogging: {
    male: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/man/model.gltf',
    female: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/woman/model.gltf'
  }
};

// 3D Avatar model with lip sync
function Avatar({ mode, voice, speaking, mouthOpen }) {
  const groupRef = useRef();
  const modelUrl = AVATAR_MODELS[mode]?.[voice] || AVATAR_MODELS.news.male;
  
  // Load the 3D model
  const { scene, nodes } = useGLTF(modelUrl, true);
  
  // Animation loop for lip sync
  useFrame(() => {
    if (groupRef.current && nodes && nodes.Wolf3D_Head) {
      // Only animate if speaking
      if (speaking && mouthOpen > 0) {
        // Find the morphTarget indices for mouth shapes
        const morphTargets = nodes.Wolf3D_Head.morphTargetDictionary;
        
        if (morphTargets) {
          // Common morph target names for lip movement
          const mouthOpenIndex = morphTargets.mouthOpen || morphTargets.viseme_O || 0;
          
          // Normalize the mouthOpen value (0-100) to morph target range (0-1)
          const morphValue = Math.min(1, mouthOpen / 100);
          
          // Apply the morph target value
          if (nodes.Wolf3D_Head.morphTargetInfluences) {
            nodes.Wolf3D_Head.morphTargetInfluences[mouthOpenIndex] = morphValue;
          }
        }
      } else if (nodes.Wolf3D_Head.morphTargetInfluences) {
        // Reset mouth to closed position when not speaking
        const morphTargets = nodes.Wolf3D_Head.morphTargetDictionary;
        if (morphTargets) {
          const mouthOpenIndex = morphTargets.mouthOpen || morphTargets.viseme_O || 0;
          nodes.Wolf3D_Head.morphTargetInfluences[mouthOpenIndex] = 0;
        }
      }
    }
  });

  // Clone the scene to prevent conflicts
  const model = scene.clone();

  return (
    <group ref={groupRef}>
      <primitive object={model} position={[0, -1, 0]} scale={1.5} />
    </group>
  );
}

// Main 3D Avatar display component
const ThreeDAvatar = ({ mode, voice, speaking, mouthOpen = 0 }) => {
  // Ensure we have valid mode and voice
  const safeMode = AVATAR_MODELS[mode] ? mode : 'news';
  const safeVoice = AVATAR_MODELS[safeMode][voice] ? voice : 'male';
  
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Avatar 
          mode={safeMode} 
          voice={safeVoice} 
          speaking={speaking} 
          mouthOpen={mouthOpen} 
        />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI/3} 
          maxPolarAngle={Math.PI/1.5} 
        />
      </Canvas>
      
      {/* Avatar info overlay */}
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
      
      {/* Speaking indicator */}
      {speaking && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '10px',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 'bold',
          zIndex: 10,
          animation: 'speakingPulse 1s infinite alternate'
        }}>
          SPEAKING
        </div>
      )}
      
      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes speakingPulse {
            0% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default ThreeDAvatar;
