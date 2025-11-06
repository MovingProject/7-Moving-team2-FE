"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/ui/nav/nav";
import { useInitAuth } from "@/utils/hook/auth/useInitAuth";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Persister } from "@tanstack/query-persist-client-core";

const queryClient = new QueryClient();

export default function NavProvider({ children }: { children: React.ReactNode }) {
  const [persister, setPersister] = useState<Persister | null>(null);

  useInitAuth();

  useEffect(() => {
    const asyncPersister = createAsyncStoragePersister({
      storage: window.localStorage,
    });
    setPersister(asyncPersister);
  }, []);

  if (!persister) return null;

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <Nav />
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
