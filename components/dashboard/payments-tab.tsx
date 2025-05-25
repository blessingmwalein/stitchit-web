"use client"

import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import type { Payment } from "@/types"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function PaymentsTab() {
  const payments = useSelector((state: RootState) => state.payments.items)

  return (
    <div>
      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment: Payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 font-medium">Payment #{payment.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} • {payment.method}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Receipt
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-medium">Order:</span> #{payment.orderId}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 dark:text-green-500">{payment.status}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <h3 className="mb-2 text-lg font-medium">No payment history</h3>
          <p className="text-muted-foreground">You haven't made any payments yet.</p>
        </div>
      )}
    </div>
  )
}
