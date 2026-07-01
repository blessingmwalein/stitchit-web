'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/api/order';

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusColor(status: string): string {
  const s = status.toUpperCase();
  if (s === 'DELIVERED' || s === 'COMPLETED') return 'bg-green-500 text-white';
  if (s === 'IN_PRODUCTION' || s === 'CONFIRMED') return 'bg-blue-500 text-white';
  if (s === 'DRAFT' || s === 'PENDING') return 'bg-gray-400 text-white';
  if (s === 'CANCELLED') return 'bg-red-500 text-white';
  return 'bg-gray-500 text-white';
}

export function OrderDetailsDrawer({ order, isOpen, onClose }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const total = Number(order.totalAmount ?? 0);
  const deposit = Number(order.depositAmount ?? 0);
  const balance = Number(order.balance ?? total - deposit);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-semibold text-[#2c2420]">Order Details</h2>
                <p className="text-sm text-muted-foreground mt-1">{order.orderNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Date */}
              <Card className="p-4 bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Order Placed</span>
                  </div>
                  <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={`${getStatusColor(order.status)} border-transparent`}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>
              </Card>

              {/* Payment Summary */}
              <Card className="p-4 bg-gradient-to-br from-[var(--orange)]/5 to-[var(--orange)]/10 border-[var(--orange)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[var(--orange)]" />
                  <h3 className="font-semibold text-lg">Payment Summary</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-lg font-semibold text-[var(--orange)]">${total.toFixed(2)}</span>
                  </div>
                  {deposit > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Deposit Paid</span>
                        <span className="text-sm font-medium text-green-600">${deposit.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {balance > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Balance Due</span>
                        <span className="text-lg font-bold text-red-600">${balance.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-[var(--orange)]" />
                  <h3 className="font-semibold text-lg">Items ({order.items.length})</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{item.rugName || 'Custom Rug'}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {item.widthCm && item.heightCm && (
                              <div><span className="font-medium">Size:</span> {item.widthCm} × {item.heightCm} cm</div>
                            )}
                            <div><span className="font-medium">Qty:</span> {item.quantity}</div>
                            <div><span className="font-medium">Unit price:</span> ${Number(item.unitPrice).toFixed(2)}</div>
                            <div><span className="font-medium">Line total:</span> ${Number(item.lineTotal).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              {order.deliveryAddress && (
                <Card className="p-4 bg-blue-50/30 border-blue-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-gray-900">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      {order.requiredDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Expected by: {new Date(order.requiredDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Notes */}
              {order.notes && (
                <Card className="p-4 bg-amber-50/30 border-amber-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-gray-900">Notes</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
