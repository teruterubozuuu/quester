"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type PopoverContextType = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <PopoverContext.Provider value={{ openId, setOpenId }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function usePopover() {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
}
