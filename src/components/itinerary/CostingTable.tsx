import { useState } from "react";
import { Lock, Unlock, Trash2, Plane, Hotel, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useItinerary, calcBufferedNetUSD, calcClientPricePHP, calcVatOnMarkupPHP } from "@/context/ItineraryContext";
import type { ItemType } from "@/types/itinerary";

const typeLabels: Record<ItemType, { label: string; icon: React.ReactNode }> = {
  flight: { label: "Flight", icon: <Plane className="h-3.5 w-3.5" /> },
  hotel: { label: "Hotel", icon: <Hotel className="h-3.5 w-3.5" /> },
  activity: { label: "Activity", icon: <MapPin className="h-3.5 w-3.5" /> },
  transfer: { label: "Transfer", icon: <Plane className="h-3.5 w-3.5 rotate-45" /> },
};

const formatPHP = (n: number) => `₱${Math.round(n).toLocaleString()}`;
const formatUSD = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const CostingTable = () => {
  const { itinerary, updateItem, lockItem, removeItem, setGlobalMarkup, pricing } = useItinerary();
  const [globalMarkup, setLocalGlobalMarkup] = useState(15);
  const { exchangeRate, currencyBufferPercent } = itinerary;

  const handleGlobalMarkup = (val: number) => {
    setLocalGlobalMarkup(val);
    setGlobalMarkup(val);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Costing Breakdown
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Net prices in USD. Client prices auto-converted to PHP at {exchangeRate} with {currencyBufferPercent}% buffer.
          </p>
        </div>
        <div className="flex items-center gap-3 min-w-[240px]">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">Global Markup</span>
          <Slider
            value={[globalMarkup]}
            onValueChange={([val]) => handleGlobalMarkup(val)}
            min={0}
            max={40}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono font-semibold text-primary w-10 text-right">
            {globalMarkup}%
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-4 font-medium text-muted-foreground">Item</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Net (USD)</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Buffered (USD)</th>
              <th className="text-center p-4 font-medium text-muted-foreground w-40">Markup %</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Client (PHP)</th>
              <th className="text-right p-4 font-medium text-muted-foreground">VAT 12%</th>
              <th className="text-center p-4 font-medium text-muted-foreground w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itinerary.items.map((item) => {
              const bufferedUSD = calcBufferedNetUSD(item.netPrice, currencyBufferPercent);
              const clientPHP = calcClientPricePHP(item.netPrice, currencyBufferPercent, exchangeRate, item.markupPercent);
              const vatPHP = calcVatOnMarkupPHP(item.netPrice, currencyBufferPercent, exchangeRate, item.markupPercent);

              return (
                <tr key={item.id} className={`border-t border-border ${item.locked ? "bg-accent/30" : ""}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-accent text-accent-foreground">
                        {typeLabels[item.type].icon}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-foreground">
                    {formatUSD(item.netPrice)}
                  </td>
                  <td className="p-4 text-right font-mono text-muted-foreground">
                    {formatUSD(Math.round(bufferedUSD))}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[item.markupPercent]}
                        onValueChange={([val]) => updateItem(item.id, { markupPercent: val })}
                        min={0}
                        max={50}
                        step={1}
                        disabled={item.locked}
                        className="flex-1"
                      />
                      <span className="text-xs font-mono w-10 text-right text-foreground">
                        {item.markupPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-primary">
                    {formatPHP(clientPHP)}
                  </td>
                  <td className="p-4 text-right font-mono text-muted-foreground text-xs">
                    {formatPHP(vatPHP)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => lockItem(item.id)}
                        className="h-8 w-8"
                        title={item.locked ? "Unlock" : "Lock"}
                      >
                        {item.locked ? (
                          <Lock className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/20">
              <td colSpan={4} className="p-4 text-right text-xs text-muted-foreground uppercase tracking-wider">
                Currency Buffer ({currencyBufferPercent}% on net)
              </td>
              <td colSpan={3} className="p-4 text-right font-mono text-muted-foreground text-xs">
                +{formatPHP(pricing.totalBufferedNetPHP - pricing.totalNetUSD * exchangeRate)}
              </td>
            </tr>
            <tr className="border-t-2 border-primary/20 bg-muted/30">
              <td className="p-4 font-serif font-semibold text-foreground">Totals</td>
              <td className="p-4 text-right font-mono font-semibold text-foreground">
                {formatUSD(pricing.totalNetUSD)}
              </td>
              <td className="p-4 text-right font-mono text-muted-foreground">
                {formatUSD(Math.round(pricing.totalBufferedNetUSD))}
              </td>
              <td className="p-4 text-center text-xs text-muted-foreground">
                Avg: {itinerary.items.length > 0 ? Math.round(
                  itinerary.items.reduce((s, i) => s + i.markupPercent, 0) / itinerary.items.length
                ) : 0}%
              </td>
              <td className="p-4 text-right font-mono font-bold text-primary text-base">
                {formatPHP(pricing.totalClientPHP)}
              </td>
              <td className="p-4 text-right font-mono text-muted-foreground text-xs">
                {formatPHP(pricing.totalVatOnMarkupPHP)}
              </td>
              <td className="p-4" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
