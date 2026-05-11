import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto w-full"
          >
            <div
              className={`relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-white/90 border-green-200/80"
                  : "bg-white/90 border-red-200/80"
              }`}
            >
              <div className="flex items-center gap-3 px-5 py-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    toast.type === "success"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  {toast.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Message */}
                <p className="flex-1 text-sm font-semibold text-slate-700 leading-snug">
                  {toast.message}
                </p>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                style={{ transformOrigin: "left" }}
                className={`h-[3px] ${
                  toast.type === "success"
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-red-400 to-rose-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
