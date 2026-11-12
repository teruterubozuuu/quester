import { PxlKitIcon } from '@pxlkit/core'
import { Clock } from '@pxlkit/ui'
import { PixelCard } from '@pxlkit/ui-kit'
import React from 'react'

export default function ProfileActivities() {
  return (
   <PixelCard title='Recent Activity'  icon={<PxlKitIcon icon={Clock} size={20}/>}>
    <p>No activities</p>
   </PixelCard>
  )
}
