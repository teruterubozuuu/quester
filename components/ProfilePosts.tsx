import React from 'react'
import ProfileHeader from './ProfileHeader'
import { PixelButton, PixelCard, PixelEmptyState, PixelSectionHeader } from '@pxlkit/ui-kit'
import { PxlKitIcon } from '@pxlkit/core'
import { MessageSquare } from '@pxlkit/feedback'

export default function ProfilePosts() {
  return (
    <div className='flex  flex-col gap-3'>
      <PixelCard>
        <PixelButton className='w-full flex justify-start rounded-full cursor-pointer' tone='neutral'>+ Create Post</PixelButton>
      </PixelCard>

      <PixelEmptyState
      icon={<PxlKitIcon icon={MessageSquare}/>}
        title="No Posts"
        description="Create a post to begin."
        action={
          <PixelButton size="sm" tone="green" variant='solid' className='cursor-pointer'>
            + Create Post
          </PixelButton>
        }
        />
    </div>
  )
}
