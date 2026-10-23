import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}

          <Toaster position="top-right" richColors closeButton />

          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export { AppProviders };
