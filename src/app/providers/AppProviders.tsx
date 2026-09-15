import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/features/auth";

import { QueryProvider } from "./QueryProvider";
import { StoreProvider } from "./StoreProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </StoreProvider>
  );
};
