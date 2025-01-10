import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SelectEvent } from "@db/schema";

interface EventModalProps {
  event: SelectEvent;
  open: boolean;
  onClose: () => void;
}

export function EventModal({ event, open, onClose }: EventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{event.title}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {event.year}
            {event.month && `, ${new Date(0, event.month - 1).toLocaleString('default', { month: 'long' })}`}
            {event.day && ` ${event.day}`}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>{event.description}</p>
          
          <div>
            <h4 className="font-semibold mb-2">Historical Significance</h4>
            <p>{event.significance}</p>
          </div>

          {event.source && (
            <div className="text-sm text-muted-foreground">
              Source: {event.source}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
