"use client"
import AddGameDialog from "@/components/AddGameDialog"
import DeleteGameDialog from "@/components/backlog/DeleteGameDialog"
import SelectStatus from "@/components/SelectStatus"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { DragDropProvider, useDraggable } from "@dnd-kit/react"
import Droppable from "@/components/backlog/Droppable"
import Draggable from "@/components/backlog/Draggable"
import { Input } from "@/components/ui/input"
import { Command, CommandInput } from "@/components/ui/command"

type Game = {
  id: string
  game_id: number
  game_title: string
  status: "backlog" | "playing" | "completed"
}

export default function Backlogs() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState<
    "backlog" | "playing" | "completed" | null
  >(null)
  const [search, setSearch] = useState("");

  const status = [
    { id: "backlog", label: "Backlog", style: "border-2 border-red-900" },
    { id: "playing", label: "Playing", style: "border-2 border-yellow-700" },
    { id: "completed", label: "Completed", style: "border-2 border-green-900" },
  ] as const

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/backlog/fetch-game")
        const data = await res.json()
        setGames(data.games ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  const handleStatusChange = async (
    gameId: string,
    newStatus: "backlog" | "playing" | "completed"
  ) => {
    const oldStatus = games.find((g) => g.id === gameId)?.status
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      )
    )
    try {
      await fetch("/api/backlog/update-game", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId, status: newStatus }),
      })
    } catch (error) {
      setGames((prev) =>
        prev.map((g) => (g.id === gameId ? { ...g, status: oldStatus! } : g))
      )
      console.error("Failed to update status:", error)
    }
  }

  const handleDeleteGame = async (gameId: string) => {
    const deletedGame = games.find((g) => g.id === gameId)
    setGames((prev) => prev.filter((g) => g.id !== gameId))
    try {
      const res = await fetch("/api/backlog/delete-game", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId }),
      })
      if (!res.ok) throw new Error(`Failed to delete game: ${res.status}`)
    } catch (error) {
      if (deletedGame) setGames((prev) => [...prev, deletedGame])
      console.error(error)
    }
  }

  const handleDuplicateError = useCallback((msg: string) => {
    toast.error(msg)
  }, [])

  const handleAddGame = (newGame: Game) => {
    setGames((prev) => [...prev, newGame])
    setOpenDialog(null) // ✅ closes dialog only on success
    toast.success(`${newGame.game_title} added to your backlog!`)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center gap-3 bg-background">
        <Loader2 className="animate-spin" />
        <p>Loading...</p>
      </div>
    )
  }

  return (
  <>
  <Command className="max-h-80 pb-2 mb-4 bg-transparent">
    <CommandInput
      placeholder="Looking for a game?"
      value={search}
      onValueChange={(value)=>setSearch(value)}
      
    />
  </Command>
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return
        const { source, target } = event.operation
        if (!target) return

        if (!source?.id || !target?.id) return

        handleStatusChange(
          String(source.id),
          target.id as "backlog" | "playing" | "completed"
        )
      }}
    >
      <div className="flex lg:flex-row flex-col gap-6">
        {status.map((status) => {
          const columnGames = games.filter((g) => g.status === status.id && g.game_title.toLowerCase().includes(search.toLowerCase()));
          return (
            <Droppable key={status.id} id={status.id}>
              <Card
                key={status.id}
               className={`flex flex-col w-full ${status.style} lg:h-[80vh] xl:[90vh] p-5`}
              >
                <CardHeader className="flex items-center justify-between px-0!">
                  <CardTitle className="tracking-wide uppercase">
                    {status.label}
                  </CardTitle>
                  <Dialog
                    open={openDialog === status.id}
                    onOpenChange={(open) =>
                      setOpenDialog(open ? status.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="cursor-pointer bg-background text-white"
                        title="Add a game"
                      >
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AddGameDialog
                        status={status.id}
                        games={games}
                        onAdd={handleAddGame}
                        onDuplicateError={handleDuplicateError}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                {columnGames.length === 0 ? (
                  <CardContent className="rounded-md bg-background py-3">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span>None</span>
                    </div>
                  </CardContent>
                ) : (
                  <div className="overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar p-3 pt-0">
                    {columnGames.map((game) => (
                      <Draggable
                        key={game.id}
                        gameId={game.id}
                        gameStatus={game.status}
                        gameTitle={game.game_title}
                        steamAppId={game.game_id.toString()}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteGame}
                      />
        
                    ))}
                  </div>
                )}
              </Card>
            </Droppable>
          )
        })}
      </div>
    </DragDropProvider>
      </>
  )
}
