import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loader() {
  return (
    <div className='fixed bg-background z-20 flex gap-2 inset-0 items-center justify-center'>
        <Loader2 className='animate-spin'/>
        <p>Loading...</p>
    </div>
  )
}
