"use client";
import React, { useState, useEffect, useRef } from "react";
import { Music, Pencil, X } from "lucide-react";
import "./EditImage.css";

export default function EditImage({setImageSrc,imageSrc}) {
  const [showModal, setShowModal] = useState(false);
  const pasteBoxRef = useRef(null);

  // Handle paste events
  useEffect(() => {
    if (!showModal) return;

    const handlePaste = (event) => {
      // First, check if clipboard contains text
      const text = event.clipboardData?.getData("text");
      if (text && /^https?:\/\//.test(text)) {
        setImageSrc(text); // original URL
        setShowModal(false);
        return;
      }
    
      // Otherwise, handle image file
const items = event.clipboardData?.items;
if (items) {
  for (let item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();

      if (file) {
        // Store the File object so you can upload it later


        // If you want a preview in the UI
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result); // Base64 preview
        };
        reader.readAsDataURL(file);

        // Close modal
        setShowModal(false);
      }
    }
  }
}

    };
    
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);

    if (pasteBoxRef.current) {
      pasteBoxRef.current.focus();
    }

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  return (
    <>

      <div className="relative w-40 h-40 bg-gray-200 flex items-center justify-center drop-shadow-2xl shadow-blue-500 group overflow-hidden">
        {imageSrc&&<img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />}
        {!imageSrc&&<Music size={48}/>}

        <span
          onClick={() => setShowModal(true)}
          className="absolute inset-0 bg-transparent flex justify-center items-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
        >
          <Pencil className="text-gray-400" size={48} />
        </span>
      </div>

      {showModal && (
        <div
          className="fixed inset-0   flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false); 
            }
          }}
        >
          <div
            className="bg-black backdrop-blur-lg p-4  shadow-lg w-80 text-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Paste an Image</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div
              ref={pasteBoxRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 outline-none"
            >
              Click or focus here, then paste your image.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
