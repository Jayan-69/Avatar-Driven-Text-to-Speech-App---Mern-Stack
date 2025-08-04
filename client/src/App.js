import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Simple3DAvatar from './components/Simple3DAvatar';

// Inject premium animated wave CSS only once
if (typeof window !== 'undefined' && !document.getElementById('tts-wave-bar-css')) {
  const style = document.createElement('style');
  style.id = 'tts-wave-bar-css';
  style.innerHTML = `
    .tts-wave-bar { 
      display: flex !important;
      align-items: flex-end !important;
      height: 48px !important;
      gap: 10px !important;
      padding: 0 8px !important;
      background: transparent !important;
      position: relative !important;
      z-index: 10 !important;
    }
    .tts-wave-bar-segment {
      width: 12px !important;
      border-radius: 12px !important;
      box-shadow: 0 2px 18px 0 rgba(0,255,100,0.18) !important;
      animation: ttsWaveBarAnim 1.1s infinite cubic-bezier(.4,0,.2,1) !important;
      margin: 0 4px !important;
      min-height: 16px !important;
      max-height: 48px !important;
      background-clip: padding-box !important;
      background: linear-gradient(180deg, #00ff99 0%, #00c46b 100%) !important;
    }
    .tts-wave-bar-segment-0 { animation-delay: 0s !important; }
    .tts-wave-bar-segment-1 { animation-delay: 0.13s !important; }
    .tts-wave-bar-segment-2 { animation-delay: 0.32s !important; }
    .tts-wave-bar-segment-3 { animation-delay: 0.21s !important; }
    .tts-wave-bar-segment-4 { animation-delay: 0.08s !important; }
    .tts-wave-bar-segment-5 { animation-delay: 0.27s !important; }
    .tts-wave-bar-segment-6 { animation-delay: 0.16s !important; }
    .tts-wave-bar-segment-7 { animation-delay: 0.05s !important; }
    .tts-wave-bar-segment-8 { animation-delay: 0.19s !important; }
    .tts-wave-bar-segment-9 { animation-delay: 0.29s !important; }
    .tts-wave-bar-segment-10 { animation-delay: 0.11s !important; }
    .tts-wave-bar-segment-11 { animation-delay: 0.25s !important; }
    .tts-wave-bar-segment-12 { animation-delay: 0.36s !important; }
    .tts-wave-bar-segment-13 { animation-delay: 0.14s !important; }
    .tts-wave-bar-segment-14 { animation-delay: 0.22s !important; }
    
    @keyframes ttsWaveBarAnim {
      0% { height: 12px; }
      20% { height: 28px; }
      40% { height: 18px; }
      60% { height: 24px; }
      80% { height: 14px; }
      100% { height: 12px; }
    }
  `;
  document.head.appendChild(style);
}

// Speech parameters
const SPEECH_PARAMS = {
  totalDuration: 10000 // 10 seconds max animation duration
};

// Speech mode names and descriptions
const MODES_INFO = {
  news: {
    description: 'Professional, formal tone',
    rate: 1.1,
  },
  podcast: {
    description: 'Conversational, relaxed style',
    rate: 0.95,
  },
  vlogging: {
    description: 'Energetic, expressive delivery',
    rate: 1.15
  }
};

