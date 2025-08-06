import React from 'react'
import { ListCollapse ,Plus,Scaling} from 'lucide-react'
import PlaylistViewSection from './PlaylistViewSection'
export default function Playlist() {
  return (
    <section className="min-h-full flex-col  flex-1/4  bg-amber-600">
<div className="flex items-center justify-between px-4 py-2">
<h1 className="flex items-center gap-2 font-extrabold text-lg text-gray-900">
  <ListCollapse strokeWidth={2.5} className="w-5 h-5 text-gray-800" />
  <span>Your Library</span>
</h1>

  {/* artist and playlist tab */}
  {/* ================================================================================================================= */}
  <div className="flex items-center space-x-2">
  <button
    className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-transform duration-150 cursor-pointer"
    aria-label="Add to Library"
  >
    <Plus strokeWidth={1.5} className="w-5 h-5 text-gray-700" />
  </button>
  <button
    className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-transform duration-150 cursor-pointer"
    aria-label="View Options"
  >
    <Scaling strokeWidth={1.5} className="w-5 h-5 text-gray-700" />
  </button>
</div>
{/* ================================================================================================= */}

</div>
  {/* now type of playlist like playlist artist  */}
  <div className="flex space-x-2 text-white">
  <span className="px-3 py-1 rounded-2xl bg-gray-600 hover:bg-gray-500 cursor-pointer transition-colors">
    Artist
  </span>
  <span className="px-3 py-1 rounded-2xl bg-gray-600 hover:bg-gray-500 cursor-pointer transition-colors">
    Playlist
  </span>
</div>

  {/* now the playlist and artist preview section */}
  <PlaylistViewSection/>
   </section>
  )
}
