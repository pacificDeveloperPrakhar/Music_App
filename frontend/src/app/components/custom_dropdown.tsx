'use client'
import { useState } from 'react';
import { FaMusic, FaUsers, FaFolder } from 'react-icons/fa';
import {type LucideIcon } from "lucide-react" 
import clsx from 'clsx';
import "./custom_drop_down.css"
export interface MenuItem {
    img_src: string;
    title: string;
    subtitle: string;
  }
  interface DropdownMenuProps {
    menuItems: MenuItem[];
    DropMenuButton: LucideIcon;
    DropMenuTransform:string|undefined
  }
export default function DropdownMenu({menuItems,DropMenuButton,DropMenuTransform}:DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(DropMenuTransform)

  return (
    <div className="relative inline-block text-left">
  <button
  onClick={()=>setIsOpen(!isOpen)}
    className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-transform duration-150 cursor-pointer"
    aria-label="Add to Library"
  >
    <DropMenuButton strokeWidth={1.5} className={clsx(
  "w-5 h-5 text-gray-700 transition-transform",
  isOpen && DropMenuTransform
)} />
  </button>
      {isOpen && (
        <div className="absolute mt-2 left-1/2 w-64 bg-neutral-900 dropdown text-white shadow-xl z-50 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 ">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-start   hover:bg-neutral-800 transition ${
                index !== menuItems.length - 1 ? 'border-b border-neutral-700' : ''
              }`}
            >
              <div className="bg-neutral-800 w-12 h-12  m-0 rounded-full overflow-hidden flex justify-center items-center m-1">
              <img
  src={item.img_src}
  alt=""
  className="object-center   "
/>
              </div>
              <div className='mx-3 my-auto'>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
