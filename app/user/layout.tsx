"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { User, Package, Settings as SettingsIcon } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Profile", href: "/user/profile", icon: User },
    { name: "Orders", href: "/user/orders", icon: Package },
    { name: "Settings", href: "/user/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background text-primary py-8 px-4 md:px-8 pb-32 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* User Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-muted bg-opacity-50 backdrop-blur-lg rounded-xl p-4 ring-1 ring-primary sticky top-24">
              <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-orange text-white"
                          : "text-primary hover:bg-contrast-gradient hover:bg-opacity-30"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
