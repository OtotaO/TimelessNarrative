import { TimelineView } from "@/components/timeline/timeline-view";
import { SearchFilter } from "@/components/timeline/search-filter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { SelectEvent } from "@db/schema";

export default function Home() {
  const { data: events, isLoading } = useQuery<SelectEvent[]>({
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-6xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Literary Timeline
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Journey through time exploring lesser-known but significant moments in literary history. 
            Discover hidden gems and contribute your own historical findings.
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SearchFilter />
        <TimelineView events={events || []} />
      </main>
    </div>
  );
}