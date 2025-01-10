import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EventModal } from "./event-modal";
import type { SelectEvent } from "@db/schema";

interface EventCardProps {
  event: SelectEvent;
}

export function EventCard({ event }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="backdrop-blur bg-card/90">
        <CardHeader>
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.year}</p>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{event.description}</p>
          <Button 
            variant="link" 
            onClick={() => setShowModal(true)}
            className="mt-2 p-0"
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
