import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { ResumePage } from './pages/ResumePage'
import { ChatWidget } from './components/ChatWidget'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop: side-by-side layout */}
      <div className="md:pr-[420px]">
        <ResumePage />
      </div>

      {/* Desktop: always show chat sidebar */}
      <div className="hidden md:block">
        <ChatWidget isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile: FAB to open chat */}
      <div className="md:hidden">
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <MessageSquare size={18} />
          <span className="text-sm font-medium">Ask about Dan</span>
        </button>

        <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  )
}
