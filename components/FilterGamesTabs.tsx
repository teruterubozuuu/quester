import { PxlKitIcon } from '@pxlkit/core';
import { CheckCircle, XCircle } from '@pxlkit/feedback';
import { Crown } from '@pxlkit/gamification';
import { Pause, Play } from '@pxlkit/ui';
import { PixelTabs, TabItem } from '@pxlkit/ui-kit'
import React from 'react'

type FilterGamesTabsProps = {
  value: string;
  onChange: (value: string) => void;
}

export default function FilterGamesTabs({value, onChange}: FilterGamesTabsProps) {
    const ITEMS: TabItem[] = [
        {
          id: "all", 
          label: "All", 
          content: null
        },
        {id: "backlog", icon: <PxlKitIcon icon={Pause} size={15}/>, label: "Backlog", content: null},
        {id: "playing", icon: <PxlKitIcon icon={Play} size={15}/>, label: "Playing", content: null},
        {id: "completed", icon: <PxlKitIcon icon={CheckCircle} size={15}/>, label: "Completed", content: null},
        {id: "dropped",icon: <PxlKitIcon icon={XCircle} size={15}/>, label: "Dropped", content: null},
    ]
  return (
    <PixelTabs 
        items={ITEMS} 
        value={value}
        onChange={onChange}
        defaultValue="all"
        ariaLabel="Filter games by status"
    />
  )
}
