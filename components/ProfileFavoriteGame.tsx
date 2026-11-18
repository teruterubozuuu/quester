"use client";
import { PxlKitIcon } from '@pxlkit/core'
import { Star } from '@pxlkit/gamification'
import { PixelButton, PixelCard, useToast } from '@pxlkit/ui-kit'
import { SubmitEvent, useEffect, useState } from 'react'
import { GameDetails } from '@/utils/types/quest-page';
import { FavoriteGame } from '@/utils/types/profile-page';
import ProfileFavoritePopover from './ProfileFavoritePopover';
import Image from 'next/image';
import FavoriteGameModal from './FavoriteGameModal';


export type ProfileFavoriteGameProps = {
  isOwnProfile: boolean;
  savedFavoriteGame: FavoriteGame | null;
}

export default function ProfileFavoriteGame({ isOwnProfile, savedFavoriteGame }: ProfileFavoriteGameProps) {
  const [open, setOpen] = useState(false);
  const [favoriteGame, setFavoriteGame] = useState<FavoriteGame | null>(savedFavoriteGame);
  const [mode ,setMode] = useState<"add" | "edit">("add");

  return (
    <PixelCard title='Favorite Game' icon={<PxlKitIcon icon={Star} size={20} />}>
      {favoriteGame
        ? (
          <div className='flex flex-col justify-between'>
            <Image
              src={favoriteGame.cover}
              alt="Favorite Game"
              className="rounded-md w-full"
              width={500}
              height={500}
            />
            <div className='mt-3'>
              <div className='flex justify-between items-center'>
                <span className='font-pixel text-retro-text text-xs'>{favoriteGame.title}</span>
                {isOwnProfile && 
                  <ProfileFavoritePopover 
                  favoriteId={favoriteGame.id} 
                  setFavoriteGame={setFavoriteGame}
                  setMode={setMode}
                  setOpen={setOpen}
                  />
                }
              </div>
              <p className='flex flex-wrap text-start text-xs mt-2 italic'>{favoriteGame.description}</p>
            </div>
          </div>
        ) : (
          <>
            {isOwnProfile
              ? <PixelButton tone="neutral"
                className='w-full cursor-pointer'
                onClick={() => {
                  setOpen(true);
                }}
              >
                + Add a Game
              </PixelButton>
              : <span>No favorite game</span>
            }
          </>
        )
      }

      <FavoriteGameModal
        open={open}
        setOpen={setOpen}
        mode={mode}
        savedFavoriteGame={favoriteGame}
        setFavoriteGame={setFavoriteGame}
      />

    </PixelCard>
  )
}
