"use client";
import { FavoriteGame } from '@/utils/types/profile-page';
import { GameDetails } from '@/utils/types/quest-page';
import { AnimatedPxlKitIcon } from '@pxlkit/core';
import { LoadingCircle } from '@pxlkit/feedback';
import { PixelBadge, PixelBox, PixelButton, PixelInput, PixelModal, PixelScrollArea, PixelTextarea, useToast } from '@pxlkit/ui-kit'
import React, { Dispatch, SetStateAction, SubmitEvent, useEffect, useState } from 'react'

type FavoriteGameProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    mode: "add" | "edit";
    savedFavoriteGame: FavoriteGame | null;
    setFavoriteGame: Dispatch<SetStateAction<FavoriteGame | null>>
}

export default function FavoriteGameModal({
    open,
    setOpen,
    mode,
    savedFavoriteGame,
    setFavoriteGame
}: FavoriteGameProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState(savedFavoriteGame?.title ?? "");
    const [searchResults, setSearchResults] = useState<GameDetails[]>([]);
    const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);

    /**
     * Fetches Game Data from IGDB
     * @param normalizedQuery 
     */
    const fetchIGDB = async (normalizedQuery: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/igdb", {
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

            // Automatically select the previously saved game
            if (savedFavoriteGame) {
                const existingGame = igdbData.find(
                    game => game.name.toLowerCase() === savedFavoriteGame.title.toLowerCase()
                );

                if (existingGame) {
                    setSelectedGame(existingGame);
                    setSearchResults([]);
                }
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch game: ", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Debounce query
     */
    useEffect(() => {
        if (selectedGame) return;
        const normalizedQuery = searchQuery.trim();
        if (!normalizedQuery) {
            setSearchResults([]);
            return;
        }
        const timeout = setTimeout(() => {
            void fetchIGDB(normalizedQuery);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, selectedGame]);

    /**
     * Synchronize favorite game
     */
    useEffect(() => {
        setFavoriteGame(savedFavoriteGame);
    }, [savedFavoriteGame]);

    /**
     * Re-initialize state when modal opens
     */
    useEffect(() => {
        if (!open) return;
        setSearchQuery(savedFavoriteGame?.title ?? "");
        setSelectedGame(null);
        setSearchResults([]);
    }, [open, savedFavoriteGame]);

    /**
     * Function for handling submitted forms
     * @param e 
     */
    const handleSubmitFavoriteGame = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const description = formData.get("description");

            const res = await fetch("/api/favorite-game", {
                method: mode === "edit" ? "PATCH" : "POST",
                body: JSON.stringify(mode === "edit" ? {game:selectedGame, favoriteId: savedFavoriteGame?.id, description} : { game: selectedGame, description })
            });

            if (!res.ok) {
                throw new Error(mode === "edit" ? "Failed to update game data" : "Failed to add game data");
            }

            const newFavoriteGame: FavoriteGame = await res.json();
            setFavoriteGame(newFavoriteGame);
            setOpen(false);
        } catch (error) {
            console.error(mode === "edit" ? "Failed to update game data" : "Failed to add game as favorite", error);
            toast.error(mode === "edit" ? "Failed to update game data" : "Failed to add game as favorite")
        }
    }

    return (
        <PixelModal
            open={open}
            onClose={() => {
                setOpen(false)
                setSearchQuery("");
                setSelectedGame(null);
            }}
            title={mode === "add" ? "Favorite Game" : "Edit Favorite Game"}
            size='lg'
        >
            <form onSubmit={handleSubmitFavoriteGame}>
                <PixelScrollArea aria-label="Scrollable region" maxHeight={500} className='flex flex-col gap-2'>
                    <PixelInput
                        label="Title"
                        placeholder='League of Legends'
                        name="title"
                        type="text"
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedGame(null);
                        }}
                        value={searchQuery}
                    />

                    {isLoading
                        ? (
                            <div className="flex gap-2 items-center justify-center py-2">
                                <AnimatedPxlKitIcon icon={LoadingCircle} size={20} />
                                <span className="font-mono"> Loading...</span>
                            </div>
                        ) : (
                            <PixelScrollArea
                                aria-label="Scrollable region"
                                maxHeight={250}
                            >
                                <div>
                                    {searchResults.map((game) => (
                                        <button
                                            type="button"
                                            className="w-full text-start text-sm text-retro-muted hover:text-retro-primary flex cursor-pointer items-center gap-2 hover:bg-retro-primary/20 p-2 rounded-md "
                                            onClick={() => {
                                                setSelectedGame(game);
                                                setSearchQuery(game.name);
                                                setSearchResults([]);
                                            }}
                                            key={game.id}
                                        >
                                            {game.cover && (
                                                <img src={game.cover} alt={game.name} className="h-18 w-18 rounded object-cover" />
                                            )}
                                            {game.name}
                                        </button>
                                    ))}
                                </div>
                            </PixelScrollArea>
                        )}

                    <PixelTextarea
                        label='Description (Optional)'
                        placeholder='Why is this game your favorite? :)'
                        name='description'
                        showCount={{ max: 160 }}
                        defaultValue={mode === "edit" ? savedFavoriteGame?.description : ""}
                    />

                    {selectedGame && (
                        <PixelBox className="flex md:flex-row flex-col md:items-start items-center gap-3 ">
                            <img src={selectedGame.cover} alt="Game Cover" className="md:w-50 md:h-50  w-30 h-full  rounded-md" />
                            <div className="flex flex-col gap-2">
                                <span className="font-mono font-bold text-retro-red text-[15px]">{selectedGame.name}</span>
                                <p className="font-sans">{selectedGame.summary}</p>
                                <section>
                                    <span className='text-retro-red'>Genres</span>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {selectedGame.genres.map((g) => (
                                            <PixelBadge key={g.id} tone='purple'>{g.name}</PixelBadge>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <span className='text-retro-red'>Platforms</span>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {selectedGame.platforms.map((p) => (
                                            <PixelBadge key={p.id} tone="pink">{p.name}</PixelBadge>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </PixelBox>
                    )}
                </PixelScrollArea>
                <PixelButton type='submit' disabled={!selectedGame} className='w-full mt-3'>Submit</PixelButton>
            </form>
        </PixelModal>
    )
}
