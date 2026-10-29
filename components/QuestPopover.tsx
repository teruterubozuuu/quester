"use client";
import { PixelAlertDialog } from '@pxlkit/ui-kit';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { usePopover } from '@/contexts/PopoverContext';

type QuestPopoverProps = {
  questId: string;
  onDelete: (questId: string) => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onEdit: (questId: string) => void;
}

export default function QuestPopover({ questId, onDelete, onEdit, setIsEditing}: QuestPopoverProps) {
  const { openId, setOpenId } = usePopover();
  const open = openId === questId;
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the popover when the user clicks outside of it
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpenId]);

  const handleDelete = async () => {
    await onDelete(questId);
    setOpenId(null);
  }

  const handleEdit = async () => {
    await onEdit(questId);
    setIsEditing(true);
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        className='hover:bg-retro-card cursor-pointer p-1 rounded-md'
        onClick={(e) => {
          e.stopPropagation();
          setOpenId(open ? null : questId);
        }}
      >
        <Ellipsis size={15} />
      </button>

      {open &&
        <div className='absolute bg-retro-surface border border-retro-border-strong mt-2 rounded-md right-0'>
          <button onClick={handleEdit} className='font-mono flex items-center gap-2 cursor-pointer w-full hover:text-retro-cyan hover:bg-retro-card py-2 px-4'><Pencil size={13} /> Edit</button>
          <button
            onClick={() => {
              setOpenAlertDialog(true);
              setOpenId(null); // close the menu when opening the dialog
            }}
            className='font-mono flex items-center gap-2 cursor-pointer w-full hover:text-retro-red hover:bg-retro-card py-2 px-4'
          >
            <Trash size={13} /> Delete
          </button>
        </div>
      }

      <PixelAlertDialog
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        title="Delete Quest?"
        description="This action cannot be undone."
        actionLabel='Delete'
        destructive
        onAction={() => handleDelete()}
      />
    </div>
  )
}