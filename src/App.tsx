import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItineraryProvider } from "@/context/ItineraryContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientView from "./pages/ClientView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ItineraryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client" element={<ClientView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ItineraryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
