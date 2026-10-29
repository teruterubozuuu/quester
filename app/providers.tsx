// app/providers.tsx
"use client";

import { PopoverProvider } from "@/contexts/PopoverContext";
import {
  PxlKitSurfaceProvider,
  PxlKitToastProvider,
} from "@pxlkit/ui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PxlKitSurfaceProvider surface="pixel">
      <PopoverProvider>
              <PxlKitToastProvider>{children}</PxlKitToastProvider>
      </PopoverProvider>
    </PxlKitSurfaceProvider>
  );
}