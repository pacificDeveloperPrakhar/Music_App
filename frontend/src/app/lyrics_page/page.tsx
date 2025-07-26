"use client";

import { NextPage } from "next";
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
//so basically we will first get the timestamp and the data of the lyrics and then 
//then timestamp current will be compared to the timestamp of the lines whichever will be just
//greater ,now we will take the prior line to that
//that will be our target line

function useCurrentLine(timestamp:number,data:LyricsData|null){
    const [currentLine,setCurrentLine]=useState<Line|null>(null);
    useEffect(()=>{
     if (!data)
     return
    
     const nextLineIdx=data.lyrics.lines.findIndex((line)=>{
        return Number(line.startTimeMs)>timestamp
     });
     if(nextLineIdx===0)
        setCurrentLine(data.lyrics.lines[0])
    else{
        setCurrentLine(data.lyrics.lines[nextLineIdx-1])
    }
    },[timestamp])
    return currentLine
}
 function Lyrics_box() {
  return (
    <div>
      lyrics box
    </div>
  )
}

//now simulating the audio timestamp sync which will be used to trigger the changes in
// the lyrics box display
const useAudioSync=function(length:number,lyrics:null|LyricsData){
  const [timestamp,setTimestamp]=useState(0)
  
  useEffect(()=>{
  if(!lyrics)
    return
  const interval=setInterval(()=>{
    setTimestamp(currentTime=>{
        if(currentTime>length){
            clearInterval(interval)
            return length
        }
        else 
        return currentTime+500
    })
  },500)  
  },[lyrics])
  return timestamp
}
// the main page layout
const Page: NextPage = () => {
  const [lyrics, setLyrics] = useState<LyricsData | null>(null);
  const timestamp=useAudioSync(1300000,lyrics);
  const currentLine=useCurrentLine(timestamp,lyrics);
  useEffect(() => {
    fetch("/lyrics/lyrics.json")
      .then((res) => res.json())
      .then((data) => {
        setLyrics(data);
      })
      .catch((err) => console.error("Error loading lyrics:", err));
  }, []);

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center gap-y-6 py-10">
      <Lyrics_box />
      {lyrics &&
        lyrics.lyrics.lines.map((line, index) => (
          <p
            key={line.startTimeMs}
            className={`text-4xl font-extrabold flex flex-wrap justify-center bg-gray-100 text-transparent bg-clip-text ${currentLine?.startTimeMs===line.startTimeMs?"bg-purple-600":""} `}
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
