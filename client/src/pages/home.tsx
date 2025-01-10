import { TimelineView } from "@/components/timeline/timeline-view";
import { SearchFilter } from "@/components/timeline/search-filter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-8 px-4 bg-[url('https://images.unsplash.com/photo-1531685250784-7569952593d2')] bg-cover bg-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-4">
            Literary Timeline
          </h1>
          <p className="text-lg text-muted-foreground">
            Exploring the hidden gems of literary history
          </p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SearchFilter />
        <TimelineView events={events} />
      </main>
    </div>
  );
}
