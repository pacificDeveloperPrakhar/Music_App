"use client";
import { NextPage } from 'next';
import { useRef, useEffect, useState } from "react";
import AudioPlayBack from "../components/audio_playback"
interface Props {}

const Playbox: NextPage<Props> = ({}) => {
  const ctx = useRef(new AudioContext());
  const flag = useRef(false);
  const gainNode = useRef(ctx.current.createGain());
  const bassFilter = useRef(ctx.current.createBiquadFilter());
  const [volume, setVolume] = useState(1);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Configure bass filter
    bassFilter.current.type = "lowshelf";
    bassFilter.current.frequency.setValueAtTime(200, ctx.current.currentTime); // Frequencies below 200Hz
    bassFilter.current.gain.setValueAtTime(105, ctx.current.currentTime); // Boost bass by 15dB

    // Chain: bassFilter → gainNode → destination
    bassFilter.current.connect(gainNode.current);
    gainNode.current.connect(ctx.current.destination);
  }, []);

  return (
    <div>
      <button
        data-playing="false"
        role="switch"
        aria-checked="false"
        onClick={() => {
          if (!flag.current) {
            console.log("music on");
            const oscillator = ctx.current.createOscillator();
            oscillator.type = "sawtooth";
            oscillator.connect(bassFilter.current); // Connect to bass filter
            oscillator.start();
            oscillatorRef.current = oscillator;
          } else {
            oscillatorRef.current?.stop();
            oscillatorRef.current = null;
          }
          flag.current = !flag.current;
        }}
      >
        <span>Play/Pause</span>
      </button>

      <button
        onClick={() => {
          gainNode.current.gain.setValueAtTime(0.1, ctx.current.currentTime);
          setVolume(3);
        }}
      >
        volume {`${volume}`}
      </button>
      <AudioPlayBack src={"./audios/master.m3u8"}/>
    </div>
  );
};

export default Playbox;
