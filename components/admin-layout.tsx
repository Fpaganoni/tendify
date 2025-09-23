"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { Header } from "./header"
import { useAuth } from "@/lib/auth-context"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || state.user?.role !== "admin")) {
      router.push("/")
    }
  }, [state.isLoading, state.isAuthenticated, state.user?.role, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated || state.user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
