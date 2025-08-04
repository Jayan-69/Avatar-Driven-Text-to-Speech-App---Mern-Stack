import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';

const AudioPlayer = ({ url, playing, onEnded, onVolumeChange, fallbackUrl }) => {
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioContextRef = useRef(null);
  const dataArrayRef = useRef(null);
  const isSourceConnectedRef = useRef(false);
  const [audioError, setAudioError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Main audio setup with Web Audio API
  useEffect(() => {
    if (!audioRef.current || !url) return;
    
    setAudioError(false);
    setAudioLoaded(false);

    try {
      // Setup Web Audio API
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      // Only create MediaElementSourceNode once per audio element
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
        isSourceConnectedRef.current = false;
      }
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
      }
      if (!isSourceConnectedRef.current) {
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
        analyserRef.current.fftSize = 256;
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        isSourceConnectedRef.current = true;
      }

      // Animation loop to get volume
      const tick = () => {
        if (analyserRef.current && audioRef.current && !audioRef.current.paused) {
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
          // Calculate RMS (root mean square) volume
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const val = (dataArrayRef.current[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArrayRef.current.length);
          if (onVolumeChange) onVolumeChange(rms);
        }
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      console.error('Web Audio API error:', err);
      setUsingFallback(true);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLoaded(false);
    };
  }, [url, onVolumeChange]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Audio play error:', error);
            setAudioError(true);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  // Handle audio load events
  const handleCanPlay = () => {
    setAudioLoaded(true);
    setAudioError(false);
  };

  const [usedFallbackUrl, setUsedFallbackUrl] = useState(false);
  
  const handleError = () => {
    setAudioError(true);
    setAudioLoaded(false);
    
    // If we haven't tried the fallback URL yet and it exists, try it
    if (!usedFallbackUrl && fallbackUrl) {
      setUsedFallbackUrl(true);
      console.log('Trying fallback URL:', fallbackUrl);
      // We'll reload the audio with fallback in useEffect when usedFallbackUrl changes
    } else if (!usingFallback) {
      // Try changing the audio approach
      setUsingFallback(true);
    } else {
      console.error('All audio approaches failed');
    }
  };

  // Effect to handle fallback URL when primary fails
  useEffect(() => {
    if (usedFallbackUrl && fallbackUrl && audioRef.current) {
      // Reset the audio element
      audioRef.current.pause();
      // This will trigger the source to change to the fallback URL
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        if (playing) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Fallback audio play error:', error);
              setAudioError(true);
            });
          }
        }
      }
    }
  }, [usedFallbackUrl, fallbackUrl, playing]);

  // Try loading again
  const handleRetry = () => {
    setAudioError(false);
    // Reset fallback state to try primary URL again
    setUsedFallbackUrl(false);
    const audio = audioRef.current;
    if (audio) {
      audio.load();
    }
  };

  return (
    <div className="audio-player">
      {audioError && (
        <div className="text-center mb-3">
          <p className="text-danger">Audio failed to load. The service may be unavailable.</p>
          <Button variant="outline-primary" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}
      <audio
        ref={audioRef}
        controls
        onCanPlay={handleCanPlay}
        onEnded={onEnded}
        onError={handleError}
        style={{
          width: '100%',
          height: 40,
          borderRadius: 8,
          backgroundColor: '#242729',
          color: '#fff',
          opacity: audioLoaded ? 1 : 0.5
        }}
      >
        {url && (
          <>
            <source src={usedFallbackUrl && fallbackUrl ? fallbackUrl : url} type="audio/wav" />
            <source src={usedFallbackUrl && fallbackUrl ? fallbackUrl : url} type="audio/mpeg" />
            <source src={usedFallbackUrl && fallbackUrl ? fallbackUrl : url} />
          </>
        )}
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
