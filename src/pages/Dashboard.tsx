import { Link } from "react-router-dom";
import { Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchPanel } from "@/components/itinerary/SearchPanel";
import { CostingTable } from "@/components/itinerary/CostingTable";
import { useItinerary } from "@/context/ItineraryContext";

const Dashboard = () => {
  const { itinerary, updateAgencyName } = useItinerary();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-xl font-bold text-foreground">
              Itinerary Builder
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/client">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview Client View
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Itinerary Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agency Brand Name</label>
            <Input
              value={itinerary.agencyName}
              onChange={(e) => updateAgencyName(e.target.value)}
              className="mt-1 font-serif"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Itinerary Title</label>
            <p className="mt-1 font-serif text-foreground font-medium">{itinerary.title}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</label>
            <p className="mt-1 text-foreground">{itinerary.clientName}</p>
          </div>
        </div>

        {/* Search */}
        <SearchPanel />

        {/* Costing Table */}
        <CostingTable />

        {/* Profit Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Net Cost</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              ${itinerary.items.reduce((s, i) => s + i.netPrice, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Profit</p>
            <p className="font-serif text-2xl font-bold text-primary">
              ${(
                itinerary.items.reduce((s, i) => s + i.finalPrice, 0) -
                itinerary.items.reduce((s, i) => s + i.netPrice, 0)
              ).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Client Sees</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              ${itinerary.items.reduce((s, i) => s + i.finalPrice, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
