import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Itinerary, ItineraryItem, PaymentStatus, Voucher } from "@/types/itinerary";

import maldivesImg from "@/assets/maldives-resort.jpg";
import swissImg from "@/assets/swiss-alps.jpg";
import dubaiImg from "@/assets/dubai-skyline.jpg";
import santoriniImg from "@/assets/hero-santorini.jpg";

// --- Pricing helpers ---
export function calcBufferedNetUSD(netPrice: number, bufferPercent: number): number {
  return netPrice * (1 + bufferPercent / 100);
}
export function calcBufferedNetPHP(netPrice: number, bufferPercent: number, exchangeRate: number): number {
  return calcBufferedNetUSD(netPrice, bufferPercent) * exchangeRate;
}
export function calcMarkupAmountPHP(netPrice: number, bufferPercent: number, exchangeRate: number, markupPercent: number): number {
  return calcBufferedNetPHP(netPrice, bufferPercent, exchangeRate) * (markupPercent / 100);
}
export function calcVatOnMarkupPHP(netPrice: number, bufferPercent: number, exchangeRate: number, markupPercent: number): number {
  return calcMarkupAmountPHP(netPrice, bufferPercent, exchangeRate, markupPercent) * 0.12;
}
export function calcClientPricePHP(netPrice: number, bufferPercent: number, exchangeRate: number, markupPercent: number): number {
  const bufferedPHP = calcBufferedNetPHP(netPrice, bufferPercent, exchangeRate);
  const markup = calcMarkupAmountPHP(netPrice, bufferPercent, exchangeRate, markupPercent);
  return bufferedPHP + markup;
}

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
  exchangeRate: 56,
  currencyBufferPercent: 3,
  paymentStatus: "pending",
  termsAccepted: false,
  inclusions: [
    "Business class round-trip flights",
    "5 nights luxury beach villa accommodation",
    "All meals and premium beverages",
    "Private seaplane transfers",
    "Sunset dolphin cruise experience",
    "Personal butler service",
  ],
  exclusions: [
    "Travel insurance",
    "Visa fees (if applicable)",
    "Spa treatments and wellness packages",
    "Additional excursions not listed",
    "Gratuities and personal expenses",
  ],
  vouchers: [],
};

interface PricingSummary {
  totalNetUSD: number;
  totalBufferedNetUSD: number;
  totalBufferedNetPHP: number;
  totalMarkupPHP: number;
  totalVatOnMarkupPHP: number;
  totalClientPHP: number;
  totalGrossProfitPHP: number;
  totalNetProfitPHP: number;
}

interface ItineraryContextType {
  itinerary: Itinerary;
  updateItem: (id: string, updates: Partial<ItineraryItem>) => void;
  lockItem: (id: string) => void;
  removeItem: (id: string) => void;
  addItem: (item: ItineraryItem) => void;
  updateAgencyName: (name: string) => void;
  setExchangeRate: (rate: number) => void;
  setCurrencyBuffer: (percent: number) => void;
  setGlobalMarkup: (percent: number) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setTermsAccepted: (accepted: boolean) => void;
  updateInclusions: (inclusions: string[]) => void;
  updateExclusions: (exclusions: string[]) => void;
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (id: string) => void;
  pricing: PricingSummary;
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

  const setExchangeRate = useCallback((rate: number) => {
    setItinerary((prev) => ({ ...prev, exchangeRate: rate }));
  }, []);

  const setCurrencyBuffer = useCallback((percent: number) => {
    setItinerary((prev) => ({ ...prev, currencyBufferPercent: percent }));
  }, []);

  const setGlobalMarkup = useCallback((percent: number) => {
    setItinerary((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.locked ? item : { ...item, markupPercent: percent, finalPrice: Math.round(item.netPrice * (1 + percent / 100)) }
      ),
    }));
  }, []);

  const setPaymentStatus = useCallback((status: PaymentStatus) => {
    setItinerary((prev) => ({ ...prev, paymentStatus: status }));
  }, []);

  const setTermsAccepted = useCallback((accepted: boolean) => {
    setItinerary((prev) => ({ ...prev, termsAccepted: accepted }));
  }, []);

  const updateInclusions = useCallback((inclusions: string[]) => {
    setItinerary((prev) => ({ ...prev, inclusions }));
  }, []);

  const updateExclusions = useCallback((exclusions: string[]) => {
    setItinerary((prev) => ({ ...prev, exclusions }));
  }, []);

  const addVoucher = useCallback((voucher: Voucher) => {
    setItinerary((prev) => ({ ...prev, vouchers: [...prev.vouchers, voucher] }));
  }, []);

  const removeVoucher = useCallback((id: string) => {
    setItinerary((prev) => {
      const removed = prev.vouchers.find((v) => v.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return { ...prev, vouchers: prev.vouchers.filter((v) => v.id !== id) };
    });
  }, []);

  const totalNet = itinerary.items.reduce((sum, item) => sum + item.netPrice, 0);
  const totalFinal = itinerary.items.reduce((sum, item) => sum + item.finalPrice, 0);

  const pricing: PricingSummary = useMemo(() => {
    const { exchangeRate, currencyBufferPercent, items } = itinerary;
    let totalNetUSD = 0;
    let totalBufferedNetUSD = 0;
    let totalBufferedNetPHP = 0;
    let totalMarkupPHP = 0;
    let totalVatOnMarkupPHP = 0;
    let totalClientPHP = 0;

    for (const item of items) {
      const netUSD = item.netPrice;
      const bufferedUSD = calcBufferedNetUSD(netUSD, currencyBufferPercent);
      const bufferedPHP = bufferedUSD * exchangeRate;
      const markupPHP = calcMarkupAmountPHP(netUSD, currencyBufferPercent, exchangeRate, item.markupPercent);
      const vatPHP = markupPHP * 0.12;
      const clientPHP = bufferedPHP + markupPHP;

      totalNetUSD += netUSD;
      totalBufferedNetUSD += bufferedUSD;
      totalBufferedNetPHP += bufferedPHP;
      totalMarkupPHP += markupPHP;
      totalVatOnMarkupPHP += vatPHP;
      totalClientPHP += clientPHP;
    }

    return {
      totalNetUSD,
      totalBufferedNetUSD,
      totalBufferedNetPHP,
      totalMarkupPHP,
      totalVatOnMarkupPHP,
      totalClientPHP,
      totalGrossProfitPHP: totalMarkupPHP,
      totalNetProfitPHP: totalMarkupPHP - totalVatOnMarkupPHP,
    };
  }, [itinerary]);

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        updateItem,
        lockItem,
        removeItem,
        addItem,
        updateAgencyName,
        setExchangeRate,
        setCurrencyBuffer,
        setGlobalMarkup,
        setPaymentStatus,
        setTermsAccepted,
        updateInclusions,
        updateExclusions,
        addVoucher,
        removeVoucher,
        pricing,
        totalNet,
        totalFinal,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
