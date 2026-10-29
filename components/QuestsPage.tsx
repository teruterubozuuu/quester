"use client";
import {

  PixelBadge,
  PixelButton,
  PixelCard,
  useToast,
} from "@pxlkit/ui-kit";
import React, { SubmitEvent, useEffect, useMemo, useState } from "react";
import AddGameModal from "./AddGameModal";
import QuestDrawer from "./QuestDrawer";
import { GameDetails, QuestData, SavedGame } from "@/utils/types/quest-page";
import GameCardPopover from "./GameCardPopover";
import FilterGamesTabs from "./FilterGamesTabs";


type QuestPageProps = {
  gameData: SavedGame[];
  questData: QuestData[];
};


export default function QuestsPage({ gameData, questData }: QuestPageProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchResults, setSearchResults] = useState<GameDetails[]>([]); // For IGDB search results
  const [savedGames, setSavedGames] = useState<SavedGame[]>(gameData); // Saved games
  const [selectedSearchGame, setSelectedSearchGame] =
    useState<GameDetails | null>(null);
  const [selectedLibraryGame, setSelectedLibraryGame] =
    useState<SavedGame | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameStatus, setSelectedGameStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Derive cards that should be displayed
  const visibleGames = useMemo(() => {
    const filteredGames =
      selectedGameStatus === "all"
        ? savedGames
        : savedGames.filter((game) => game.status === selectedGameStatus);

    /**
     * The spread prevents .sort() from mutating the react state 
     * array directly
     */
    return [...filteredGames].sort((a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
    );
  }, [savedGames, selectedGameStatus])

  const fetchIGDBData = async (normalizedQuery: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: normalizedQuery }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch game data");
      }

      const data: GameDetails[] = await res.json();

      setSearchResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch game data");
      setIsLoading(false);
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSearchGame) {
      return;
    }

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      void fetchIGDBData(normalizedQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleGameSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedSearchGame) {
        toast.error("Please select a game first");
        return;
      }

      const formData = new FormData(e.currentTarget);
      const selectedStatus = formData.get("status");

      const res = await fetch("/api/add-game", {
        method: "POST",
        body: JSON.stringify({
          game: selectedSearchGame,
          status: selectedStatus,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(()=> ({}));
        toast.error(body?.error ?? "Failed to add game data");
        throw new Error("Failed to add game data");
      }

      const newGame: SavedGame = await res.json();
      setSavedGames((currentGames) => [newGame, ...currentGames]);

      toast.success("Game Added",`${selectedSearchGame.name} has been added to your board`);
      setOpen(false);
      setSearchQuery("");
      setSelectedSearchGame(null);
      setSearchResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGameStatusChange = (gameId: string, newStatus: string) => {
    setSavedGames((currentGames) =>
      currentGames.map((currentGame) =>
        currentGame.id === gameId
          ? { ...currentGame, status: newStatus }
          : currentGame
      )
    );

    setSelectedLibraryGame((currentGame) =>
      currentGame?.id === gameId
        ? { ...currentGame, status: newStatus }
        : currentGame
    );
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      const res = await fetch("/api/delete-game", {
        method: "DELETE",
        body: JSON.stringify({ gameId: gameId })
      });

      if (!res.ok) {
        throw new Error("Failed to delete game");
      }

      // Immediately remove from UI
      setSavedGames((currentGames) =>
        currentGames.filter((game) => game.id !== gameId)
      );

      // If the deleted game was the one open in the drawer, close it
      if (selectedLibraryGame?.id === null) {
        setSelectedLibraryGame(null);
        setOpenDrawer(false);
      }

      toast.info("Game has been removed from your board")
    } catch (error) {
      console.error("Failed to delete game: ", error);
      toast.error("Failed to delete game")
    }
  }

  const getGameStatusTone = (gameStatus: string) => {
    if (gameStatus === "backlog") return "cyan";
    if (gameStatus === "playing") return "gold";
    if (gameStatus === "completed") return "green";
    if (gameStatus === "dropped") return "red";

    return undefined;
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 justify-between items-center">
        <h1 className="font-pixel text-lg">Quests</h1>
        <PixelButton
          tone="red"
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        >
          <span className="hidden md:block">+ Add Game</span>
          <span className="md:hidden font-pixel text-lg">+</span>
        </PixelButton>
      </header>

      <AddGameModal
        open={open}
        setOpen={setOpen}
        searchQuery={searchQuery}
        selectedGame={selectedSearchGame}
        setSearchQuery={setSearchQuery}
        setSelectedGame={setSelectedSearchGame}
        game={searchResults}
        setGame={setSearchResults}
        handleGameSubmit={handleGameSubmit}
        loading={isLoading}
      />

      <FilterGamesTabs
        value={selectedGameStatus}
        onChange={setSelectedGameStatus}
      />

      <div
        className="-mt-4 min-h-0 overflow-y-auto scrollbar-none grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 "
      >
        {visibleGames.map((game) => {
          const gameQuests = questData.filter(
            (quest) => quest.game_id === game.id
          );
          return (
            <button
              key={game.id}
              type="button"
              className="cursor-pointer text-start"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLibraryGame(game);
                setOpenDrawer(true);
              }}
            >
              <PixelCard className="hover:border-retro-primary/30">
                <div title={game.title} className="flex md:flex-col flex-row gap-3 text-retro-text hover:text-retro-primary ">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="md:h-full md:w-full h-20 w-20 rounded-md object-cover"
                    loading="eager"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="block min-w-0 w-full wrap-break-word font-mono font-bold leading-tight line-clamp-1 truncate"
                      >
                        {game.title}
                      </span>
                      <GameCardPopover gameId={game.id} onDelete={handleDeleteGame} />
                    </div>

                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <span className="min-w-0 text-sm text-retro-muted">
                        {gameQuests.length} {gameQuests.length > 1 ? "Quests" : "Quest"}
                      </span>

                      <PixelBadge
                        size="sm"
                        tone={getGameStatusTone(game.status)}
                      >
                        {game.status.toUpperCase()}
                      </PixelBadge>
                    </div>
                  </div>
                </div>
              </PixelCard>
            </button>
          )
        })}
      </div>

      <QuestDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        game={selectedLibraryGame}
        onGameStatusChange={handleGameStatusChange}
        quests={
          selectedLibraryGame
            ? questData.filter(
              (quest) => quest.game_id === selectedLibraryGame.id
            )
            : []
        }
      />
    </div>
  );
}
