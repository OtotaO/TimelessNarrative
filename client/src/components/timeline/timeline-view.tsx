import { motion, AnimatePresence } from "framer-motion";
import { EventCard } from "./event-card";
import type { SelectEvent } from "@db/schema";

interface TimelineViewProps {
  events: SelectEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
  return (
    <div className="relative mt-12">
      {/* Decorative timeline line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"
      />

      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100 
            }}
            className={`relative ${
              index % 2 === 0 ? 'ml-[50%] pl-8' : 'mr-[50%] pr-8 text-right'
            } mb-16`}
          >
            {/* Timeline node */}
            <motion.div 
              className="absolute top-4 w-4 h-4 rounded-full bg-primary/20 border-4 border-primary"
              style={{ 
                left: index % 2 === 0 ? '-10px' : 'auto',
                right: index % 2 === 0 ? 'auto' : '-10px'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />

            {/* Year label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute top-2 ${
                index % 2 === 0 ? 'right-full mr-8' : 'left-full ml-8'
              } text-lg font-serif text-primary`}
            >
              {event.year}
            </motion.div>

            <EventCard event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}