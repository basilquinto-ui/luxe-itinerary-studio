export type ItemType = "hotel" | "flight" | "activity" | "transfer";

export type PaymentStatus = "pending" | "processing" | "confirmed";

export interface Voucher {
  id: string;
  name: string;
  file: File;
  url: string; // object URL for preview/download
}

export interface ItineraryItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  location: string;
  date: string;
  duration?: string;
  image: string;
  netPrice: number; // USD
  markupPercent: number;
  finalPrice: number; // legacy field kept for compat — use context helpers for PHP pricing
  locked: boolean;
}

export interface Itinerary {
  id: string;
  title: string;
  clientName: string;
  destination: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  agencyName: string;
  exchangeRate: number; // USD → PHP
  currencyBufferPercent: number; // default 3
  paymentStatus: PaymentStatus;
  termsAccepted: boolean;
  inclusions: string[];
  exclusions: string[];
  vouchers: Voucher[];
}
