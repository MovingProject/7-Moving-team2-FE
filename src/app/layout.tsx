"use client";

import Script from "next/script";
import Nav from "@/components/ui/nav/nav";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Persister } from "@tanstack/query-persist-client-core";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { useInitAuth } from "@/utils/hook/auth/useInitAuth";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [persister, setPersister] = useState<Persister | null>(null);

  useInitAuth();

  useEffect(() => {
    const asyncPersister = createAsyncStoragePersister({
      storage: window.localStorage,
    });
    setPersister(asyncPersister);
  }, []);

  console.log("🌍 ENV Kakao key:", process.env.NEXT_PUBLIC_KAKAO_JS_KEY);

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
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
