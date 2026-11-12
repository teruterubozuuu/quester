import { PixelButton, PixelCard, PixelProgress } from '@pxlkit/ui-kit'
import { UserProps } from '@/utils/types/profile-page';
import EditProfile from './EditProfile';

type ProfileProps = {
    user: UserProps;
    progress: number;
    isOwnProfile: boolean;
}

export default function ProfileHeader({ user, progress, isOwnProfile }: ProfileProps) {
    return (
        <div>
            <PixelCard className='bg-retro-card w-full relative h-fit min-h-0 max-h-none overflow-visible p-0!'>
                {/**
                 * COVER PHOTO
                 */}
                <img src="/spiderman.jpg" className='object-cover md:max-h-60 w-full' />

                <div className='relative -translate-y-4 md:-translate-y-2'>
                    <img
                        src="/GuildReceptionist-1000x1000.gif"
                        alt="Quill"
                        className='absolute -top-8 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-20 md:w-35 z-10'
                    />
                    {/* Content: pt pushes it below the avatar; start alignment removes mobile gap */}
                    <div className='flex w-full flex-col items-center font-mono justify-center px-5 gap-3 pt-20 md:pt-8 md:pb-3 md:flex-row md:items-start md:justify-between'>
                        <div className='flex flex-col space-y-1 w-fit max-w-lg md:pl-30'>
                            <div className='flex md:flex-row flex-col gap-2 mb-3 items-center'>
                                <span className='font-pixel text-retro-text'>{user.display_name}</span>
                                <span className='font-mono italic text-xs'>@{user.username}</span>
                            </div>
                            {user.bio && <p className='max-w-xs wrap-break-word text-xs text-center md:text-start text-retro-text'>{user.bio}</p>}
                            <p className='text-retro-red'>Level <span className='font-bold'>{user.level}</span></p>
                            {isOwnProfile && (
                                <PixelProgress value={progress} label='EXP' tone='gold' />
                            )}

                        </div>
                        <EditProfile user={user} />
                    </div>
                </div>

            </PixelCard>
        </div>
    )
}
