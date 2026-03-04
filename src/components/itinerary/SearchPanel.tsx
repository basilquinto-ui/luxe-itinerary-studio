import { useState, useMemo } from "react";
import { Search, Plane, Hotel, MapPin, Star, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useItinerary } from "@/context/ItineraryContext";
import type { ItineraryItem, ItemType } from "@/types/itinerary";

// Richer mock data simulating RapidAPI Amadeus / Booking.com results
interface MockResult {
  type: ItemType;
  name: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  netPrice: number;
  image: string;
  provider: string;
  rating?: number;
  stars?: number;
  airline?: string;
  stops?: number;
  passengers?: number;
}

const allMockResults: MockResult[] = [
  // Flights
  {
    type: "flight",
    name: "Business Class — Manila to Malé",
    description: "Singapore Airlines via Changi. Business class with lie-flat seats, lounge access, priority boarding.",
    location: "Manila (MNL) → Malé (MLE)",
    date: "2026-04-15",
    duration: "12h 20m (1 stop)",
    netPrice: 2850,
    image: "",
    provider: "Amadeus GDS",
    airline: "Singapore Airlines",
    stops: 1,
  },
  {
    type: "flight",
    name: "First Class — Dubai to Tokyo",
    description: "Emirates First Class with private suite, shower spa, and onboard lounge.",
    location: "Dubai (DXB) → Tokyo Narita (NRT)",
    date: "2026-04-20",
    duration: "9h 45m (direct)",
    netPrice: 5400,
    image: "",
    provider: "Amadeus GDS",
    airline: "Emirates",
    stops: 0,
  },
  {
    type: "flight",
    name: "Premium Economy — London to Bali",
    description: "Qatar Airways via Doha. Extra legroom, premium dining, priority baggage.",
    location: "London (LHR) → Bali (DPS)",
    date: "2026-04-18",
    duration: "16h 40m (1 stop)",
    netPrice: 1750,
    image: "",
    provider: "Amadeus GDS",
    airline: "Qatar Airways",
    stops: 1,
  },
  // Hotels
  {
    type: "hotel",
    name: "The Ritz-Carlton, Bali",
    description: "Oceanfront suite with private pool, daily breakfast, and personal butler service.",
    location: "Nusa Dua, Bali",
    date: "2026-04-15",
    duration: "Per night",
    netPrice: 890,
    image: "",
    provider: "Booking.com",
    stars: 5,
    rating: 9.2,
  },
  {
    type: "hotel",
    name: "Aman Tokyo",
    description: "Deluxe room with panoramic city views, onsen access, and complimentary minibar.",
    location: "Otemachi, Tokyo",
    date: "2026-04-20",
    duration: "Per night",
    netPrice: 1200,
    image: "",
    provider: "Booking.com",
    stars: 5,
    rating: 9.5,
  },
  {
    type: "hotel",
    name: "Soneva Fushi — Beach Villa",
    description: "Private beach villa with infinity pool, personal butler, all-inclusive gourmet dining.",
    location: "Baa Atoll, Maldives",
    date: "2026-04-15",
    duration: "Per night",
    netPrice: 1700,
    image: "",
    provider: "Booking.com",
    stars: 5,
    rating: 9.7,
  },
  // Activities
  {
    type: "activity",
    name: "Private Helicopter Tour — Grand Canyon",
    description: "Exclusive sunset flight with champagne landing on the canyon floor.",
    location: "Las Vegas, Nevada",
    date: "2026-05-01",
    duration: "4 hours",
    netPrice: 1200,
    image: "",
    provider: "Viator",
    rating: 4.9,
  },
  {
    type: "activity",
    name: "Private Island Snorkeling Safari",
    description: "Full-day catamaran tour with marine biologist guide, snorkel gear, and gourmet lunch.",
    location: "Baa Atoll, Maldives",
    date: "2026-04-17",
    duration: "6 hours",
    netPrice: 680,
    image: "",
    provider: "Viator",
    rating: 4.8,
  },
  {
    type: "activity",
    name: "Exclusive Sake Tasting Tour — Kyoto",
    description: "Visit 3 traditional breweries with a certified sake sommelier. Includes lunch.",
    location: "Fushimi, Kyoto",
    date: "2026-04-22",
    duration: "5 hours",
    netPrice: 320,
    image: "",
    provider: "GetYourGuide",
    rating: 4.7,
  },
  // Transfers
  {
    type: "transfer",
    name: "Seaplane Transfer — Malé to Resort",
    description: "Scenic seaplane over turquoise atolls with aerial photography opportunities.",
    location: "Malé → Baa Atoll",
    date: "2026-04-15",
    duration: "35 min",
    netPrice: 600,
    image: "",
    provider: "Trans Maldivian",
    passengers: 2,
  },
  {
    type: "transfer",
    name: "Private Limousine — Airport to Hotel",
    description: "Mercedes S-Class with meet-and-greet at arrivals, complimentary water and WiFi.",
    location: "Narita Airport → Central Tokyo",
    date: "2026-04-20",
    duration: "75 min",
    netPrice: 280,
    image: "",
    provider: "Blacklane",
    passengers: 2,
  },
];

