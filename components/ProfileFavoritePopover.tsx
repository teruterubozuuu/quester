"use"
import { usePopover } from '@/contexts/PopoverContext';
import { FavoriteGame } from '@/utils/types/profile-page';
import { PixelPopover } from '@pxlkit/ui-kit';
import { EllipsisVertical, Pencil, Trash, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type FavoritePopoverProps = {
    favoriteId: string;
    setMode: Dispatch<SetStateAction<"add" | "edit">>;
    setFavoriteGame: Dispatch<SetStateAction<FavoriteGame | null>>;
    setOpen: Dispatch<SetStateAction<boolean>>
}


export default function ProfileFavoritePopover({ favoriteId, setMode, setFavoriteGame, setOpen }: FavoritePopoverProps) {
    const { openId, setOpenId } = usePopover();
    const open = openId === favoriteId;


    const handleRemove = async () => {
        try {
            const res = await fetch("/api/favorite-game", {
                method: "DELETE",
                body: JSON.stringify({ favoriteId })
            });

            if (!res.ok) {
                throw new Error("Failed to remove game as favorite")
            }

            setFavoriteGame(null);
            setOpenId(null);
        } catch (error) {
            console.error("Failed to remove game as favorite: ", error);
        }
    }

    const handleEdit = () => {
        setOpen(true);
        setMode("edit");
    }

    return (
        <>
            <PixelPopover open={open} onOpenChange={(isOpen) => setOpenId(isOpen ? favoriteId : null)} align='end'>
                <PixelPopover.Trigger>
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Open options"
                        className='cursor-pointer p-1 bg-retro-card/80 border border-retro-border transition-colors hover:border-retro-primary rounded-md'
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(open ? null : favoriteId);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenId(open ? null : favoriteId);
                            }
                        }}
                    >
                        <EllipsisVertical size={15} className='text-retro-muted' />
                    </div>
                </PixelPopover.Trigger>

                <PixelPopover.Content aria-labelledby="popover-title" className='text-xs font-mono text-retro-text flex flex-col gap-3 p-0!'>
                    <div>
                        <div className='p-3 hover:bg-retro-card transition-colors hover:text-retro-cyan cursor-pointer'>
                            <button
                                className='flex items-center gap-2 cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit();
                                }}
                            >
                                <Pencil size={13} />
                                Edit
                            </button>
                        </div>

                        <div className='p-3 hover:bg-retro-card transition-colors hover:text-retro-red cursor-pointer'>
                            <button
                                className='flex items-center gap-2 cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <X size={13} />
                                Remove
                            </button>
                        </div>
                    </div>
                </PixelPopover.Content>
            </PixelPopover>
        </>
    )
}
