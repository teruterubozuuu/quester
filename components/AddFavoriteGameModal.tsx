import { FavoriteGame } from '@/utils/types/profile-page';
import { GameDetails } from '@/utils/types/quest-page';
import { AnimatedPxlKitIcon } from '@pxlkit/core';
import { LoadingCircle } from '@pxlkit/feedback';
import { PixelBadge, PixelBox, PixelButton, PixelInput, PixelModal, PixelScrollArea, PixelTextarea } from '@pxlkit/ui-kit'
import React, { Dispatch, SetStateAction } from 'react'

type FavoriteGameProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    selectedGame: GameDetails | null;
    setSelectedGame: Dispatch<SetStateAction<GameDetails | null>>;
    searchResults: GameDetails[];
    setSearchResults: Dispatch<SetStateAction<GameDetails[]>>;
    isLoading: boolean;
    submitFavoriteGame: (
        e: React.SubmitEvent<HTMLFormElement>,
    ) => void | Promise<void>;
}

export default function AddFavoriteGameModal({
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    selectedGame,
    setSelectedGame,
    searchResults,
    setSearchResults,
    isLoading,
    submitFavoriteGame,
}: FavoriteGameProps) {
    return (
        <PixelModal
            open={open}
            onClose={() => {
                setOpen(false)
                setSearchQuery("");
                setSelectedGame(null);
            }}
            title="Favorite Game"
            size='lg'
        >
            <form onSubmit={submitFavoriteGame}>
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
