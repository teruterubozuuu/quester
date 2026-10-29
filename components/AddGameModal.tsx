import { status } from "@/utils/quests-constants";
import { GameDetails } from "@/utils/types/quest-page";
import { AnimatedPxlKitIcon } from "@pxlkit/core";
import { LoadingCircle } from "@pxlkit/feedback";
import {
  PixelBadge,
  PixelBox,
  PixelButton,
  PixelInput,
  PixelModal,
  PixelScrollArea,
  PixelSelect,
} from "@pxlkit/ui-kit";
import React, { Dispatch, SetStateAction } from "react";

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
    e: React.SubmitEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  loading: boolean;
};

export default function AddGameModal({
  open,
  setOpen,
  setSearchQuery,
  setSelectedGame,
  game,
  searchQuery,
  setGame,
  selectedGame,
  handleGameSubmit,
  loading,
}: AddGameModalProps) {
  return (
    <PixelModal
      open={open}
      onClose={() => {
        setOpen(false);
        setSearchQuery("");
        setSelectedGame(null);
      }}
      title="Game"
      description="Add a game on your Quest Board"
      size={selectedGame ? "lg" : "md"}
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
        <div className="**:[[role=listbox]]:top-auto **:[[role=listbox]]:bottom-full **:[[role=listbox]]:mt-0 **:[[role=listbox]]:mb-1">
          <PixelSelect
            label="Status"
            options={status}
            name="status"
            defaultValue="backlog"
          />
        </div>

        {loading
          ? (<div className="flex gap-2 items-center justify-center py-2">
            <AnimatedPxlKitIcon icon={LoadingCircle} size={20} />
            <span className="font-mono"> Loading...</span>
          </div>)
          : (<>
            {game.length > 0 && (
              <PixelScrollArea
                aria-label="Sample scrollable region"
                maxHeight={250}
              >
                <div className="space-y-2 cursor-pointer">
                  {game.map((item) => (
                    <button
                      type="button"
                      className="w-full text-start text-sm text-retro-muted hover:text-retro-primary flex cursor-pointer items-center gap-2 hover:bg-retro-primary/20 p-2 rounded-md "
                      onClick={() => {
                        setSelectedGame(item);
                        setSearchQuery(item.name);
                        setGame([]);
                      }}
                    >
                      {item.cover && (
                        <img src={item.cover} alt={item.name} className="h-18 w-18 rounded object-cover" />
                      )}
                      {item.name}
                    </button>

                  )
                  )}
                </div>
              </PixelScrollArea>
            )}
          </>)}

        {selectedGame && (
          <PixelBox className="flex md:flex-row flex-col md:items-start items-center gap-3 ">
            <img src={selectedGame.cover} alt="Game Cover" className="md:w-50 md:h-50  w-30 h-full  rounded-md" />
            <div className="flex flex-col gap-2">
              <span className="font-mono font-bold text-retro-red text-[15px]">{selectedGame.name}</span>
              <PixelScrollArea
                className="md:max-h-40 max-h-20"
              >
                <p className="font-sans">{selectedGame.summary}</p>
              </PixelScrollArea>
            </div>
          </PixelBox>
        )}
        <PixelButton
          tone="red"
          className="w-full cursor-pointer"
          disabled={!selectedGame}
        >
          Submit
        </PixelButton>
      </form>
    </PixelModal>
  );
}
