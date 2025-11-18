// components/checkout/PaymentSelector.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Building2, Wallet } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PaymentSelectorProps {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "credit-card",
    name: "Credit Card",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Visa, Mastercard, JCB",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: <Building2 className="w-6 h-6" />,
    description: "BCA, Mandiri, BNI, BRI",
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    icon: <Wallet className="w-6 h-6" />,
    description: "GoPay, OVO, Dana, ShopeePay",
  },
];

export function PaymentSelector({
  selectedMethod,
  onSelect,
}: PaymentSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method, index) => (
            <motion.button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                "w-full p-4 rounded-lg border-2 transition-all text-left",
                "hover:border-[var(--red-normal)] hover:bg-[var(--red-light)]",
                selectedMethod === method.id
                  ? "border-[var(--red-normal)] bg-[var(--red-light)]"
                  : "border-gray-200 bg-white"
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    selectedMethod === method.id
                      ? "bg-[var(--red-normal)] text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--neutral-ink)]">
                    {method.name}
                  </h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[var(--red-normal)] rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
