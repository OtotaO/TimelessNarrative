import { motion } from "framer-motion";
import { EventCard } from "./event-card";
import type { SelectEvent } from "@db/schema";

interface TimelineViewProps {
  events: SelectEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
  return (
    <div className="relative mt-8">
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20" />
      
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative ${index % 2 === 0 ? 'ml-[50%] pl-8' : 'mr-[50%] pr-8 text-right'} mb-12`}
        >
          <div className="absolute top-4 w-4 h-4 rounded-full bg-primary border-4 border-background"
               style={{ 
                 left: index % 2 === 0 ? '-10px' : 'auto',
                 right: index % 2 === 0 ? 'auto' : '-10px'
               }} />
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  );
}
