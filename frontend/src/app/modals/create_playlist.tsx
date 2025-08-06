'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./create_playlist_modal.css"
export default function CreatePlaylist() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById('music_body');
    setContainer(el);
  }, []);

  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="absolute inset-0  backdrop-blur-sm   z-50 flex items-center justify-center create_playlist_modal">
      <div className="bg-white p-8 rounded shadow-lg text-black text-2xl">
        hello
      </div>
    </div>,
    container
  );
}
