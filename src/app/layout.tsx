"use client";
import type { Metadata } from "next";
import "../styles/globals.css";
import Nav from "@/components/ui/nav/nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryClientProvider client={queryClient}>
          <Nav />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
