"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const { state } = useAuth();
  const user = state.user;
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="flex flex-col md:flex-row gap-6">
        <TabsList className="flex flex-row md:flex-col justify-start md:w-64 h-auto bg-transparent gap-2">
          <TabsTrigger value="account" className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-muted/80">
            <User size={18} /> Account
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-muted/80">
            <Lock size={18} /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-muted/80">
            <Bell size={18} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="payment" className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-muted/80">
            <CreditCard size={18} /> Payment
          </TabsTrigger>
          <TabsTrigger value="preferences" className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-muted/80">
            <Globe size={18} /> Preferences
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full max-w-3xl">
          <TabsContent value="account" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.first_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.last_name || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="cursor-pointer">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password and secure your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input id="current_password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input id="confirm_password" type="password" />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="cursor-pointer">Enable 2FA</Button>
                </div>

                <div className="pt-4">
                  <Button className="cursor-pointer">Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                  </div>
                  <Switch 
                    checked={orderUpdates} 
                    onCheckedChange={setOrderUpdates} 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">Receive special offers and discounts</p>
                  </div>
                  <Switch 
                    checked={promotions} 
                    onCheckedChange={setPromotions} 
                  />
                </div>

                <Button className="cursor-pointer">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      MC
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 8888</p>
                      <p className="text-sm text-muted-foreground">Expires 09/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground cursor-pointer">
                    Remove
                  </Button>
                </div>

                <Button variant="outline" className="w-full border-dashed cursor-pointer">
                  + Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your overall experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-2 rounded-md">
                      <Moon size={20} className="hidden dark:block" />
                      <Sun size={20} className="block dark:hidden" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Appearance</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="cursor-pointer">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
