import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function AppLayout({children}:{children: React.ReactNode}) {
  return (
    <div className='flex h-svh p-2 gap-3'>
        <Sidebar/>
        <main className='flex-1 p-2'>{children}</main>
    </div>
  )
}
