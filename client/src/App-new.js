import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';

// Import the 3D Avatar component with reliable models
import Simple3DAvatar from './components/Simple3DAvatar';

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
  
  // Animation states
  const [mouthOpen, setMouthOpen] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const words = text.trim().split(/\\s+/);
  
  // Handle speech generation with actual voice using Web Speech API
  const handleGenerateSpeech = () => {
    if (!text.trim()) return;
    if (speaking) {
      // Stop if already speaking
      handleStop();
      return;
    }
    
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
    let lastWordTime = 0;
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
  
  // New layout with controls on left and avatar on right
  return (
    <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center text-primary">3D Avatar Text-to-Speech</h1>
          </Col>
        </Row>
        
        <Row>
          {/* Left side: Controls */}
          <Col xs={12} md={5} className="mb-4">
            <Card className="shadow-lg h-100">
              <Card.Header className="bg-primary text-white">
                <h3>Text & Controls</h3>
              </Card.Header>
              <Card.Body>
                <Form>
                  {/* Text input */}
                  <Form.Group className="mb-4">
                    <Form.Label><strong>Enter Text</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your text here..."
                      className="mb-3"
                    />
                  </Form.Group>
                  
                  {/* Mode selection */}
                  <Form.Group className="mb-4">
                    <Form.Label><strong>Select Mode</strong></Form.Label>
                    <div className="d-flex gap-2">
                      {MODES.map(modeOption => (
                        <Button 
                          key={modeOption.value} 
                          variant={mode === modeOption.value ? 'primary' : 'outline-primary'}
                          onClick={() => setMode(modeOption.value)}
                          className="flex-grow-1"
                        >
                          {modeOption.label}
                        </Button>
                      ))}
                    </div>
                    <small className="text-muted mt-1 d-block">
                      {MODES_INFO[mode]?.description}
                    </small>
                  </Form.Group>
                  
                  {/* Voice selection */}
                  <Form.Group className="mb-4">
                    <Form.Label><strong>Select Voice</strong></Form.Label>
                    <div className="d-flex gap-2">
                      {VOICES.map(voiceOption => (
                        <Button 
                          key={voiceOption.value} 
                          variant={voice === voiceOption.value ? 'primary' : 'outline-primary'}
                          onClick={() => setVoice(voiceOption.value)}
                          className="flex-grow-1"
                        >
                          {voiceOption.label}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                  
                  {/* Generate button */}
                  <div className="d-grid mb-4">
                    <Button 
                      variant={speaking ? "danger" : "primary"} 
                      size="lg" 
                      onClick={handleGenerateSpeech}
                      className="py-3"
                    >
                      {speaking ? 'Stop Speaking' : 'Generate Speech'}
                    </Button>
                  </div>
                  
                  {/* Word highlighting during speech */}
                  {speaking && (
                    <div className="p-3 border rounded bg-light">
                      <p className="mb-2 fw-bold">Currently Speaking:</p>
                      <div>
                        {words.map((word, idx) => (
                          <span key={idx} style={{
                            background: idx === currentWordIdx ? 'linear-gradient(90deg,#5D9EFF,#4A7BFF)' : 'none',
                            color: idx === currentWordIdx ? '#fff' : '#333',
                            borderRadius: 4,
                            padding: idx === currentWordIdx ? '2px 6px' : '2px 3px',
                            marginRight: 5,
                            fontWeight: idx === currentWordIdx ? 700 : 400,
                            transition: 'all 0.2s'
                          }}>
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right side: 3D Avatar */}
          <Col xs={12} md={7}>
            <Card className="shadow-lg h-100" style={{ minHeight: '600px' }}>
              <Card.Header className="bg-dark text-white d-flex justify-content-between">
                <h3>3D Animated Avatar</h3>
                <div>
                  <span className="badge bg-primary me-2">{MODES.find(m => m.value === mode)?.label} Mode</span>
                  <span className="badge bg-secondary">{VOICES.find(v => v.value === voice)?.label} Voice</span>
                </div>
              </Card.Header>
              <Card.Body className="p-0" style={{ height: '600px' }}>
                <Simple3DAvatar 
                  mode={mode} 
                  voice={voice} 
                  speaking={speaking} 
                  mouthOpen={mouthOpen}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* We don't actually need an audio element anymore since we're using timers */}
      {/* But we'll keep the ref for backwards compatibility */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
