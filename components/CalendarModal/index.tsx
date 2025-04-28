import { Event } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function CalendarModal({
  initialEvent,
  onClose,
}: {
  initialEvent: Event;
  onClose: () => void;
}) {
  if (!initialEvent) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
        onClick={onClose}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0, ease: "easeInOut" }}
      >
        {/* Fullscreen Background Image */}
        {initialEvent.imageUrl && (
          <motion.img
            src={initialEvent.imageUrl}
            alt="background event"
            className="absolute inset-0 w-full h-full object-cover opacity-100 blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* Modal Content */}
        <motion.div
          key={initialEvent.id}
          layoutId={`event-${initialEvent.id}`}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.8,
            delay: 0,
          }}
        >
          {/* Top Image inside modal */}
          {initialEvent.imageUrl && (
            <motion.img
              src={initialEvent.imageUrl}
              alt={initialEvent.title}
              className="w-full h-48 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Content */}
          <div className="relative flex-1 flex flex-col justify-between overflow-auto p-6 bg-gradient-to-br from-indigo-600 to-purple-600">

            {/* Foreground content */}
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                {initialEvent.title}
              </h2>

              {/* Date */}
              {initialEvent.time && (
                <p className="text-sm text-white/60 mb-4">
                  {initialEvent.time}
                </p>
              )}

              {/* Description */}
              <p className="text-white/80">{initialEvent.description}</p>
            </div>

            {/* Close Button */}
            <div className="relative z-10 mt-6 flex justify-center ">
              <button
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full px-6 py-2 transition cursor-pointer"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
