import { status } from '@/utils/quests-constants';
import { PixelButton, PixelInput, PixelModal, PixelScrollArea, PixelSelect } from '@pxlkit/ui-kit';
import React, { Dispatch, SetStateAction } from 'react'
import { GameDetails } from './QuestsPage';

type AddGameModalProps = {
    open: boolean;
    searchQuery: string;
    game: GameDetails[];
    selectedGame: GameDetails | null;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    setSelectedGame: Dispatch<SetStateAction<GameDetails | null>>;
    setGame: Dispatch<SetStateAction<GameDetails[]>>;
    handleGameSubmit: (
        e: React.SubmitEvent<HTMLFormElement>
    ) => void | Promise<void>;

}

export default function AddGameModal({
    open,
    setOpen,
    setSearchQuery,
    setSelectedGame,
    game,
    searchQuery,
    setGame,
    selectedGame,
    handleGameSubmit
}: AddGameModalProps) {
  return (
          <PixelModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSearchQuery("");
        }}
        title="Game"
        description="Add a game on your Quest Board"
      >
        <form className="flex flex-col gap-3" onSubmit={handleGameSubmit}>
          <PixelInput
            label="Title"
            placeholder="The Legend of Zelda: Breath of the Wild"
            name="title"
            type="text"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedGame(null);
            }}
            value={searchQuery}
          />

          {game.length > 0 && (
            <PixelScrollArea
              aria-label="Sample scrollable region"
              maxHeight={120}
            >
              <div className="space-y-2 p-3">
                {game.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="w-full text-start cursor-pointer text-sm text-retro-muted hover:text-retro-red hover:bg-retro-red/20 px-2 py-1 rounded-md"
                    onClick={() => {
                      setSelectedGame(item);
                      setSearchQuery(item.name);
                      setGame([]);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </PixelScrollArea>
          )}

          <div className="**:[[role=listbox]]:top-auto **:[[role=listbox]]:bottom-full **:[[role=listbox]]:mt-0 **:[[role=listbox]]:mb-1">
            <PixelSelect
              label="Status"
              options={status}
              name="status"
              defaultValue="backlog"
            />
          </div>
          <PixelButton
            tone="red"
            className="w-full cursor-pointer"
            disabled={!selectedGame}
          >
            Submit
          </PixelButton>
        </form>
      </PixelModal>
  )
}
