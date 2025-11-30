"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};
