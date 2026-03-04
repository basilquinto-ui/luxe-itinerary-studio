import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useItinerary } from "@/context/ItineraryContext";
import { PaymentModal } from "./PaymentModal";

const formatPHP = (n: number) => `₱${Math.round(n).toLocaleString()}`;

const TERMS_AND_CONDITIONS = `1. Booking Confirmation & Payment
All bookings are confirmed upon receipt of full payment. A non-refundable deposit may be required to secure certain services.

2. Cancellation Policy
Cancellations made 30 days or more before the departure date are eligible for a full refund minus any non-refundable deposits. Cancellations within 30 days of departure may incur penalties up to 100% of the package cost, depending on supplier terms.

3. Travel Documents
It is the client's responsibility to ensure valid passports, visas, and any required travel documentation. The agency is not liable for denied boarding or entry due to insufficient documentation.

4. Travel Insurance
Travel insurance is strongly recommended but not included unless specifically listed under "What's Included." The agency is not responsible for losses due to trip interruption, medical emergencies, or baggage issues.

5. Pricing & Currency
All client-facing prices are quoted in Philippine Pesos (PHP). Exchange rates are locked at the time of quotation and may differ from prevailing rates at the time of travel. A currency buffer is applied to protect against fluctuation.

6. Changes & Amendments
Any changes to the itinerary after confirmation may be subject to additional fees. Changes are subject to availability and supplier terms.

7. Liability
The agency acts as an intermediary between the client and third-party suppliers (airlines, hotels, tour operators). The agency is not liable for acts of God, supplier insolvency, or service disruptions beyond its control.

8. Privacy
Personal information collected is used solely for the purpose of arranging travel services and will not be shared with third parties except as necessary to fulfill the booking.`;

export const PaymentSection = () => {
  const { itinerary, setTermsAccepted, setPaymentStatus, pricing } = useItinerary();
  const [modalOpen, setModalOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const isConfirmed = itinerary.paymentStatus === "confirmed";

  const handleConfirmPayment = () => {
    setPaymentStatus("confirmed");
  };

  return (
    <div className="space-y-6">
      {/* Total Package Investment */}
      <div className="text-center py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-sans">
          Total Package Investment
        </p>
        <p className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          {formatPHP(pricing.totalClientPHP)}
        </p>
        <div className="h-px bg-primary/30 w-16 mx-auto mt-6" />
      </div>

      {/* Terms & Conditions */}
      {!isConfirmed && (
        <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Terms & Conditions</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${termsOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-5 rounded-lg border border-border bg-muted/20 max-h-64 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {TERMS_AND_CONDITIONS}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Checkbox + Pay button */}
      {!isConfirmed ? (
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={itinerary.termsAccepted}
              onCheckedChange={(v) => setTermsAccepted(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-relaxed">
              I have read and agree to the Terms & Conditions of this travel package.
            </span>
          </label>

          <Button
            onClick={() => setModalOpen(true)}
            disabled={!itinerary.termsAccepted}
            className="w-full h-14 text-base font-serif font-semibold tracking-wide"
            size="lg"
          >
            Pay Now — {formatPHP(pricing.totalClientPHP)}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Secure checkout powered by PayMongo. Your payment information is encrypted.
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-serif text-lg font-semibold text-foreground">Payment Confirmed</p>
          <p className="text-sm text-muted-foreground mt-1">Thank you for your booking. Your vouchers are available below.</p>
        </div>
      )}

      <PaymentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        totalPHP={pricing.totalClientPHP}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
};
