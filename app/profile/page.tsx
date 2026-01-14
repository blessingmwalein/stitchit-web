'use client';

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Package, Settings, LogOut, Edit, MapPin, Phone, Mail } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logoutClient, updateUser } from "@/store/slices/authSlice"

export default function ProfilePage() {
  const router = useRouter();
  const { client, isAuthenticated, hydrated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  // removed orders selector

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(client);

  useEffect(() => {
    setEditedUser(client);
  }, [client]);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !client) router.push('/auth/login');
  }, [client, hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated || !client) return null;

  const handleSaveProfile = () => {
    if (!editedUser) return;
    dispatch(updateUser(editedUser));
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logoutClient());
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
              <Card className="p-6">
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
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/profile/orders">
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
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
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold">Profile Information</h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-[var(--orange)] text-[var(--orange)] hover:bg-[var(--orange)]/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                        Save Changes
                      </Button>
                      <Button onClick={() => {
                        setIsEditing(false);
                        setEditedUser(client);
                      }} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--orange)]" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editedUser?.full_name || ""}
                        onChange={(e) => setEditedUser(editedUser ? { ...editedUser, full_name: e.target.value } : null)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[var(--orange)]" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedUser?.email || ""}
                        onChange={(e) => setEditedUser(editedUser ? { ...editedUser, email: e.target.value } : null)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[var(--orange)]" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={editedUser?.phone || ""}
                        onChange={(e) => setEditedUser(editedUser ? { ...editedUser, phone: e.target.value } : null)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[var(--orange)]" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={editedUser?.address || ""}
                        onChange={(e) => setEditedUser(editedUser ? { ...editedUser, address: e.target.value } : null)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="bg-secondary/50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Account Status</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">Active</Badge>
                        <span className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