// Mode options for selection
const MODES = [
  { label: 'News', value: 'news' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Vlog', value: 'vlogging' },
];

// Voice options for selection
const VOICES = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

function App() {
  // State variables
  const [text, setText] = useState('Welcome to this text-to-speech demo. Try typing your own text and see the avatar speak!');
  const [mode, setMode] = useState('news');
  const [voice, setVoice] = useState('male');
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  
  // Animation states
  const [mouthOpen, setMouthOpen] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const words = text.trim().split(/\\s+/);
  
  // Pause and resume handlers
  const handlePause = () => {
    if (window.speechSynthesis && speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };
  const handleResume = () => {
    if (window.speechSynthesis && speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  // Handle speech generation with actual voice using Web Speech API
  const handleGenerateSpeech = () => {
    if (!text.trim()) return;
    if (speaking) {
      // Stop if already speaking
      handleStop();
      return;
    }
    setPaused(false);
    
    // Make sure any previous speech is fully cancelled
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Small delay to ensure speech synthesis is ready
    setTimeout(() => {
      // Start the animation
      setSpeaking(true);
      animateAvatar();
      
      try {
        // Create the speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice based on selection (male/female)
        // Calculate base pitch depending on voice gender
        const basePitch = voice === 'male' ? 0.8 : 1.2; // Lower for male, higher for female
        
        // Use mode settings from MODES_INFO
        if (MODES_INFO[mode]) {
          // Set rate from our configuration
          utterance.rate = MODES_INFO[mode].rate;
          
          // Add custom text based on mode
          let finalText = text;
          
          // Add mode-specific text modifications and pitch adjustments
          switch(mode) {
            case 'news':
              // NEWS MODE: Professional, formal tone
              utterance.pitch = basePitch - 0.1; // Lower pitch sounds more authoritative
              
              // Add news intro for longer text
              if (text.length > 20 && !text.startsWith("Breaking news.")) {
                finalText = "Breaking news. " + text;
              }
              
              console.log('Using Professional News voice style');
              break;
              
            case 'podcast':
              // PODCAST MODE: Conversational, relaxed style
              utterance.pitch = basePitch + 0.15; // Higher pitch for entertainment value
              
              // Add podcast intro for longer text
              if (text.length > 20 && !text.startsWith("Hey folks!")) {
                finalText = "Hey folks! Welcome to the show. " + text;
              }
              
              console.log('Using Entertaining Podcast voice style');
              break;
              
            case 'vlogging':
              // VLOGGING MODE: Energetic, expressive delivery
              utterance.pitch = basePitch + 0.25; // Much higher pitch for excitement
              
              // Add vlogger intro for longer text
              if (text.length > 20 && !text.startsWith("What's up guys!")) {
                finalText = "What's up guys! Don't forget to like and subscribe! " + text;
              }
              
              console.log('Using Friendly Vlogging voice style');
              break;
              
            default:
              utterance.pitch = basePitch;
          }
          
          // Set the final text with any added intros
          utterance.text = finalText;
        } else {
          // Default settings if mode not found
          utterance.rate = 1.0;
          utterance.pitch = basePitch;
        }
        
        // Set volume to full for all modes
        utterance.volume = 1.0;
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Try to find a good voice match
          let selectedVoice = null;
          
          // First try: specific gender match in English
          selectedVoice = voices.find(v => 
            v.lang.includes('en') && 
            ((voice === 'male' && !v.name.toLowerCase().includes('female')) || 
             (voice === 'female' && v.name.toLowerCase().includes('female')))
          );
          
          // Second try: any English voice
          if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.includes('en'));
          }
          
          // Third try: just use the first voice
          if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
          }
          
          // Set the voice if we found one
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('Using voice:', selectedVoice.name);
          }
        }
        
        // Handle speech end
        utterance.onend = () => {
          console.log('Speech completed successfully');
          handleStop();
        };
        
        // Handle speech errors - but ignore 'interrupted' errors
        utterance.onerror = (event) => {
          if (event.error !== 'interrupted') {
            console.error('Speech synthesis error:', event.error);
            alert('Speech synthesis failed. Try again or use a different browser.');
          }
          handleStop();
        };
        
        // Start speaking
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis failed:', err);
        handleStop();
        alert('Your browser may not support speech synthesis. Try Chrome or Edge.');
      }
    }, 100); // Small delay to ensure clean speech start
  };
  
  // Animate the avatar's mouth and words with the new avatar frames
  const animateAvatar = () => {
    let startTime = null;
    let wordDuration = SPEECH_PARAMS.totalDuration / words.length;
    let currentWord = -1;
    
    // Animation function
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate animation progress (0 to 1)
      const progress = Math.min(elapsed / SPEECH_PARAMS.totalDuration, 1);
      
      // Calculate mouth openness (0 to 100%)
      // Use a sine wave to simulate natural speech rhythm
      const mouthValue = Math.abs(Math.sin(elapsed / 100) * 100);
      setMouthOpen(mouthValue);
      
      // Determine which word to highlight based on elapsed time
      const wordIndex = Math.min(Math.floor(elapsed / wordDuration), words.length - 1);
      
      // Only update current word when it changes
      if (wordIndex !== currentWord) {
        currentWord = wordIndex;
        setCurrentWordIdx(wordIndex);
      }
      
      // Continue animation if still speaking
      if (progress < 1 && speaking) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Stop if complete
        if (progress >= 1) {
          handleStop();
        }
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Stop speech and animation
  const handleStop = () => {
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPaused(false);
    // Reset state
    setSpeaking(false);
    setMouthOpen(0);
    setCurrentWordIdx(-1);
    // Cancel animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      // Cancel any animation frames
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // New layout with controls on left and avatar on right - using full screen width
  return (
    <div className="App" style={{ background: 'linear-gradient(135deg, #23252b 60%, #2b3140 100%)', minHeight: '100vh', width: '100vw', maxWidth: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Container fluid className="p-0">
        <Row className="m-0">
          <Col xs={12} className="p-2 bg-primary text-white">
            <h1 className="text-center">3D Avatar Text-to-Speech</h1>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-center" style={{ height: '90vh', margin: 0 }}>
          {/* Avatar on the left */}
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-center avatar-panel-bg" style={{ height: '80vh', zIndex: 1, boxShadow: '0 8px 40px 0 rgba(93,158,255,0.18)', background: 'rgba(30,34,48,0.7)', borderRadius: '2rem', marginLeft: '0' }}>
            <div className="premium-avatar-wrapper" style={{ width: '90%', height: '90%', boxShadow: '0 4px 32px 0 rgba(93,158,255,0.10)', borderRadius: '2rem', overflow: 'hidden', background: 'rgba(30,34,48,0.7)', backdropFilter: 'blur(10px)' }}>
              <Simple3DAvatar
                mode={mode}
                voice={voice}
                speaking={speaking && !paused}
                paused={paused}
                mouthOpen={mouthOpen}
                resetVideo={!speaking && !paused}
              />
            </div>
          </Col>
          {/* Controls on the right */}
          <Col xs={12} md={6} className="d-flex flex-column align-items-center justify-content-center" style={{ height: '80vh', zIndex: 2 }}>
            <Card className="shadow-lg p-4 mb-4 premium-glass" style={{ borderRadius: '2rem', background: 'rgba(36,38,54,0.85)', boxShadow: '0 8px 40px 0 rgba(93,158,255,0.20)', backdropFilter: 'blur(10px)', border: '1.5px solid #23252b', width: '90%' }}>
              <h2 className="mb-4" style={{ fontWeight: 700, letterSpacing: 1, color: '#5D9EFF', textShadow: '0 2px 8px rgba(93,158,255,0.10)' }}>Text-to-Speech Controls</h2>
              {/* Mode selection buttons */}
              <div className="mb-3 d-flex gap-2 justify-content-center">
                {MODES.map(opt => (
                  <Button
                    key={opt.value}
                    variant={mode === opt.value ? 'primary' : 'outline-primary'}
                    style={{
                      fontWeight: 600,
                      borderRadius: 10,
                      background: mode === opt.value ? 'linear-gradient(90deg, #5D9EFF 0%, #4A7BFF 100%)' : 'transparent',
                      color: mode === opt.value ? '#fff' : '#5D9EFF',
                      border: '1.5px solid #5D9EFF',
                      boxShadow: mode === opt.value ? '0 2px 12px 0 rgba(93,158,255,0.15)' : 'none',
                      letterSpacing: 1
                    }}
                    onClick={() => setMode(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
              {/* Mode info */}
              <div className="mb-2 text-center" style={{ color: '#9bbcff', fontWeight: 500, fontSize: '1.05rem', minHeight: 22 }}>
                {MODES_INFO[mode]?.description}
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#9bbcff', fontWeight: 500, fontSize: '1.1rem' }}>Enter Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{ fontSize: '1.1rem', background: 'rgba(24,26,32,0.95)', color: '#F3F6F9', border: '1.5px solid #5D9EFF', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(93,158,255,0.08)', resize: 'none' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3 d-flex gap-2">
                  {/* Mode selection dropdown replaced by buttons above */}
                  {/* Voice selection as two buttons */}
                  <div className="d-flex gap-2 w-100 justify-content-center">
                    <Button
                      variant={voice === 'male' ? 'primary' : 'outline-primary'}
                      style={{
                        fontWeight: 600,
                        borderRadius: 10,
                        background: voice === 'male' ? 'linear-gradient(90deg, #5D9EFF 0%, #4A7BFF 100%)' : 'transparent',
                        color: voice === 'male' ? '#fff' : '#5D9EFF',
                        border: '1.5px solid #5D9EFF',
                        boxShadow: voice === 'male' ? '0 2px 12px 0 rgba(93,158,255,0.15)' : 'none',
                        letterSpacing: 1,
                        minWidth: 90
                      }}
                      onClick={() => setVoice('male')}
                    >
                      Male
                    </Button>
                    <Button
                      variant={voice === 'female' ? 'primary' : 'outline-primary'}
                      style={{
                        fontWeight: 600,
                        borderRadius: 10,
                        background: voice === 'female' ? 'linear-gradient(90deg, #5D9EFF 0%, #4A7BFF 100%)' : 'transparent',
                        color: voice === 'female' ? '#fff' : '#5D9EFF',
                        border: '1.5px solid #5D9EFF',
                        boxShadow: voice === 'female' ? '0 2px 12px 0 rgba(93,158,255,0.15)' : 'none',
                        letterSpacing: 1,
                        minWidth: 90
                      }}
                      onClick={() => setVoice('female')}
                    >
                      Female
                    </Button>
                  </div>
                </Form.Group>
                {/* Animated wave effect above buttons */}
                {speaking && (
                  <div className="tts-wave-bar-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 20 }}>

                    <div className="tts-wave-bar" style={{ position: 'relative', zIndex: 2 }}>
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className={`tts-wave-bar-segment tts-wave-bar-segment-${i}`} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="d-flex gap-2 mb-3">
                  <Button className="flex-fill premium-btn" style={{ background: 'linear-gradient(90deg, #5D9EFF 0%, #4A7BFF 100%)', borderRadius: 12, fontWeight: 700, fontSize: '1.15rem', letterSpacing: 1 }} onClick={handleGenerateSpeech}>
                    {speaking ? 'Stop' : 'Speak'} 
                  </Button>
                  {speaking && !paused && (
                    <Button className="flex-fill premium-btn" variant="warning" style={{ borderRadius: 12, fontWeight: 700, fontSize: '1.15rem', letterSpacing: 1, background: 'linear-gradient(90deg,#ffe066,#ffb300)' }} onClick={handlePause}>
                      Pause
                    </Button>
                  )}
                  {speaking && paused && (
                    <Button className="flex-fill premium-btn" variant="success" style={{ borderRadius: 12, fontWeight: 700, fontSize: '1.15rem', letterSpacing: 1, background: 'linear-gradient(90deg,#7cffb3,#28d17c)' }} onClick={handleResume}>
                      Resume
                    </Button>
                  )}
                </div>
              </Form>
              {/* Highlighted text during speech */}
              {speaking && (
                <div className="mt-4" style={{ fontSize: '1.1rem', color: '#F3F6F9', fontWeight: 500, wordBreak: 'break-word', textAlign: 'center' }}>
                  {words.map((word, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: idx === currentWordIdx ? 'linear-gradient(90deg,#5D9EFF,#4A7BFF)' : 'none',
                        color: idx === currentWordIdx ? '#fff' : '#F3F6F9',
                        borderRadius: 6,
                        padding: idx === currentWordIdx ? '2px 8px' : '2px 4px',
                        marginRight: 4,
                        fontWeight: idx === currentWordIdx ? 700 : 500,
                        transition: 'all 0.2s',
                        boxShadow: idx === currentWordIdx ? '0 2px 8px 0 rgba(93,158,255,0.15)' : 'none'
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
      {/* We don't actually need an audio element anymore since we're using timers, but we'll keep the ref for backwards compatibility */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
