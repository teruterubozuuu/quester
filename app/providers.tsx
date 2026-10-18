// app/providers.tsx
"use client";

import {
  PxlKitSurfaceProvider,
  PxlKitToastProvider,
} from "@pxlkit/ui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PxlKitSurfaceProvider surface="pixel">
      <PxlKitToastProvider>{children}</PxlKitToastProvider>
    </PxlKitSurfaceProvider>
  );
}