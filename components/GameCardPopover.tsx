"use client";
import { PixelPopover } from '@pxlkit/ui-kit'
import { Ellipsis, Trash } from 'lucide-react';
import React from 'react'
import { usePopover } from '@/contexts/PopoverContext';

type GameCardPopoverProps = {
    gameId: string;
    onDelete: (gameId: string) => void;
}

export default function GameCardPopover({ gameId, onDelete }: GameCardPopoverProps) {
    const { openId, setOpenId } = usePopover();
    const open = openId === gameId;

    const handleDelete = async () => {
        await onDelete(gameId);
        setOpenId(null);
    }

    return (
        <PixelPopover open={open} onOpenChange={(isOpen) => setOpenId(isOpen ? gameId : null)} align='end'>
            <PixelPopover.Trigger>
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Open options"
                    className='cursor-pointer p-1 bg-retro-card/80 border border-retro-border transition-colors hover:border-retro-primary rounded-md'
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(open ? null : gameId);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenId(open ? null : gameId);
                        }
                    }}
                >
                    <Ellipsis size={15} className='text-retro-muted' />
                </div>
            </PixelPopover.Trigger>

            <PixelPopover.Content aria-labelledby="popover-title" className='text-xs font-mono text-retro-text'>
                <button
                    className='flex items-center gap-2 transition-colors hover:text-retro-red cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <Trash size={13} />
                    Delete
                </button>
            </PixelPopover.Content>
        </PixelPopover>
    )
}
