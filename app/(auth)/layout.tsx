import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({children} : {children:React.ReactNode}) {
  return (
    <div>
        <nav className='p-4 border-b'>
            <Link href="/"><ArrowLeft></ArrowLeft></Link>
        </nav>
        <main className='flex justify-center pt-20'>{children}</main>
    </div>
  )
}
