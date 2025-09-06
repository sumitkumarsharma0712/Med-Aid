import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import Sell from "./pages/Sell";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
