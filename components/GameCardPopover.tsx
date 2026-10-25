"use client";
import { QuestData } from '@/utils/types/quest-page';
import { PxlKitIcon } from '@pxlkit/core';
import { DotsMenu } from '@pxlkit/ui';
import { PixelPopover, useToast } from '@pxlkit/ui-kit'
import { Ellipsis, EllipsisVertical, Trash } from 'lucide-react';
import React, { useState } from 'react'

type GameCardPopoverProps = {
    gameId: string;
    onDelete: (gameId: string) => void;
}

export default function GameCardPopover({ gameId , onDelete}: GameCardPopoverProps ) {
    const [open, setOpen] = useState(false);
    const {toast} = useToast();

    const handleDelete = async() => {
        await onDelete(gameId);
        setOpen(false);
    }

    return (
        <PixelPopover open={open} onOpenChange={setOpen} align='end'>
            <PixelPopover.Trigger>
                <button
                    type="button"
                    className='cursor-pointer p-1 bg-retro-card/80 border border-retro-border transition-colors hover:border-retro-primary rounded-md'
                    onClick={(e) => e.stopPropagation()}
                    
                >
                    <Ellipsis size={15} className='text-retro-muted' />
                </button>
            </PixelPopover.Trigger>
            <PixelPopover.Content aria-labelledby="popover-title" className='text-xs font-mono text-retro-text'>
                <button
                    className='flex items-center gap-2 transition-colors hover:text-retro-red cursor-pointer'
                    onClick={(e)=> {
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
