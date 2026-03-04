import { Check, X } from "lucide-react";

interface InclusionsExclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export const InclusionsExclusions = ({ inclusions, exclusions }: InclusionsExclusionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Inclusions */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-6 tracking-wide">
          {"What's Included"}
        </h3>
        <div className="h-px bg-primary/30 mb-6 w-12" />
        <ul className="space-y-4" role="list">
          {inclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Exclusions */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-6 tracking-wide">
          {"What's Not Included"}
        </h3>
        <div className="h-px bg-muted-foreground/20 mb-6 w-12" />
        <ul className="space-y-4" role="list">
          {exclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
                <X className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
