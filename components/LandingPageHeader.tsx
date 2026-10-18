import React from 'react'
import logo from "../public/quester-logo.png"
import Image from 'next/image'
import Link from 'next/link'
import { PixelButton } from '@pxlkit/ui-kit'

export default function LandingPageHeader() {
  return (
    <header className='flex justify-between p-3'>
        <div className='flex gap-3 items-center'>
            <Image
                src={logo}
                alt="Logo"
                className='w-10 rounded-md'
            />
            <h1 className='font-pixel font-bold text-2xl uppercase'>Quester</h1>
        </div>
        <nav className='flex items-center gap-5 font-mono font-medium'>
          <Link href="#">Home</Link>
          <Link href="#">Features</Link>
          <Link href="#">The Developer</Link>
          <PixelButton tone="red" className='cursor-pointer' asChild>
            <Link href="/sign-in">Sign In</Link>
          </PixelButton>
        </nav>
    </header>
  )
}
