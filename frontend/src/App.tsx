import { useState, useEffect } from 'react'
import { MessageSquare, Share2, Check, Printer } from 'lucide-react'

const OPEN_TO_WORK = import.meta.env.VITE_OPEN_TO_WORK === 'true'
import { ResumePage } from './pages/ResumePage'
import { AboutPage } from './pages/AboutPage'
import { ChatWidget } from './components/ChatWidget'
import { ContactModal } from './components/ContactModal'
import { useRateLimit } from './hooks/useRateLimit'

const LIMIT = 5
const BOT_NAME = import.meta.env.VITE_BOT_NAME ?? 'Folio'

export default function App() {
  const [activePage, setActivePage] = useState<'resume' | 'about'>('resume')
  const [chatOpen, setChatOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [copied, setCopied] = useState(false)
  const rateLimit = useRateLimit()

  async function handleShare() {
    const url = window.location.origin
    if (navigator.share) {
      try { await navigator.share({ title: "Dan Pablo's Portfolio", url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 800)
    const t2 = setTimeout(() => setShowGreeting(false), 6000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function openChat() {
    setShowGreeting(false)
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab navigation */}
      <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="flex gap-4 sm:gap-6 flex-1">
            {(['resume', 'about'] as const).map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activePage === page
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {page === 'resume' ? 'Resume' : 'About'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {OPEN_TO_WORK && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Open to work
              </span>
            )}
            <button
              onClick={handleShare}
              title={copied ? 'Copied!' : 'Share'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            </button>
            <button
              onClick={() => window.print()}
              title="Print / Save PDF"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors print:hidden"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>
      </nav>

      {activePage === 'resume' ? <ResumePage /> : <AboutPage />}

      <div className="print:hidden">
        <ChatWidget
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          rateLimit={rateLimit}
          onDanClick={() => setContactOpen(true)}
        />
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {!chatOpen && (
        <div className="fixed right-6 z-30 flex flex-col items-end gap-2 print:hidden" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
          <div
            className={`
              bg-white rounded-2xl rounded-br-sm shadow-lg px-4 py-2.5 text-sm text-gray-700
              transition-all duration-500
              ${showGreeting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
            `}
          >
            Come have a chat with me! 👋
          </div>

          <button
            onClick={openChat}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Chat with {BOT_NAME}</span>
            {rateLimit.remaining < LIMIT && (
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {rateLimit.remaining} left
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
