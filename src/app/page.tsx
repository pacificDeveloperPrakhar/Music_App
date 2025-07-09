"use client"

import Image from "next/image";
import {useEffect,useRef} from "react";
import { arrayBuffer } from "stream/consumers";
export default function Home() {

const audio:any= useRef(null);
const ctx=useRef(new AudioContext());

useEffect(()=>{
  fetch("./audios/aud1.mp3").then((data)=>{
    return data.arrayBuffer()
  }).then((dataBuffer)=>{
     return ctx.current.decodeAudioData(dataBuffer)
  }).then(data=>{
    audio.current=data;  
  }).catch(err=>{
    console.log("unable to fetch the file")
  })
},[])  
  return (
    <>
    <div>
      music player 
      <button type="button" onClick={(e)=>{
        console.log("button clicked")
        console.log(ctx.current.currentTime)
       const playBuffer=ctx.current.createBufferSource();
       playBuffer.buffer=audio.current;
       playBuffer.connect(ctx.current.destination)
       playBuffer.start(ctx.current.currentTime)
      }}>play song</button>
      </div></>
  );
}
