"use client";
import { PxlKitIcon } from '@pxlkit/core'
import { Star } from '@pxlkit/gamification'
import { PixelButton, PixelCard, useToast } from '@pxlkit/ui-kit'
import { SubmitEvent, useEffect, useState } from 'react'
import AddFavoriteGameModal from './AddFavoriteGameModal';
import { GameDetails } from '@/utils/types/quest-page';
import { FavoriteGame } from '@/utils/types/profile-page';
import ProfileFavoritePopover from './ProfileFavoritePopover';


export type ProfileFavoriteGameProps = {
  isOwnProfile: boolean;
  savedFavoriteGame: FavoriteGame | null;
}

export default function ProfileFavoriteGame({ isOwnProfile, savedFavoriteGame }: ProfileFavoriteGameProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GameDetails[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [favoriteGame, setFavoriteGame] = useState<FavoriteGame | null>(savedFavoriteGame);
  const [mode, setMode] = useState("add");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Fetches Game Data from IGDB
   * @param normalizedQuery 
   */
  const fetchIGDB = async (normalizedQuery: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: normalizedQuery })
      })
      if (!res.ok) {
        throw new Error("Failed to fetch game data");
      }

      const igdbData: GameDetails[] = await res.json();

      setSearchResults(igdbData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch game: ", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedGame) {
      return;
    }

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      void fetchIGDB(normalizedQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  /**
   * Function for handling submitted forms
   * @param e 
   */
  const handleSubmitFavoriteGame = async (e: SubmitEvent<HTMLFormElement>) => {
    try {
      const formData = new FormData(e.currentTarget);
      const description = formData.get("description");

      const res = await fetch("/api/add-favorite-game", {
        method: "POST",
        body: JSON.stringify({ game: selectedGame, description })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Failed to add game data");
        throw new Error("Failed to add game data");
      }

      const newFavoriteGame: FavoriteGame = await res.json();
      setFavoriteGame(newFavoriteGame);
    } catch (error) {
      console.error("Failed to add game as favorite: ", error);
      toast.error("Failed to add game as favorite")
    }
  }

  useEffect(() => {
  setFavoriteGame(savedFavoriteGame);
}, [savedFavoriteGame]);
  
  const handleFavoriteEdit = async()=>{
    try{

    } catch(error){
      console.error(error);
    }
  }

  const handleRemove = async(favoriteId: string)=>{
    try{
      const res = await fetch("/api/delete-favorite-game", {
        method: "DELETE",
        body: JSON.stringify({favoriteId})
      });

      if (!res.ok){
        throw new Error("Failed to remove game as favorite")
      }

      setFavoriteGame(null);
    } catch(error){
      console.error("Failed to remove game as favorite: ", error);
    }
  }

  return (
    <PixelCard title='Favorite Game' icon={<PxlKitIcon icon={Star} size={20} />}>
      {favoriteGame
        ? (
          <div className='flex flex-col items-cente justify-between'>
            <img
              src={favoriteGame.cover}
              alt="Favorite Game"
              className="rounded-md"
            />
            <div className='mt-3'>
              <div className='flex justify-between items-center'>
                <span className='font-mono text-retro-red'>{favoriteGame.title}</span>
                <ProfileFavoritePopover favoriteId={favoriteGame.id} onDelete={handleRemove}/>
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
                  setMode("add");
                }}
              >
                + Add a Game
              </PixelButton>
              : <span>No favorite game</span>
            }
          </>
        )
      }

      <AddFavoriteGameModal
        open={open}
        setOpen={setOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        isLoading={isLoading}
        submitFavoriteGame={handleSubmitFavoriteGame}
      />
    </PixelCard>
  )
}
