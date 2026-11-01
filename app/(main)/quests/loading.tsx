"use client"
import { AnimatedPxlKitIcon } from '@pxlkit/core'
import { LoadingCircle } from '@pxlkit/feedback'
import React from 'react'

export default function loading() {
  return (
    <div className='flex justify-center items-center h-svh'>
       <p className='font-pixel'> <AnimatedPxlKitIcon icon={LoadingCircle}/> Loading...</p>
    </div>
  )
}
