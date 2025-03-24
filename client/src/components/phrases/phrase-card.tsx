import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Clock, BookOpen } from "lucide-react";
import type { SelectPhrase } from "@db/schema";

interface PhraseCardProps {
  phrase: SelectPhrase;
}

export function PhraseCard({ phrase }: PhraseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="overflow-hidden backdrop-blur bg-card/90 border-primary/10 hover:border-primary/20 transition-colors">
        <CardHeader className="space-y-2">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-serif">{phrase.phrase}</h3>
              <p className="text-sm text-muted-foreground italic">"{phrase.meaning}"</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
            <p className="text-sm">{phrase.origin}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{phrase.timePeriod}</span>
            <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
              {phrase.category}
            </span>
          </div>
          {phrase.source && (
            <div className="text-xs text-muted-foreground">
              Source: {phrase.source}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
