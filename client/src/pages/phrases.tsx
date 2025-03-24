import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BookText } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import type { SelectPhrase } from "@db/schema";
import { PhraseCard } from "@/components/phrases/phrase-card";

export default function PhrasesPage() {
  const [search, setSearch] = useState("");
  
  const { data: phrases, isLoading } = useQuery<SelectPhrase[]>({
    queryKey: [search ? `/api/phrases/search?query=${encodeURIComponent(search)}` : "/api/phrases"],
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
            <BookText className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-6xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Historical Phrases
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover the fascinating origins of common English phrases and idioms. 
            Each phrase tells a story from history.
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="w-full max-w-md mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search historical phrases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {phrases?.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
      </main>
    </div>
  );
}
