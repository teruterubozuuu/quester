"use client";
import { PixelButton, PixelCard, PixelFileUpload, PixelModal, PixelScrollArea, PixelTypewriter, useToast } from '@pxlkit/ui-kit'
import { Dispatch, SetStateAction, useState } from 'react';

type QuestCheckProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onQuestCompletion: (questId: string, status: string) => void;
    questId: string | null;
    questStatus: string | null;
    questExp: number | null;
    gameId: string | null;
    gameStatus: string | null;
    gameExp: number | null;
    mode: string | null;
}

export default function QuestCheck({ open, setOpen, questId, questStatus, onQuestCompletion, questExp, mode, gameId, gameStatus, gameExp }: QuestCheckProps) {
    const { toast } = useToast();
    const [pocFile, setPocFile] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
   * COMPLETE QUEST
   * @param questId 
   * @param status 
   */
    const handleQuestCompletion = async (proofProvided: boolean) => {
        const completionAPI = mode === "game" ? "/api/complete-game" : "/api/complete-quest";
        if (mode === "game" ? !gameId || gameExp === null : !questId || questExp === null) {
            toast.error("Completion information is missing");
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append(mode === "game" ? "gameId" : "questId", mode === "game" ? gameId! : questId!);
            formData.append("exp", mode === "game" ? String(gameExp) : String(questExp));
            formData.append("proofProvided", String(pocFile.length > 0));

            if (proofProvided && pocFile[0]) {
                formData.append("file", pocFile[0]);
            }

            const res = await fetch(`${completionAPI}`, {
                method: "POST",
                body: formData
            });
            const responseBody = await res.json();

            if (!res.ok) {
                throw new Error(responseBody.error ?? "Failed to update quest");
            }

            onQuestCompletion(questId as string, questStatus as string);
            setPocFile([]);
            setOpen(false);
            toast.success(
                "You completed a Quest!",
                `You gained ${responseBody.earnedExp} EXP ${proofProvided ? "and +1 QCP" : ""}`
            );
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quest");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const handleProofSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void handleQuestCompletion(true);
    };

    const handleNoProof = () => {
        void handleQuestCompletion(false);
    };

    return (
        <PixelModal open={open} onClose={() => setOpen(false)} title="! Halt !" description=" Before you can claim your hard-earned XP, a hand bars your path. 
  It’s Quill, the Guild Receptionist, smiling at you mischievously.">
            <div className='flex flex-col gap-5'>
                <div className='flex'>
                    <img src="/GuildReceptionist-1000x1000.gif" alt="Quill" className='w-auto h-30' />
                    <PixelCard className='w-full'>
                        <div className='flex flex-col gap-3'>
                            <h1 className='font-pixel text-retro-text'>Quill</h1>
                            <PixelTypewriter
                                className='font-mono mb-3 text-retro-text/90'
                                speed={20}
                                label="Not so fast! Rules are rules: Hand over the proof, before you get your shiny loot."
                            />
                        </div>
                    </PixelCard>
                </div>
                <form onSubmit={handleProofSubmit}>
                    <PixelScrollArea
                        maxHeight={200}
                        aria-label='Uploaded proof of completion files'
                    >
                        <PixelFileUpload
                            label="Upload Proof of Completion (Max: 5 files)"
                            hint="PNG or JPG, up to 5 MB each"
                            value={pocFile}
                            onChange={setPocFile}
                            accept=".png, .jpg, .jpeg, image/png, image/jpeg"
                            multiple
                            maxSize={5 * 1024 * 1024}
                            maxFiles={5}
                        />
                    </PixelScrollArea>
                    <div className='flex flex-col gap-2 mt-3'>
                        <PixelButton className='w-full cursor-pointer' tone="purple" type='submit' disabled={isLoading}>{isLoading ? "Submititng..." : "Submit"}</PixelButton>
                        <PixelButton
                            className="w-full cursor-pointer text-xs text-retro-text/80"
                            tone="neutral"
                            type="button"
                            onClick={handleNoProof}
                            disabled={isLoading}
                        >
                            Sorry! I don't have any proof. (XP is halved)
                        </PixelButton>
                    </div>
                </form>
            </div>
        </PixelModal>
    )
}
