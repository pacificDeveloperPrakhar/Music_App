// components/HLSAudioPlayer.tsx
'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSAudioPlayerProps {
  src: string;
}

const HLSAudioPlayer: React.FC<HLSAudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && audioRef.current) {
        const hls = new Hls({
            maxBufferLength: 10,        // Target 10 seconds of buffer
            maxMaxBufferLength: 20,     // Hard limit of 20 seconds
            maxBufferSize: 640000,      // ~400 KB buffer size
          });
          
      hls.startLevel = 0; // index in the manifest (0 = lowest = 64k)

      hls.loadSource(src);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audioRef.current?.play().catch((err) => console.error(err));
      });

      return () => {
        hls.destroy();
      };
    } else if (audioRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      audioRef.current.src = src;
      audioRef.current.play().catch((err) => console.error(err));
    }
  }, [src]);

  return <audio ref={audioRef} controls />;
};

export default HLSAudioPlayer;
