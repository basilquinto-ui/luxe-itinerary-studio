import { useState } from "react";
import { CreditCard, Smartphone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PaymentMethod = "gcash" | "maya" | "card";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPHP: number;
  onConfirm: () => void;
}

const formatPHP = (n: number) => `₱${Math.round(n).toLocaleString()}`;

const methods: { key: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "gcash", label: "GCash", icon: <Smartphone className="h-5 w-5" />, desc: "Pay via GCash e-wallet" },
  { key: "maya", label: "Maya", icon: <Smartphone className="h-5 w-5" />, desc: "Pay via Maya e-wallet" },
  { key: "card", label: "Credit / Debit Card", icon: <CreditCard className="h-5 w-5" />, desc: "Visa, Mastercard, JCB" },
];

export const PaymentModal = ({ open, onOpenChange, totalPHP, onConfirm }: PaymentModalProps) => {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    if (!selected) return;
    setProcessing(true);
    // Simulate PayMongo checkout processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm();
        // Reset state for next open
        setSelected(null);
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    }, 2000);
  };

  const handleOpenChange = (v: boolean) => {
    if (processing) return;
    if (!v) {
      setSelected(null);
      setSuccess(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-xl">Complete Payment</DialogTitle>
            <Badge variant="outline" className="text-[10px] font-mono">PayMongo Simulated</Badge>
          </div>
          <DialogDescription>
            Select your preferred payment method to proceed.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-serif text-lg font-semibold text-foreground">Payment Confirmed</p>
            <p className="text-sm text-muted-foreground mt-1">Your vouchers are now available for download.</p>
          </div>
        ) : (
          <>
            <div className="py-2">
              <p className="text-center text-2xl font-serif font-bold text-foreground mb-6">
                {formatPHP(totalPHP)}
              </p>

              <div className="space-y-3">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setSelected(m.key)}
                    disabled={processing}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                      selected === m.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground">
                      {m.icon}
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={!selected || processing}
              className="w-full mt-2 h-12 text-base font-serif font-semibold"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPHP(totalPHP)}`
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
