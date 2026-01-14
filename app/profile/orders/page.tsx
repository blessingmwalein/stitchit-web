'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, Settings, LogOut, Loader2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutClient } from "@/store/slices/authSlice";
import { fetchOrders } from "@/store/slices/orderSlice";
import { Order } from "@/lib/api/order";
import { OrderDetailsDrawer } from "@/components/order-details-drawer";

export default function OrderHistoryPage() {
    const router = useRouter();
    const { client, isAuthenticated, hydrated } = useAppSelector((state) => state.auth);
    const { ordersList } = useAppSelector((state) => state.orders);
    const dispatch = useAppDispatch();

    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuthenticated || !client) router.push('/auth/login');
    }, [client, hydrated, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrders());
        }
    }, [isAuthenticated, dispatch]);

    const handleLogout = () => {
        dispatch(logoutClient());
        router.push('/');
    };

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const openOrderDrawer = (order: Order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    };

    if (!hydrated || !client) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-500 hover:bg-green-600 text-white border-transparent';
            case 'processing': return 'bg-blue-500 hover:bg-blue-600 text-white border-transparent';
            case 'draft': return 'bg-gray-400 hover:bg-gray-500 text-white border-transparent';
            case 'pending': return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent';
            case 'cancelled': return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
            default: return 'bg-gray-500 hover:bg-gray-600 text-white border-transparent';
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-2">
                            My <span className="text-[var(--orange)] italic font-serif">Account</span>
                        </h1>
                        <p className="text-muted-foreground">Manage your profile and orders</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User className="w-10 h-10 text-[var(--orange)]" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{client.full_name}</h3>
                                    <p className="text-sm text-muted-foreground">{client.email || ''}</p>
                                </div>

                                <Separator className="my-4" />

                                <nav className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/profile">
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" className="w-full justify-start bg-gray-100 font-medium">
                                        <Package className="w-4 h-4 mr-2" />
                                        My Orders
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </nav>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <Card className="p-8 shadow-sm border-none bg-white min-h-[500px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold">Order History</h3>
                                    <Button variant="outline" asChild className="hidden sm:flex rounded-full">
                                        <Link href="/order">
                                            <Package className="w-4 h-4 mr-2" />
                                            New Quick Order
                                        </Link>
                                    </Button>
                                </div>

                                {ordersList.loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse border rounded-lg p-6">
                                                <div className="h-4 bg-gray-200 w-1/4 mb-4 rounded"></div>
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-100 w-full rounded"></div>
                                                    <div className="h-3 bg-gray-100 w-2/3 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : ordersList.data.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                        <h4 className="text-xl font-semibold mb-2">No Orders Yet</h4>
                                        <p className="text-muted-foreground mb-6">
                                            You haven't placed any orders yet
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <Button asChild className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] rounded-full">
                                                <Link href="/order">Quick Request</Link>
                                            </Button>
                                            <Button asChild variant="outline" className="rounded-full">
                                                <Link href="/collections">Browse Collections</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {ordersList.data.map((order, index) => {
                                            const isExpanded = expandedOrders.has(order.id);
                                            const totalAmount = Number(order.total_amount);
                                            const paidAmount = order.paid_amount ? Number(order.paid_amount) : 0;
                                            const balance = order.balance ? Number(order.balance) : totalAmount - paidAmount;

                                            return (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                >
                                                    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                        {/* Card Header - Always Visible */}
                                                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                                                            <div className="flex flex-wrap justify-between items-center gap-4">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-1">
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Order #</p>
                                                                        <p className="text-sm font-semibold text-[var(--orange)]">{order.reference}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Date</p>
                                                                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Items</p>
                                                                        <p className="text-sm font-medium">{order.items_count}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-right">
                                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Total</p>
                                                                        <p className="text-lg font-serif font-semibold text-[var(--orange)]">
                                                                            ${totalAmount.toLocaleString()}
                                                                        </p>
                                                                        {balance > 0 && balance < totalAmount && (
                                                                            <p className="text-xs text-red-600 font-medium">
                                                                                Balance: ${balance.toFixed(2)}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <Badge className={`${getStatusColor(order.state)}`}>
                                                                        {order.state_label}
                                                                    </Badge>
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => openOrderDrawer(order)}
                                                                            className="rounded-full hover:bg-[var(--orange)]/10"
                                                                        >
                                                                            <Eye className="w-4 h-4 text-[var(--orange)]" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => toggleOrderExpand(order.id)}
                                                                            className="rounded-full"
                                                                        >
                                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expandable Content */}
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <div className="p-4 space-y-4 bg-white">
                                                                    {/* Payment Info */}
                                                                    {(paidAmount > 0 || balance > 0) && (
                                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                                            <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Payment Details</h4>
                                                                            <div className="grid grid-cols-3 gap-3 text-sm">
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-xs">Total</p>
                                                                                    <p className="font-medium">${totalAmount.toFixed(2)}</p>
                                                                                </div>
                                                                                {paidAmount > 0 && (
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-xs">Paid</p>
                                                                                        <p className="font-medium text-green-600">${paidAmount.toFixed(2)}</p>
                                                                                    </div>
                                                                                )}
                                                                                {balance > 0 && (
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-xs">Balance</p>
                                                                                        <p className="font-medium text-red-600">${balance.toFixed(2)}</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Items Preview */}
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Items</h4>
                                                                        <div className="space-y-2">
                                                                            {order.items.map((item) => (
                                                                                <div key={item.id} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                                                                                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                                                                                        {item.design_image_url ? (
                                                                                            <Image
                                                                                                src={item.design_image_url}
                                                                                                alt="Design"
                                                                                                fill
                                                                                                className="object-cover"
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                                <Package className="w-6 h-6 text-gray-300" />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="font-medium text-sm truncate">{item.description}</p>
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                            {Number(item.width).toFixed(0)}x{Number(item.height).toFixed(0)} cm • Qty: {item.quantity}
                                                                                        </p>
                                                                                        <p className="text-xs font-medium text-[var(--orange)]">
                                                                                            ${Number(item.price_per_item).toFixed(2)}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {/* Delivery Address */}
                                                                    {order.delivery_address && (
                                                                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                                                            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Delivery To</p>
                                                                            <p className="text-sm text-gray-700">{order.delivery_address}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Order Details Drawer */}
            <OrderDetailsDrawer
                order={selectedOrder}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
