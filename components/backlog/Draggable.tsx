import React from "react"
import { CardContent } from "../ui/card"
import SelectStatus from "../SelectStatus"
import DeleteGameDialog from "./DeleteGameDialog"
import { useDraggable } from "@dnd-kit/react"

type DraggableProps = {
  gameId: string
  gameStatus: "backlog" | "completed" | "playing"
  gameTitle: string
  steamAppId: string
  onStatusChange: (
    gameId: string,
    newStatus: "backlog" | "playing" | "completed"
  ) => void
  onDelete: (gameId: string) => void
}

export default function Draggable({
  gameId,
  gameStatus,
  gameTitle,
  steamAppId,
  onStatusChange,
  onDelete,
}: DraggableProps) {
    const {ref} = useDraggable({
        id: gameId,
    })
  return (
    <CardContent
      key={gameId}
      className="flex flex-col items-start gap-3 rounded-md bg-background p-4"
      ref={ref}
    >
      <div className="flex w-full items-center justify-between">
        <SelectStatus
          status={gameStatus}
          onStatusChange={(newStatus) => onStatusChange(gameId, newStatus)}
        />
        <DeleteGameDialog game_id={gameId} onDelete={() => onDelete(gameId)} />
      </div>
      <img
        src={`https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/header.jpg`}
        alt={gameTitle}
        onError={(e) => (e.currentTarget.style.display = "none")}
        className="w-fit rounded-sm"
      />
      <span className="truncate text-sm font-semibold">{gameTitle}</span>
    </CardContent>
  )
}
