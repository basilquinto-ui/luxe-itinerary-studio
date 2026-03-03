import { useState } from "react";
import { Search, Plane, Hotel, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useItinerary } from "@/context/ItineraryContext";
import type { ItineraryItem, ItemType } from "@/types/itinerary";

const mockResults: Omit<ItineraryItem, "markupPercent" | "finalPrice" | "locked">[] = [
  {
    id: "",
    type: "hotel",
    name: "The Ritz-Carlton, Bali",
    description: "Oceanfront suite with private pool and butler service.",
    location: "Nusa Dua, Bali",
    date: "2026-04-15",
    duration: "Per night",
    image: "",
    netPrice: 890,
  },
  {
    id: "",
    type: "flight",
    name: "First Class — Dubai to Tokyo",
    description: "Emirates First Class with private suite and shower spa.",
    location: "Dubai → Tokyo Narita",
    date: "2026-04-20",
    duration: "9h 45m",
    image: "",
    netPrice: 5400,
  },
  {
    id: "",
    type: "activity",
    name: "Private Helicopter Tour — Grand Canyon",
    description: "Exclusive sunset helicopter tour with champagne landing.",
    location: "Las Vegas, Nevada",
    date: "2026-05-01",
    duration: "4 hours",
    image: "",
    netPrice: 1200,
  },
];

const typeIcons: Record<ItemType, React.ReactNode> = {
  hotel: <Hotel className="h-4 w-4" />,
  flight: <Plane className="h-4 w-4" />,
  activity: <MapPin className="h-4 w-4" />,
  transfer: <Plane className="h-4 w-4 rotate-45" />,
};

export const SearchPanel = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults>([]);
  const [searching, setSearching] = useState(false);
  const { addItem } = useItinerary();

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    // Simulated search — replace with RapidAPI call via edge function
    setTimeout(() => {
      setResults(mockResults.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.type.includes(query.toLowerCase()) ||
        r.location.toLowerCase().includes(query.toLowerCase()) ||
        query.length > 0
      ));
      setSearching(false);
    }, 800);
  };

  const handleAdd = (result: typeof mockResults[0]) => {
    const item: ItineraryItem = {
      ...result,
      id: crypto.randomUUID(),
      markupPercent: 15,
      finalPrice: Math.round(result.netPrice * 1.15),
      locked: false,
      image: "",
    };
    addItem(item);
    setResults((prev) => prev.filter((r) => r !== result));
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
        Search Hotels & Flights
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Search powered by mock data. Connect RapidAPI via Lovable Cloud for live pricing.
      </p>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search destinations, hotels, flights..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={searching} className="bg-primary text-primary-foreground hover:bg-gold-dark">
          <Search className="h-4 w-4 mr-2" />
          {searching ? "Searching..." : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-md border border-border bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground">
                  {typeIcons[result.type]}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{result.name}</p>
                  <p className="text-xs text-muted-foreground">{result.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">
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
    </div>
  );
};
