import React from 'react'
import logo from "../public/quester-logo.png"
import Image from 'next/image';

export default function TopNav() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-14 border-b border-retro-muted/30 bg-retro-bg md:hidden">
      <header className="flex gap-2 h-full  items-center px-2">
        <Image src={logo} alt="Logo" className='w-10 rounded-md'/>
        <div className='flex flex-col'>
        <h1 className="font-pixel uppercase text-sm">Quester</h1>
        <span className="text-[10px] opacity-60 font-mono">
                Game Backlogs Tracker
              </span>
        </div>      
        </header>
    </div>
  );
}