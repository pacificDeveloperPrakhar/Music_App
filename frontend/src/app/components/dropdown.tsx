'use client'
import { useState } from 'react';
import Link from"next/link"
import { FaMusic, FaUsers, FaFolder } from 'react-icons/fa';
import {Plus,ListPlus} from "lucide-react"
export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: <FaMusic size={20} />,
      title: 'Playlist',
      subtitle: 'Create a playlist with songs or episodes',
    },
    {
      icon: <FaUsers size={20} />,
      title: 'Blend',
      subtitle: 'Combine your friends’ tastes into a playlist',
    },
    {
      icon: <ListPlus />,
      title: 'Add Song',
      subtitle: 'Add new song to the database',
      link:"/?open_add_song=true"
    },
  ];

  return (
    <div className="relative inline-block text-left">
  <button
  onClick={()=>setIsOpen(!isOpen)}
    className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-transform duration-150 cursor-pointer"
    aria-label="Add to Library"
  >
    <Plus strokeWidth={1.5} className={`w-5 h-5 text-gray-700 transition-transform ${isOpen&&"rotate-45"}`} />
  </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 w-64 rounded-xl bg-neutral-900 text-white shadow-xl z-50 overflow-hidden">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-4 hover:bg-neutral-800 transition ${
                index !== menuItems.length - 1 ? 'border-b border-neutral-700' : ''
              }`}
            >
              <div className="bg-neutral-800 rounded-full p-2">{item.icon}</div>
              <Link href={`${item.link}`}>
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
