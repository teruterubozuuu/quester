"use client";
import { status } from "@/utils/quests-constants";
import {
  PixelBadge,
  PixelButton,
  PixelCard,
  useToast,
} from "@pxlkit/ui-kit";
import Image from "next/image";
import React, { SubmitEvent, useEffect, useState } from "react";
import AddGameModal from "./AddGameModal";
import QuestDrawer from "./QuestDrawer";


export type GameDetails = {
  id: number;
  name: string;
  cover: string;
  game_type: string;
  genres: string[];
  platforms: string[];
  summary: string;
  total_rating: number;
  url: string;
  game_localizations: string[];
  game_engines: string[];
  franchise: string;
  first_release_date: string;
  dlcs: string[];
  parent_game: string[];
  age_ratings: string;
};

export type SavedGame = {
  id: string;
  user_id: string;
  title: string;
  cover: string;
  summary: string | null;
  release_date: string | null;
  category: string | null;
  genre: string[];
  platforms: string[];
  total_ratings: number | null;
  url: string | null;
  status: string;
  created_at: string;
};

export type QuestData ={
  id: string;
  game_id: string;
  title: string;
  difficulty: string;
  status: string;
  exp: number[];
  created_at: string | number;
}

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
  

  const fetchIGDBData = async (normalizedQuery: string) => {
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch game data");
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
        throw new Error("Failed to add game data");
      }

      const newGame: SavedGame = await res.json();
      setSavedGames((currentGames) => [newGame, ...currentGames]);

      toast.success(`${selectedSearchGame.name} has been added to your board`);
      setOpen(false);
      setSearchQuery("");
      setSelectedSearchGame(null);
      setSearchResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getGameStatusTone = (gameStatus: string) => {
    if (gameStatus === "backlog") return "cyan";
    if (gameStatus === "playing") return "gold";
    if (gameStatus === "completed") return "green";
    if (gameStatus === "dropped") return "red";

    return undefined;
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-3">
        <h1 className="font-pixel text-lg">Quests</h1>
        <PixelButton
          tone="red"
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        >
          Add Game
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
      />

      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
        {savedGames.map((game) => {
          const gameQuests = questData.filter(
    (quest) => quest.game_id === game.id
  );
        return (
          <button
            key={game.id}
            type="button"
            className="cursor-pointer text-start"
            onClick={() => {
              setSelectedLibraryGame(game);
              setOpenDrawer(true);
            }}
          >
            <PixelCard className="hover:scale-102">
              <div className="flex md:flex-col flex-row gap-3 hover:text-retro-red">
                <div className="flex items-center flex-col">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="md:h-80 md:w-80 h-20 w-20 rounded-md object-cover"
                  loading="eager"
                />
                </div>

                <div className="flex h-18 flex-col justify-between w-full ">
                  <span
                    title={game.title}
                    className="block w-50 lg:w-60 font-mono font-bold leading-tight line-clamp-2"
                  >
                    {game.title}
                  </span>

                  <div className="flex justify-between">
                    <span className="text-sm text-retro-muted">{gameQuests.length} quests</span>
                    <PixelBadge size="sm" tone={getGameStatusTone(game.status)}>
                      {game.status.toUpperCase()}
                    </PixelBadge>
                  </div>
                </div>
              </div>
            </PixelCard>
          </button>
        )})}
      </div>

      <QuestDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        game={selectedLibraryGame}
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
