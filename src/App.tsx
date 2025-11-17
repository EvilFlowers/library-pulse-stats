import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookSearch from "./pages/BookSearch";
import BookBorrow from "./pages/BookBorrow";
import BookRenewal from "./pages/BookRenewal";
import BookReturn from "./pages/BookReturn";
import PurchaseRequest from "./pages/PurchaseRequest";
import BookRating from "./pages/BookRating";
import AutoInventory from "./pages/AutoInventory";
import ResourceReview from "./pages/ResourceReview";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/borrow" element={<BookBorrow />} />
          <Route path="/renewal" element={<BookRenewal />} />
          <Route path="/return" element={<BookReturn />} />
          <Route path="/purchase" element={<PurchaseRequest />} />
          <Route path="/rating" element={<BookRating />} />
          <Route path="/inventory" element={<AutoInventory />} />
          <Route path="/review" element={<ResourceReview />} />
          <Route path="/statistics" element={<Statistics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
