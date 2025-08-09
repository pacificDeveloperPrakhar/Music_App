import React, { useState } from 'react';

export default function MusicUploadPreview({music,setMusic}) {

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setMusic(file);
      console.log(URL.createObjectURL(file))
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  return (
    <section className="p-4 space-y-4 bg-gray-100 rounded-lg shadow">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium">Preview:</p>
          <audio controls src={previewUrl} className="w-full mt-2" />
        </div>
      )}
    </section>
  );
}
