import { Lock, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItinerary } from "@/context/ItineraryContext";

export const VoucherVault = () => {
  const { itinerary } = useItinerary();
  const isConfirmed = itinerary.paymentStatus === "confirmed";
  const hasVouchers = itinerary.vouchers.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-serif text-xl font-semibold text-foreground tracking-wide">
          Voucher Vault
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isConfirmed
            ? "Your travel vouchers are ready for download."
            : "Your vouchers will be available after payment confirmation."}
        </p>
      </div>

      {isConfirmed && hasVouchers ? (
        <div className="p-6 space-y-3">
          {itinerary.vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{voucher.name}</p>
                  <p className="text-xs text-muted-foreground">PDF Document</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a href={voucher.url} download={voucher.name}>
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      ) : isConfirmed && !hasVouchers ? (
        <div className="p-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No vouchers have been uploaded yet. Please contact your travel consultant.
          </p>
        </div>
      ) : (
        <div className="p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Vouchers Locked</p>
          <p className="text-xs text-muted-foreground">
            Complete your payment to unlock and download your travel vouchers.
          </p>
        </div>
      )}
    </div>
  );
};
