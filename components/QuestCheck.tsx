"use client";
import { PixelButton, PixelCard, PixelFileUpload, PixelModal, PixelScrollArea, PixelTypewriter, useToast } from '@pxlkit/ui-kit'
import { Dispatch, SetStateAction, useState } from 'react';

type QuestCheckProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onQuestCompletion: (questId: string, status: string) => void;
    questId: string | null;
    status: string | null;
}

export default function QuestCheck({ open, setOpen, questId, status, onQuestCompletion }: QuestCheckProps) {
    const { toast } = useToast();
    const [pocFile, setPocFile] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    /**
   * COMPLETE QUEST
   * @param questId 
   * @param status 
   */
    const handleQuestCompletion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("questId", questId!);
            formData.append("proofProvided", String(pocFile.length > 0));

            if (pocFile[0]) {
                formData.append("file", pocFile[0]);
            }

            const res = await fetch("/api/complete-quest", {
                method: "POST",
                body: formData
            });
            const responseBody = await res.json();

            if (!res.ok) {
                throw new Error(responseBody.error ?? "Failed to update quest");
            }


            onQuestCompletion(questId as string, status as string);
            setPocFile([]);
            setOpen(false);
            toast.success("You completed a Quest!");
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quest");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

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
                            speed={45}
                            label="Not so fast, Quester! Rules are rules: Pics or it didn't happen."
                            />
                        </div>
                    </PixelCard>
                </div>
                <form onSubmit={handleQuestCompletion}>
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
                        <PixelButton className='w-full cursor-pointer text-xs text-retro-text/80' tone="neutral">Sorry! I don't have any proof. (XP is halved)</PixelButton>
                    </div>
                </form>
            </div>
        </PixelModal>
    )
}
