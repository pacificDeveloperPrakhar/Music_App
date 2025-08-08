'use client'
import React,{useEffect, useState} from 'react'
import ReactDOM from "react-dom"
import UploadAudio from "../components/upload_audio"
import DropdownMenu from '../components/custom_dropdown'
import EditImage from '../components/editImage'
import {MoveUp,FileAudio2}from "lucide-react"
import { title } from 'process'
export const dummyMenuItems= [
  {
    img_src: 'data:image/jpeg;base64,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',
    title: 'Profile',
    subtitle: 'View and edit your profile',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=B',
    title: 'Settings',
    subtitle: 'Customize your experience',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=C',
    title: 'Notifications',
    subtitle: 'View recent alerts',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=D',
    title: 'Logout',
    subtitle: 'Sign out of your account',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=D',
    title: 'Logout',
    subtitle: 'Sign out of your account',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=D',
    title: 'Logout',
    subtitle: 'Sign out of your account',
  },
  {
    img_src: 'https://via.placeholder.com/40x40.png?text=D',
    title: 'Logout',
    subtitle: 'Sign out of your account',
  },
];
const dummyBitrate=[{
  title:" 190kbps",
  subtitle:"bitrate upto 190 kbps"
}]
export default function add_new_song() {
  const [element,setElement]=useState<HTMLElement|null>(null)
  const [coverImg,setCoverImg]=useState<File|null>(null)
  useEffect(function(){
    setElement(document.getElementById("music_body"))

  },[])
  if(!element)
    return null

  return (
    ReactDOM.createPortal(
        <div className="absolute inset-0 z-50 bg-amber-100/30 backdrop-blur-md">
        <section className='absolute top-10 left-10 right-10  text-white bg-gray-400'>

        <section className=" rounded-md shadow-2xl  p-6 flex items-center space-x-6 ">

           <EditImage imageSrc={coverImg} setImageSrc={setCoverImg}/>
      

          <div className="flex flex-col justify-center">
            <p className="uppercase text-sm font-semibold text-gray-600 mb-1">Public Playlist</p>
            <h1 className="text-5xl font-extrabold  mb-2">My Song #2</h1>
            <p className="text-gray-700 font-medium">Prakhar Vishwakarma</p>
          </div>
        </section>
        <section>
          <input type="file" />
        </section>
        <section className='flex'>
         <div className='flex-1'>
          <DropdownMenu menuItems={dummyMenuItems} DropMenuButton={MoveUp } DropMenuTransform={'rotate-180'}/>
         </div>
         <div className='flex-1'>
          <DropdownMenu menuItems={dummyBitrate} DropMenuButton={FileAudio2 }/>
         </div>
         <div className='flex-1 bg-green-200'>
          <UploadAudio/>
         </div>
         <select className="p-2 border rounded" onChange={(e) => console.log(e.target.value)}>
  <option value="">Select an option</option>
  <option value="rock">Rock</option>
  <option value="pop">Pop</option>
  <option value="jazz">Jazz</option>
</select>
        </section>
        </section>
      
      </div>
      
        ,element
        
    )
  )
}
