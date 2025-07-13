"use client";

import { NextPage } from "next";
import Lyrics_box from "@/app/components/lyrics_box";
import { useEffect, useState } from "react";

interface Colors {
  background: string;
  text: string;
}

interface Line {
  words: string;
  startTimeMs: string;
}

interface Lyrics {
  lines: Line[];
}

interface LyricsData {
  colors: Colors;
  lyrics: Lyrics;
}

const Page: NextPage = () => {
  const [lyrics, setLyrics] = useState<LyricsData | null>(null);

  useEffect(() => {
    fetch("/lyrics/lyrics.json")
      .then((res) => res.json())
      .then((data) => {
        setLyrics(data);
        console.log(data.lyrics.lines);
      })
      .catch((err) => console.error("Error loading lyrics:", err));
  }, []);

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center gap-y-6 py-10">
      <Lyrics_box />
      {lyrics &&
        lyrics.lyrics.lines.map((line, index) => (
          <p
            key={index}
            className="text-4xl font-extrabold flex flex-wrap justify-center bg-gray-100 text-transparent bg-clip-text"
          >
            {line.words.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="mx-2 "
              >
                {word}
              </span>
            ))}
          </p>
        ))}
    </div>
  );
};

export default Page;
