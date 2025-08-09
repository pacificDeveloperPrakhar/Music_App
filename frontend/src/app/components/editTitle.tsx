import React, { useState, useEffect, useRef } from "react";

export default function EditableHeadingModal({ setText, text }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHeading, setTempHeading] = useState(text);
  const modalRef = useRef(null);

  const handleOpen = () => {
    setTempHeading(text);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    setText(tempHeading); 
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setText(tempHeading);
        handleClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setText(tempHeading);
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, tempHeading, setText]);

  return (
    <div className="relative">
      {/* Heading */}
      <h1
        className="text-5xl font-extrabold mb-2 cursor-pointer hover:opacity-80"
        onClick={handleOpen}
      >
        {text}
      </h1>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-black text-white shadow-lg p-4 w-96 rounded-lg"
          >
            <h2 className="text-lg font-semibold mb-3">Edit Heading</h2>
            <textarea
              className="w-full border border-gray-600 bg-gray-800 rounded p-2 outline-none text-white"
              value={tempHeading}
              onChange={(e) => setTempHeading(e.target.value)}
              placeholder="Enter heading..."
              autoFocus
            />
            <button
              onClick={handleApply}
              className="mt-3 px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
