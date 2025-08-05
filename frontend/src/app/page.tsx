// "use client"

// import Image from "next/image";
// import {useEffect,useRef} from "react";
// import { arrayBuffer } from "stream/consumers";
// export default function Home() {

// const audio:any= useRef(null);
// const ctx=useRef(new AudioContext());
// const throttle=useRef(false);
// const oscilator:any=useRef(null);
// useEffect(()=>{
//   fetch("./audios/aud1.mp3").then((data)=>{
//     return data.arrayBuffer()
//   }).then((dataBuffer)=>{
//      return ctx.current.decodeAudioData(dataBuffer)
//   }).then(data=>{
//     audio.current=data;  
//   }).catch(err=>{
//     console.log("unable to fetch the file")
//   })
//   let timeoutId: ReturnType<typeof setTimeout> | null = null;

//   document.addEventListener("keydown", function (event) {
//     if (throttle.current) return;
  
//     const oscillator = ctx.current.createOscillator();
//     oscillator.type = "sine";
//     oscillator.connect(ctx.current.destination);
//     oscillator.start();
  
//     throttle.current = true;
  
//     if (timeoutId) clearTimeout(timeoutId);
  
//     timeoutId = setTimeout(() => {
//       oscillator.stop();
//       throttle.current = false;
//     }, 200);
//   });
  
// },[])  
//   return (
//     <>
//     <div>
//       music player 
//       <button type="button" onClick={(e)=>{
//         console.log("button clicked")
//         console.log(ctx.current.currentTime)
//        const playBuffer=ctx.current.createBufferSource();
//        playBuffer.buffer=audio.current;
//        const analyzer=ctx.current.createAnalyser();
//        playBuffer.connect(analyzer)
//        analyzer.connect(ctx.current.destination);
//        const frequencyData=new Uint8Array(analyzer.frequencyBinCount);
//        const logFrequencies = () => {
//         analyzer.getByteFrequencyData(frequencyData);
//         console.log(frequencyData); // logs array of frequency data
//         requestAnimationFrame(logFrequencies);
//       };
      
//       playBuffer.start(ctx.current.currentTime)
//       logFrequencies();
//       }}>play song</button>
//       <br />
//       <button className="" onClick={()=>{
//         const osc=ctx.current.createOscillator();
//         osc.type="triangle";
//         osc.connect(ctx.current.destination);
//         osc.start()
//       }}>play oscillator</button>
//       </div></>
//   );
// }

import Navbar from "./components/navbar";
const page = () => {
  return (
    <div>
      <Navbar/>
      
    </div>
  );
}



export default page