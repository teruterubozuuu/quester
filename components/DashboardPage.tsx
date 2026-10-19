"use client";
import { supabase } from '@/utils/supabase/client'
import { PixelButton } from '@pxlkit/ui-kit'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function DashboardPage() {

  return (
    <div>
       <h1 className='font-pixel text-lg'>Dashboard</h1>
       <h2 className='font-mono text-xs opacity-60'>Track your gaming activity</h2>
    </div>
  )
}
