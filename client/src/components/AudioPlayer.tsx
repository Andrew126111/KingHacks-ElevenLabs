import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ textToSpeak, autoPlay = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!synthRef.current || !textToSpeak) return;

    // Cancel any existing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    // Try to pick a decent voice (prefer google/microsoft native ones if available)
    const voices = synthRef.current.getVoices();
    // Prefer a male voice for "ClauseCast" gravitas if available, or just the first one
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Daniel"));
    if (preferredVoice) utterance.voice = preferredVoice;

    if (autoPlay) {
      // Small delay to ensure UI renders first
      setTimeout(() => {
        synthRef.current?.speak(utterance);
      }, 500);
    }

    return () => {
      synthRef.current?.cancel();
    };
  }, [textToSpeak, autoPlay]);

  const handlePlayPause = () => {
    if (!synthRef.current || !utteranceRef.current) return;

    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
    } else if (synthRef.current.speaking) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      synthRef.current.speak(utteranceRef.current);
    }
  };

  const handleReplay = () => {
    if (!synthRef.current || !utteranceRef.current) return;
    synthRef.current.cancel();
    synthRef.current.speak(utteranceRef.current);
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 w-full sm:w-auto">
      <div className="p-2 bg-primary/10 rounded-full text-primary">
        <Volume2 size={20} />
      </div>
      
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          Audio Explanation
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePlayPause}
            className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
          >
            {isPlaying ? (
              <><Pause size={14} /> Pause</>
            ) : (
              <><Play size={14} /> Play</>
            )}
          </button>
          
          <span className="text-border">|</span>
          
          <button 
            onClick={handleReplay}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <RotateCcw size={14} /> Replay
          </button>
        </div>
      </div>
      
      {isPlaying && (
        <div className="flex gap-1 h-4 items-end">
          <div className="w-1 bg-primary/60 animate-[pulse_1s_ease-in-out_infinite] h-2"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.5s_ease-in-out_infinite_0.1s] h-3"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-4"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.3s_ease-in-out_infinite_0.3s] h-2"></div>
        </div>
      )}
    </div>
  );
}
