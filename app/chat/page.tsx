import { AppShell } from "@/components/layout/app-shell"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-8rem)]">
        <ChatInterface />
      </div>
    </AppShell>
  )
}
