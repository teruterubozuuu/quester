"use client";
import {
  PixelBadge,
  PixelButton,
  PixelCard,
  PixelDrawer,
  PixelInput,
  PixelSelect,
  useToast,
} from "@pxlkit/ui-kit";
import { Dispatch, SetStateAction, SubmitEvent, useEffect, useState } from "react";
import { QuestData, SavedGame } from "./QuestsPage";
import {
  questDifficulties,
  questStatus,
  status,
} from "@/utils/quests-constants";
import { QuestSchema } from "@/lib/schemas/quest.schema";

type QuestDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  game: SavedGame | null;
  quests: QuestData[];
};

export default function QuestDrawer({ open, setOpen, game, quests }: QuestDrawerProps) {
  const { toast } = useToast();
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedQuests, setSavedQuests] = useState<QuestData[]>(quests);


  useEffect(() => {
  setSavedQuests(quests);
}, [quests]);

  const handleQuestSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      const res = await fetch("/api/add-quest", {
        method: "POST",
        body: JSON.stringify({
          gameId: game.id,
          title: result.title,
          difficulty: result.difficulty,
          status: result.status
        })
      })

      if (!res.ok) {
        throw new Error("Failed to add quest");
      }

      const newQuest: QuestData = await res.json();
      setSavedQuests((currentQuests) => [newQuest, ...currentQuests]);
      setIsSubmitting(false);
      setIsAddingQuest(false);
      toast.success("Quest added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add quest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PixelDrawer open={open} onOpenChange={setOpen} title="Quests">
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
            label="Status"
            options={status}
            defaultValue={game?.status}
          />
        </div>
        {isAddingQuest ? (
          <form
            onSubmit={handleQuestSubmit}
            className="mt-4 flex flex-col gap-3"
          >
            <PixelInput
              label="Quest Title"
              placeholder="Unalive a Lynel"
              name="quest-title"
            />

            <PixelSelect
              label="Status"
              name="status"
              options={questStatus}
              defaultValue="todo"
            />
            <PixelSelect
              label="Difficulty"
              name="difficulty"
              options={questDifficulties}
              defaultValue="easy"
            />
            <PixelButton
              type="submit"
              tone="red"
              disabled={!game || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Quest"}
            </PixelButton>
          </form>
        ) : (
          <PixelButton
            type="button"
            tone="neutral"
            onClick={() => setIsAddingQuest(true)}
            className="w-full cursor-pointer text-retro-muted!"
          >
            + Add Quest
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
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-retro-muted font-mono">Status</span>

                <select
                  value={quest.status}
                  onChange={(event) => {
                    // Call your update-status API here
                    console.log(event.target.value);
                  }}
                  className="focus:none! rounded-md border-2 font-mono border-retro-border bg-retro-surface px-1 py-2"
                >
                  {questStatus.map((option) => (
                    <option key={option.value} value={option.value} className="border-2 border-retro-border rounded-md">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2 my-2">
                <PixelBadge className="uppercase">{quest.difficulty}</PixelBadge>
                <PixelBadge className="uppercase">EXP: {quest.exp}</PixelBadge>
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
