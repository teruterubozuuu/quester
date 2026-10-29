"use client";
import {
  cn,
  PixelBadge,
  PixelButton,
  PixelCard,
  PixelDrawer,
  PixelInput,
  PixelSelect,
  useToast,
} from "@pxlkit/ui-kit";
import { Dispatch, SetStateAction, SubmitEvent, useEffect, useRef, useState } from "react";
import {
  questDifficulties,
  questStatus,
  status,
} from "@/utils/quests-constants";
import { QuestSchema } from "@/lib/schemas/quest.schema";
import { QuestData, SavedGame } from "@/utils/types/quest-page";
import QuestPopover from "./QuestPopover";

type QuestDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  game: SavedGame | null;
  quests: QuestData[];
  onGameStatusChange: (gameId: string, status: string) => void;
};

export default function QuestDrawer({ open, setOpen, game, quests, onGameStatusChange }: QuestDrawerProps) {
  const { toast } = useToast();
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuest, SetEditingQuest] = useState<QuestData | undefined>(undefined);
  const [savedQuests, setSavedQuests] = useState<QuestData[]>(quests);
  const prevGameIdRef = useRef(game?.id);

  useEffect(() => {
    if (prevGameIdRef.current !== game?.id) {
      setSavedQuests(quests);
      prevGameIdRef.current = game?.id;
    }
  }, [game?.id, quests]);

  const handleQuestEdit = (questId: string) => {
    const questData = savedQuests.find((quest) => quest.id === questId);
    SetEditingQuest(questData);
  }

  const handleQuestSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const questAPI = isEditing ? "edit-quest" : "add-quest";

    if (!game) {
      toast.error("Select a game before adding a quest");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("quest-title");
      const status = formData.get("status");
      const difficulty = formData.get("difficulty");

      if (!title) {
        toast.error("Please add a Quest Title");
        return;
      }

      const result = QuestSchema.parse({ title, status, difficulty });

      const res = await fetch(`/api/${questAPI}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: game.id,
          ...(isEditing && { questId: editingQuest?.id }), // Clean way to conditionally include questId
          title: result.title,
          difficulty: result.difficulty,
          status: result.status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add quest");
      }

      const newQuest: QuestData = await res.json();

      if (isEditing) {
        // Replace existing quest instead of appending a duplicate
        setSavedQuests((currentQuests)=> 
          currentQuests.map((quest) => (quest.id === editingQuest?.id ? {...quest, ...newQuest} : quest))
        )
        toast.success("Quest updated successfully");
      } else {
        // Append the newly created quest
        setSavedQuests((currentQuests) => [...currentQuests, newQuest]);
        toast.success("Quest added successfully");
      }

      setIsAddingQuest(false);
      setIsEditing(false);
      SetEditingQuest(undefined);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add quest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuestStatus = async (questId: string, value: string) => {
    setSavedQuests((currentQuests) =>
      currentQuests.map((quest) =>
        quest.id === questId
          ? { ...quest, status: value }
          : quest
      )
    );
    try {
      const res = await fetch("/api/update-quest-status", {
        method: "PATCH",
        body: JSON.stringify({ status: value, questId: questId })
      });

      if (!res.ok) {
        toast.error("Failed to update quest status");
        throw new Error("Failed to update quest status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quest status")
    }
  }
  const handleUpdateGameStatus = async (gameId: string, value: string) => {
    onGameStatusChange(gameId, value);
    try {
      const res = await fetch("/api/update-game-status", {
        method: "PATCH",
        body: JSON.stringify({ status: value, gameId: gameId })
      });

      if (!res.ok) {
        toast.error("Failed to update game status");
        throw new Error("Failed to update game status");
      }
    } catch (error) {
      console.error("Failed to update game status: ", error);
    }
  }



  const handleQuestDelete = async (questId: string) => {
    try {
      const res = await fetch("/api/delete-quest", {
        method: "DELETE",
        body: JSON.stringify({ questId: questId })
      });

      if (!res.ok) {
        toast.error("Failed to delete quest");
        throw new Error("Failed to delete quest");
      }

      setSavedQuests((currentQuests) =>
        currentQuests.filter((quests) => quests.id !== questId));

      toast.info("Quest has been deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete quest")
    }
  }

  const getQuestDifficultyTone = (difficulty: string) => {
    if (difficulty === "easy") return "green";
    if (difficulty === "medium") return "gold";
    if (difficulty === "hard") return "red";
    if (difficulty === "diabolical") return "purple";

    return undefined;
  };


  return (
    <PixelDrawer open={open} onOpenChange={setOpen} title="Quests" trapFocus={false}>
      <PixelDrawer.Header>
        <span className="font-pixel">{game?.title}</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-pixel cursor-pointer hover:text-retro-red transition-colors"
        >
          X
        </button>
      </PixelDrawer.Header>
      <PixelDrawer.Body className="overflow-visible space-y-3">
        <div className="flex justify-between items-center">
          <PixelSelect
            label="Game Status"
            options={status}
            defaultValue={game?.status}
            onChange={(value) => {
              if (!game) {
                return;
              }

              void handleUpdateGameStatus(game.id, value);
            }}
          />
        </div>
        {isAddingQuest || isEditing ? (
          <div>
            <header className="flex justify-between items-center text-retro-muted">
              <span className="font-mono font-bold uppercase">{isEditing ? "Edit Quest" : "Add a quest"}</span>
              <button
                className="font-pixel cursor-pointer hover:text-retro-red"
                onClick={() => {
                  setIsAddingQuest(false);
                  setIsEditing(false);
                }}
              >
                X
              </button>
            </header>
            <form
              onSubmit={handleQuestSubmit}
              className="mt-2 flex flex-col gap-3"
            >
              <PixelInput
                label="Quest Title"
                placeholder="Unalive a Lynel"
                name="quest-title"
                defaultValue={isEditing ? editingQuest?.title : ""}
              />

              <PixelSelect
                label="Quest Status"
                name="status"
                options={questStatus}
                defaultValue={isEditing ? editingQuest?.status : "todo"}
              />
              <PixelSelect
                label="Difficulty"
                name="difficulty"
                options={questDifficulties}
                defaultValue={isEditing ? editingQuest?.difficulty : "easy"}
              />
              <PixelButton
                type="submit"
                tone="red"
                disabled={!game || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </PixelButton>
            </form>
          </div>
        ) : (
          <PixelButton
            type="button"
            tone="neutral"
            onClick={() => setIsAddingQuest(true)}
            className="w-full cursor-pointer text-retro-muted!"
          >
            + Add a Quest
          </PixelButton>
        )}

        {savedQuests.map((quest) => {
          const date = new Date(quest.created_at);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: "short",
            day: "2-digit",
            year: "numeric"
          });
          return (
            <PixelCard
              key={quest.id}
              className="overflow-visible"
            >
              <div className="justify-between w-full flex mb-2">
                <span className="font-mono font-bold text-retro-text text-lg">{quest.title}</span>
                <QuestPopover questId={quest.id} onDelete={handleQuestDelete} setIsEditing={setIsEditing} onEdit={handleQuestEdit} />
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-retro-muted font-mono">Status</span>

                <select
                  value={quest.status}
                  onChange={(e) => {
                    handleUpdateQuestStatus(quest.id, e.target.value);

                  }}
                  className="cursor-pointer focus:none! rounded-md border-2 border-retro-border bg-retro-surface px-1 py-2 font-mono text-retro-text"
                >
                  {questStatus.map((option) => (
                    <option key={option.value} value={option.value} className="border-2 border-retro-border rounded-md text-retro-text">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2 my-2">
                <PixelBadge className="uppercase" tone={getQuestDifficultyTone(quest.difficulty)}>{quest.difficulty}</PixelBadge>
                <PixelBadge className="uppercase" tone="cyan"> EXP: {quest.exp}</PixelBadge>
              </div>
              <span>Created at: {formattedDate}</span>
            </PixelCard>
          )
        })
        }
      </PixelDrawer.Body>
    </PixelDrawer>
  );
}
