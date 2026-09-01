import type { PropsWithChildren } from "react";

import { QueryProvider } from "./QueryProvider";
import { StoreProvider } from "./StoreProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <QueryProvider>{children}</QueryProvider>
    </StoreProvider>
  );
};
