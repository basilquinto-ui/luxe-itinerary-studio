import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Settings, Plus, X, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchPanel } from "@/components/itinerary/SearchPanel";
import { CostingTable } from "@/components/itinerary/CostingTable";
import { useItinerary } from "@/context/ItineraryContext";
import type { Voucher } from "@/types/itinerary";

const formatPHP = (n: number) => `₱${Math.round(n).toLocaleString()}`;

const Dashboard = () => {
  const {
    itinerary,
    updateAgencyName,
    setExchangeRate,
    setCurrencyBuffer,
    updateInclusions,
    updateExclusions,
    addVoucher,
    removeVoucher,
    pricing,
  } = useItinerary();

  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddInclusion = () => {
    const text = newInclusion.trim();
    if (!text) return;
    updateInclusions([...itinerary.inclusions, text]);
    setNewInclusion("");
  };

  const handleAddExclusion = () => {
    const text = newExclusion.trim();
    if (!text) return;
    updateExclusions([...itinerary.exclusions, text]);
    setNewExclusion("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const voucher: Voucher = {
        id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        file,
        url: URL.createObjectURL(file),
      };
      addVoucher(voucher);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        {/* Itinerary Meta + Pricing Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Exchange Rate (USD/PHP)</label>
            <Input
              type="number"
              value={itinerary.exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value) || 1)}
              className="mt-1 font-mono"
              min={1}
              step={0.5}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Currency Buffer %</label>
            <Input
              type="number"
              value={itinerary.currencyBufferPercent}
              onChange={(e) => setCurrencyBuffer(Number(e.target.value) || 0)}
              className="mt-1 font-mono"
              min={0}
              max={20}
              step={0.5}
            />
          </div>
        </div>

        {/* Search */}
        <SearchPanel />

        {/* Costing Table */}
        <CostingTable />

        {/* Profit Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net Cost (USD)</p>
            <p className="font-serif text-xl font-bold text-foreground">
              ${Math.round(pricing.totalNetUSD).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Client Total (PHP)</p>
            <p className="font-serif text-xl font-bold text-foreground">
              {formatPHP(pricing.totalClientPHP)}
            </p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gross Profit</p>
            <p className="font-serif text-xl font-bold text-primary">
              {formatPHP(pricing.totalGrossProfitPHP)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VAT Payable</p>
            <p className="font-serif text-xl font-bold text-destructive">
              {formatPHP(pricing.totalVatOnMarkupPHP)}
            </p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net Profit</p>
            <p className="font-serif text-xl font-bold text-primary">
              {formatPHP(pricing.totalNetProfitPHP)}
            </p>
          </div>
        </div>

        {/* Inclusions & Exclusions Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inclusions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Inclusions</h3>
            <div className="space-y-2 mb-4">
              {itinerary.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <span className="text-sm text-foreground">{item}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    onClick={() => updateInclusions(itinerary.inclusions.filter((_, i) => i !== idx))}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Add inclusion..."
                onKeyDown={(e) => e.key === "Enter" && handleAddInclusion()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddInclusion} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>

          {/* Exclusions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Exclusions</h3>
            <div className="space-y-2 mb-4">
              {itinerary.exclusions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <span className="text-sm text-foreground">{item}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    onClick={() => updateExclusions(itinerary.exclusions.filter((_, i) => i !== idx))}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="Add exclusion..."
                onKeyDown={(e) => e.key === "Enter" && handleAddExclusion()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddExclusion} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Voucher Vault Upload */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Voucher Vault</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload PDF vouchers for the client. These become downloadable after payment confirmation.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {itinerary.vouchers.map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{v.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => removeVoucher(v.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="voucher-upload"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload PDF Vouchers
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
