import React from 'react';
import { Home, Search, Bell, Settings, Download } from 'lucide-react';
import { Button } from '../ui/button';

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-border px-4 py-3 flex items-center justify-between text-gray-300">
      {/* Left side - Logo and Home */}
      <div className="flex items-center gap-4">
        {/* Spotify-like logo */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-black rounded-full relative">
            <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Home button */}
        <Button 
          variant="ghost" 
          size="lg" 
          className="w-10 h-10 bg-muted/20 hover:bg-muted/30 text-white rounded-full"
        >
          <Home className="w-10 h-10" />
        </Button>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="w-full bg-muted/20 border border-muted/30 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
          />
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center gap-2">
        {/* Install App button */}
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-white text-sm font-medium px-4 py-2 h-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-white w-8 h-8"
        >
          <Bell className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-white w-8 h-8"
        >
          <Settings className="w-4 h-4" />
        </Button>

        {/* Profile */}
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center ml-2">
          <span className="text-xs font-bold text-white">P</span>
        </div>
      </div>
    </nav>
  );
}
