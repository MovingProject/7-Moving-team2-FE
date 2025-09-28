"use client";
import type { Metadata } from "next";
import "../styles/globals.css";
import Nav from "@/components/ui/nav/nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactNode, useState, useEffect } from "react";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [persister, setPersister] = useState<any>(null);
  useEffect(() => {
    const asyncPersister = createAsyncStoragePersister({
      storage: window.localStorage,
    });
    setPersister(asyncPersister);
  }, []);

  return (
    <html lang="ko">
      <body>
        {persister ? (
          <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
            <Nav />
            {children}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
          </PersistQueryClientProvider>
        ) : (
          <div></div>
        )}
      </body>
    </html>
  );
}
