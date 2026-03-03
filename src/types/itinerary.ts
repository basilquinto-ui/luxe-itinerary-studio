export type ItemType = "hotel" | "flight" | "activity" | "transfer";

export interface ItineraryItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  location: string;
  date: string;
  duration?: string;
  image: string;
  netPrice: number;
  markupPercent: number;
  finalPrice: number;
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
}
