// components/modals/SubscriptionModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  selectedPlan = "Basic",
}: SubscriptionModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?redirect=checkout&plan=${selectedPlan.toLowerCase().replace(/\s/g, "")}`);
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <motion.div
                className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <Lock className="w-10 h-10 text-[var(--red-normal)]" />
              </motion.div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-[var(--neutral-ink)]">
                  Login untuk Melanjutkan
                </h2>
                <p className="text-gray-600">
                  Silakan login atau daftar terlebih dahulu untuk berlangganan{" "}
                  <span className="font-semibold text-[var(--red-normal)]">
                    Paket {selectedPlan}
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  onClick={handleLogin}
                  className="flex-1 bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  size="lg"
                >
                  Login Sekarang
                </Button>
                <Button
                  onClick={handleRegister}
                  variant="outline"
                  className="flex-1 border-2 border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                  size="lg"
                >
                  Daftar Gratis
                </Button>
              </div>

              {/* Footer */}
              <p className="text-sm text-gray-500 text-center mt-6">
                Belum punya akun?{" "}
                <button
                  onClick={handleRegister}
                  className="text-[var(--red-normal)] font-semibold hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
