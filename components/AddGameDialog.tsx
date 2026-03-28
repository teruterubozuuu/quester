import { useEffect, useMemo, useState } from "react"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Command, CommandEmpty, CommandInput } from "./ui/command"
import { CommandGroup, CommandItem, CommandList } from "cmdk"
import { Button } from "./ui/button"


type SteamGame = {
  appid: number
  name: string
}

type BacklogGame = {
  id: string
  game_id: number
  game_title: string
  status: "backlog" | "playing" | "completed"
}

interface GameDialogProps {
  status: "backlog" | "playing" | "completed"
  games: { game_id: number }[]
  onAdd: (game: BacklogGame) => void
   onDuplicateError: (message: string) => void
}

export default function AddGameDialog({
  status,
  games,
  onAdd,
  onDuplicateError
}: GameDialogProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [allGames, setAllGames] = useState<SteamGame[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null)

  // fetch games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/steam/list-games")
        const data = await res.json()
        setAllGames(data.games ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  // debounce - only update debouncedQuery 400ms after user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400)
    return () => clearTimeout(timeout) // cleanup
  }, [query])

  // filter against debouncedQuery, not query
  const filteredGames = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    return allGames
      .filter((g) =>
        g.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      .slice(0, 10)
  }, [debouncedQuery, allGames])

  const handleSelect = (game: SteamGame) => {
    setSelectedGame(game) // store selected game
    setQuery("") // clear search input
  }

  const handleAddGame = async () => {
    if (!selectedGame) return
    //duplicate check
    if (games.some((g) => g.game_id === selectedGame.appid)) {
      onDuplicateError("This game already exists on your board.")
      return
    }
    try {
      const res = await fetch("/api/backlog/add-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appid: selectedGame.appid,
          name: selectedGame.name,
          status: status,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
       onDuplicateError(data.error ?? "Failed to add game.")
        return
      }

      onAdd(data.game)
      setSelectedGame(null)
    } catch (error) {
      onDuplicateError("Failed to add game. Please try again.")
      console.error(error)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add a game</DialogTitle>
        <DialogDescription>
          Track your games by adding them as backlog, playing, or completed
          games.
        </DialogDescription>
      </DialogHeader>

      {/* preview of selected game */}
      {selectedGame && (
        <div className="flex items-center gap-3 rounded-md border p-3">
          <img
            src={`https://cdn.akamai.steamstatic.com/steam/apps/${selectedGame.appid}/header.jpg`}
            alt={selectedGame.name}
            width={120}
            height={45}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="rounded-sm"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{selectedGame.name}</span>
            <button
              className="text-left text-xs text-gray-500 hover:underline"
              onClick={() => setSelectedGame(null)} // clear selection
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* only show search when no game is selected */}
      {!selectedGame && (
        <Command shouldFilter={false} className="max-h-80 overflow-y-auto">
          <CommandInput
            placeholder="Search games..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="mt-2">
            {loading && <CommandEmpty>Loading games...</CommandEmpty>}
            {!loading && debouncedQuery && filteredGames.length === 0 && (
              <CommandEmpty>No games found for "{debouncedQuery}"</CommandEmpty>
            )}
            {!loading && !debouncedQuery && (
              <CommandEmpty>Start typing to search games.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredGames.map((game) => (
                <CommandItem
                  key={game.appid}
                  className="flex cursor-pointer items-center gap-3 px-4 py-1"
                  onSelect={() => handleSelect(game)} // ← use handleSelect
                >
                  <img
                    src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    width={100}
                    height={30}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="rounded-sm"
                  />
                  <span className="text-sm font-semibold">{game.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
      <Button
        disabled={!selectedGame}
        onClick={handleAddGame}
        className="font-semibold text-foreground"
      >
        Add
      </Button>
    </>
  )
}
