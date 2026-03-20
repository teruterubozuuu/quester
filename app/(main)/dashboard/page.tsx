"use client";
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function HomePage() {
  return (
    <div>
      <p>Home</p>
      <Button onClick={()=> signOut({callbackUrl: "/"})}>Sign Out</Button>
    </div>
  )
}
