import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Share2, Check, ArrowUp, Moon, Sun, Glasses } from 'lucide-react'
import confetti from 'canvas-confetti'

const OPEN_TO_WORK = import.meta.env.VITE_OPEN_TO_WORK === 'true'
import { ResumePage } from './pages/ResumePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ChatWidget } from './components/ChatWidget'
import { ContactModal } from './components/ContactModal'
import { useRateLimit } from './hooks/useRateLimit'
import { useHealth } from './hooks/useHealth'
import { useDarkMode } from './hooks/useDarkMode'

const BOT_NAME = import.meta.env.VITE_BOT_NAME ?? 'Folio'

type Page = 'resume' | 'projects'

export default function App() {
  const [activePage, setActivePage] = useState<Page>('resume')
  const [chatOpen, setChatOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [showNudge, setShowNudge] = useState(true)
  const [copied, setCopied] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const confettiFiredRef = useRef(false)
  const [isFirstVisit] = useState(() => !localStorage.getItem('folio_visited'))
  const { dark, toggle: toggleDark } = useDarkMode()
  const health = useHealth()
  const limit = health.rateLimit?.limit ?? 5
  const windowMs = (health.rateLimit?.windowDays ?? 3) * 24 * 60 * 60 * 1000
  const rateLimit = useRateLimit(limit, windowMs)

  async function handleShare() {
    const url = window.location.origin
    if (navigator.share) {
      try { await navigator.share({ title: "Dan Pablo's Resume", url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(false), 10_000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? scrolled / total : 0)
      setShowScrollTop(scrolled > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        !chatOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        openChat()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [chatOpen])

  function fireConfetti() {
    if (confettiFiredRef.current) return
    confettiFiredRef.current = true
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#ffffff'],
    })
  }

  function openChat() {
    setShowNudge(false)
    if (isFirstVisit) localStorage.setItem('folio_visited', '1')
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 print:hidden relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
              <Glasses size={15} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 tracking-tight">Dan Pablo</span>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />
          {/* Page tabs */}
          <div className="flex items-center gap-0.5">
            {(['resume', 'projects'] as Page[]).map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  activePage === page
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 shrink-0">
            {OPEN_TO_WORK && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Open to work
              </span>
            )}
            <button
              onClick={handleShare}
              title={copied ? 'Copied!' : 'Share'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            </button>
            <button
              onClick={toggleDark}
              title={dark ? 'Light mode' : 'Dark mode'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors print:hidden"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </nav>

      <div className="animate-fade-in-up">
        {activePage === 'resume' ? <ResumePage /> : <ProjectsPage />}
      </div>

      <div className="print:hidden">
        <ChatWidget
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          rateLimit={rateLimit}
          health={health}
          limit={limit}
          onDanClick={() => setContactOpen(true)}
          onFirstMessage={fireConfetti}
        />
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          className="fixed left-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:shadow-lg transition-all animate-fade-in print:hidden"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <ArrowUp size={15} />
        </button>
      )}

      {!chatOpen && (
        <div className="fixed right-6 z-30 flex flex-col items-end gap-2 print:hidden" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
          {/* Nudge callout — always shown, fades out after 10s or on chat open */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl rounded-br-sm shadow-lg border border-emerald-100 dark:border-emerald-900/40 px-4 py-3 max-w-[220px] text-center leading-snug transition-all duration-500 ${
              showNudge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <span className="block font-medium text-gray-900 dark:text-gray-100 text-sm mb-0.5">✨ Try the chatbot!</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Ask Folio anything about Dan's experience! 🕶️</span>
          </div>

          <div className="relative">
            {showNudge && (
              <span className="absolute inset-0 rounded-2xl bg-emerald-400 opacity-30 animate-ping pointer-events-none" />
            )}
            <button
              onClick={openChat}
              className="relative flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <MessageSquare size={16} />
              <span className="text-sm font-medium">Chat with {BOT_NAME}</span>
              {rateLimit.remaining < limit && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {rateLimit.remaining} left
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
