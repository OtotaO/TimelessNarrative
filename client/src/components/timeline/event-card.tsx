import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, BookMarked } from "lucide-react";
import type { SelectEvent } from "@db/schema";
import { EventModal } from "./event-modal";

interface EventCardProps {
  event: SelectEvent;
}

export function EventCard({ event }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="overflow-hidden backdrop-blur bg-card/90 border-primary/10 hover:border-primary/20 transition-colors">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-primary" />
              <h3 className="text-xl font-serif">{event.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>
              {event.month && new Date(0, event.month - 1).toLocaleString('default', { month: 'long' })}
              {event.day && ` ${event.day},`} {event.year}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">{event.description}</p>
          <Button 
            variant="ghost" 
            onClick={() => setShowModal(true)}
            className="mt-4 text-primary hover:text-primary/80"
          >
            Read more
          </Button>
        </CardContent>
      </Card>

      <EventModal 
        event={event}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}