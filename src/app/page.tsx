"use client"

import { ChatInterface } from "@/components/chat-interface"
import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export default function Home() {
  const { resolvedTheme } = useTheme();
  return (
    <main className="min-h-screen overflow-hidden">
      <ChatInterface />
      <Toaster richColors theme={resolvedTheme as "light" | "dark" | "system"} />

    </main>
  )
}
