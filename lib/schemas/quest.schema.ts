import {z} from "zod";

export const QuestSchema = z.object({
    title: z.string(),
    difficulty: z.enum(["easy", "medium", "hard", "diabolical"]),
    status: z.enum(["todo", "in_progress", "completed"])
});

export type QuestData = z.infer<typeof QuestSchema>