import React from 'react'
import { AlignJustify } from 'lucide-react'
export default function PlaylistViewSection() {
  return (
    <section>
<section className="px-4 py-2">
  <div className="flex items-center justify-between gap-2">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search playlist"
      className="w-full max-w-xs px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />

    {/* Recents + Icon */}
    <span className="flex items-center gap-1 cursor-pointer text-sm text-gray-700 hover:text-purple-600 transition-colors">
      <span>Recents</span>
      <AlignJustify strokeWidth={2.5} className="w-4 h-4" />
    </span>
  </div>
</section>

    </section>
  )
}
