import { Link } from "react-router-dom";
import { ArrowLeft, Download, Send, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItinerary } from "@/context/ItineraryContext";
import { toast } from "sonner";
import heroImg from "@/assets/hero-santorini.jpg";

const ClientView = () => {
  const { itinerary, totalFinal } = useItinerary();

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleRequestBook = () => {
    toast.success("Booking request sent!", {
      description: `${itinerary.clientName}'s request for "${itinerary.title}" has been submitted. Your travel advisor will be in touch shortly.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin bar — hidden in print */}
      <div className="no-print sticky top-0 z-50 bg-card border-b border-border">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">Client Preview</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImg}
          alt={itinerary.destination}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/70" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-12 container max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-sm text-cream/80 mb-3 font-sans">
            {itinerary.agencyName}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-cream leading-tight mb-3">
            {itinerary.title}
          </h1>
          <p className="text-cream/80 text-lg font-sans">
            Prepared for {itinerary.clientName}
          </p>
          <div className="flex items-center gap-4 mt-4 text-cream/70 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(itinerary.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              {" — "}
              {new Date(itinerary.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Itinerary Items */}
      <main className="container max-w-5xl mx-auto py-12 px-4 md:px-6">
        <div className="space-y-16">
          {itinerary.items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary text-primary font-serif text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary font-medium">
                    {item.type} • {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {item.image && (
                  <div className="md:col-span-2 rounded-lg overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className={item.image ? "md:col-span-3" : "md:col-span-5"}>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
                    {item.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {item.location}
                    </span>
                    {item.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {index < itinerary.items.length - 1 && (
                <div className="mt-12 border-b border-border" />
              )}
            </div>
          ))}
        </div>

        {/* Total Package */}
        <div className="mt-20 pt-12 border-t-2 border-primary/20">
          <div className="text-center max-w-lg mx-auto">
            <p className="uppercase tracking-[0.2em] text-sm text-muted-foreground mb-2">
              Total Package Investment
            </p>
            <p className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-2">
              ${totalFinal.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              All-inclusive for {itinerary.items.length} experiences
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleRequestBook}
                className="gap-2 bg-primary text-primary-foreground hover:bg-gold-dark"
              >
                <Send className="h-4 w-4" />
                Request to Book
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border text-center">
          <p className="font-serif text-lg text-foreground">{itinerary.agencyName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Curated with care. Prices valid for 14 days from date of issue.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ClientView;
