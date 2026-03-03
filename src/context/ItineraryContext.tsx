import React, { createContext, useContext, useState, useCallback } from "react";
import type { Itinerary, ItineraryItem } from "@/types/itinerary";

import maldivesImg from "@/assets/maldives-resort.jpg";
import swissImg from "@/assets/swiss-alps.jpg";
import dubaiImg from "@/assets/dubai-skyline.jpg";
import santoriniImg from "@/assets/hero-santorini.jpg";

const defaultItems: ItineraryItem[] = [
  {
    id: "1",
    type: "flight",
    name: "Business Class — London to Malé",
    description: "Emirates A380 Business Class with premium lounge access, gourmet dining, and lie-flat seats.",
    location: "London Heathrow → Malé International",
    date: "2026-04-15",
    duration: "10h 30m",
    image: dubaiImg,
    netPrice: 3200,
    markupPercent: 15,
    finalPrice: 3680,
    locked: false,
  },
  {
    id: "2",
    type: "hotel",
    name: "Soneva Fushi — Beach Villa with Pool",
    description: "5 nights in a private beach villa with infinity pool, personal butler, and all-inclusive dining.",
    location: "Baa Atoll, Maldives",
    date: "2026-04-15",
    duration: "5 nights",
    image: maldivesImg,
    netPrice: 8500,
    markupPercent: 12,
    finalPrice: 9520,
    locked: false,
  },
  {
    id: "3",
    type: "activity",
    name: "Private Sunset Dolphin Cruise",
    description: "Exclusive catamaran cruise with champagne service, watching spinner dolphins at golden hour.",
    location: "Baa Atoll, Maldives",
    date: "2026-04-17",
    duration: "3 hours",
    image: santoriniImg,
    netPrice: 450,
    markupPercent: 20,
    finalPrice: 540,
    locked: false,
  },
  {
    id: "4",
    type: "transfer",
    name: "Seaplane Transfer — Malé to Resort",
    description: "Scenic seaplane transfer over turquoise atolls with aerial views of the island chain.",
    location: "Malé → Baa Atoll",
    date: "2026-04-15",
    duration: "35 min",
    image: swissImg,
    netPrice: 600,
    markupPercent: 10,
    finalPrice: 660,
    locked: false,
  },
];

const defaultItinerary: Itinerary = {
  id: "itin-001",
  title: "Maldives Luxury Escape",
  clientName: "Mr. & Mrs. Anderson",
  destination: "Maldives",
  startDate: "2026-04-15",
  endDate: "2026-04-20",
  items: defaultItems,
  agencyName: "Your Agency Name",
};

interface ItineraryContextType {
  itinerary: Itinerary;
  updateItem: (id: string, updates: Partial<ItineraryItem>) => void;
  lockItem: (id: string) => void;
  removeItem: (id: string) => void;
  addItem: (item: ItineraryItem) => void;
  updateAgencyName: (name: string) => void;
  totalNet: number;
  totalFinal: number;
}

const ItineraryContext = createContext<ItineraryContextType | null>(null);

export const useItinerary = () => {
  const ctx = useContext(ItineraryContext);
  if (!ctx) throw new Error("useItinerary must be used within ItineraryProvider");
  return ctx;
};

export const ItineraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itinerary, setItinerary] = useState<Itinerary>(defaultItinerary);

  const updateItem = useCallback((id: string, updates: Partial<ItineraryItem>) => {
    setItinerary((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id || item.locked) return item;
        const updated = { ...item, ...updates };
        if ("netPrice" in updates || "markupPercent" in updates) {
          updated.finalPrice = Math.round(updated.netPrice * (1 + updated.markupPercent / 100));
        }
        return updated;
      }),
    }));
  }, []);

  const lockItem = useCallback((id: string) => {
    setItinerary((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, locked: !item.locked } : item
      ),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItinerary((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const addItem = useCallback((item: ItineraryItem) => {
    setItinerary((prev) => ({ ...prev, items: [...prev.items, item] }));
  }, []);

  const updateAgencyName = useCallback((name: string) => {
    setItinerary((prev) => ({ ...prev, agencyName: name }));
  }, []);

  const totalNet = itinerary.items.reduce((sum, item) => sum + item.netPrice, 0);
  const totalFinal = itinerary.items.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <ItineraryContext.Provider
      value={{ itinerary, updateItem, lockItem, removeItem, addItem, updateAgencyName, totalNet, totalFinal }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