const typeIcons: Record<ItemType, React.ReactNode> = {
  hotel: <Hotel className="h-4 w-4" />,
  flight: <Plane className="h-4 w-4" />,
  activity: <MapPin className="h-4 w-4" />,
  transfer: <Plane className="h-4 w-4 rotate-45" />,
};

const categoryTabs: { key: "all" | ItemType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "flight", label: "Flights" },
  { key: "hotel", label: "Hotels" },
  { key: "activity", label: "Activities" },
  { key: "transfer", label: "Transfers" },
];

export const SearchPanel = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | ItemType>("all");
  const [results, setResults] = useState<MockResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { addItem } = useItinerary();

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setHasSearched(true);
    // Simulated search delay — in production, this calls RapidAPI via an edge function / serverless proxy
    setTimeout(() => {
      const q = query.toLowerCase();
      setResults(
        allMockResults.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.type.includes(q) ||
            r.location.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            q.length > 0
        )
      );
      setSearching(false);
    }, 800);
  };

  const filteredResults = useMemo(
    () => (activeTab === "all" ? results : results.filter((r) => r.type === activeTab)),
    [results, activeTab]
  );

  const handleAdd = (result: MockResult) => {
    const item: ItineraryItem = {
      id: crypto.randomUUID(),
      type: result.type,
      name: result.name,
      description: result.description,
      location: result.location,
      date: result.date,
      duration: result.duration,
      image: result.image,
      netPrice: result.netPrice,
      markupPercent: 15,
      finalPrice: Math.round(result.netPrice * 1.15),
      locked: false,
    };
    addItem(item);
    setResults((prev) => prev.filter((r) => r !== result));
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Source Hotels, Flights & Activities
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Simulated data from Amadeus / Booking.com / Viator APIs.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono shrink-0">Simulated Data</Badge>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search destinations, hotels, flights, activities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={searching} className="bg-primary text-primary-foreground">
          <Search className="h-4 w-4 mr-2" />
          {searching ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Category tabs */}
      {hasSearched && (
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {categoryTabs.map((tab) => {
            const count = tab.key === "all" ? results.length : results.filter((r) => r.type === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((result, i) => (
            <div
              key={i}
              className="flex items-start justify-between p-4 rounded-md border border-border bg-background hover:bg-accent/50 transition-colors gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-accent-foreground shrink-0">
                  {typeIcons[result.type]}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">{result.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{result.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">{result.location}</span>
                    {result.duration && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {result.duration}
                      </span>
                    )}
                    {result.stars && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        {Array.from({ length: result.stars }).map((_, si) => (
                          <Star key={si} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    )}
                    {result.rating && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{result.rating}</Badge>
                    )}
                    {result.airline && (
                      <span className="text-xs text-muted-foreground">{result.airline}</span>
                    )}
                    {result.passengers && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {result.passengers} pax
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono">via {result.provider}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold font-mono text-foreground">
                  ${result.netPrice.toLocaleString()}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdd(result)}
                  className="text-xs"
                >
                  + Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSearched && !searching && filteredResults.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No results found for the current filter. Try a different search term or category.
        </p>
      )}
    </div>
  );
};
