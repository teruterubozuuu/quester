import { PixelTabs } from '@pxlkit/ui-kit';
import type { TabItem } from '@pxlkit/ui-kit';
import ProfilePosts from './ProfilePosts';
import ProfileFavoriteGame, { ProfileFavoriteGameProps } from './ProfileFavoriteGame';
import ProfileActivities from './ProfileActivities';
import { PxlKitIcon } from '@pxlkit/core';
import { Comment } from '@pxlkit/social';

export function ProfileTabs({isOwnProfile, savedFavoriteGame}: ProfileFavoriteGameProps) {
    const ITEMS: TabItem[] = [
  { id: 'posts', label: 'Posts', content: <ProfilePosts/> },
  { id: 'favorite', label: 'Favorite Game', content: <ProfileFavoriteGame isOwnProfile={isOwnProfile} savedFavoriteGame={savedFavoriteGame}/>},
  { id: 'activity', label: 'Recent Activity', content: <ProfileActivities/> },
];

  return <PixelTabs items={ITEMS} defaultValue="posts"/>;
}