import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function GDPRBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gdpr_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("gdpr_consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl z-50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Cookie Consent</h3>
              <p className="text-xs text-zinc-400 mt-1">
                We use cookies and local storage to save your generated ideas and preferences. We do not track you across other sites.
              </p>
            </div>
            <button onClick={() => setShow(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={accept} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg transition-colors">
              Accept All
            </button>
            <button onClick={() => setShow(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium py-2 rounded-lg transition-colors">
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
