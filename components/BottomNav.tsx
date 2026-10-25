import { navLinks, sections } from '@/utils/sidebar-constants';
import { PxlKitIcon } from '@pxlkit/core';
import { PixelBox, PixelNavigationMenu } from '@pxlkit/ui-kit'
import Link from 'next/link';
import React from 'react'

export default function BottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-13 border-t border-retro-muted/30 bg-retro-bg md:hidden">
      <nav className="flex h-full items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navLinks.map((nav)=>(
          <Link
            href={nav.href}
            key={nav.id}
          >
            <span>{nav.icon}</span>
          </Link>
        ))
        }
      </nav>
    </div>
  );
}