import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Share2, Check, ArrowUp, Moon, Sun, Sparkles, User, Code2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { AnimatedBorder } from './components/AnimatedBorder'

const OPEN_TO_WORK = import.meta.env.VITE_OPEN_TO_WORK === 'true'
const CALENDLY    = import.meta.env.VITE_CONTACT_CALENDLY ?? 'https://calendly.com/reinieldan'
import { ResumePage } from './pages/ResumePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { AboutPage } from './pages/AboutPage'
import { ChatWidget } from './components/ChatWidget'
import { ContactModal } from './components/ContactModal'
import { useRateLimit } from './hooks/useRateLimit'
import { useHealth } from './hooks/useHealth'
import { useDarkMode } from './hooks/useDarkMode'

const BOT_NAME = import.meta.env.VITE_BOT_NAME ?? 'Folio'

type Page = 'folio' | 'about-me' | 'projects'

const PAGE_LABELS: Record<Page, string> = {
  folio: 'Folio',
  'about-me': 'About Me',
  projects: 'Projects',
}

type IconComponent = (props: { size?: number; className?: string }) => JSX.Element

const PAGE_ICONS: Record<Page, IconComponent> = {
  folio: Sparkles,
  'about-me': User,
  projects: Code2,
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('folio')
  const [chatOpen, setChatOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const confettiFiredRef = useRef(false)
  const [isFirstVisit] = useState(() => !localStorage.getItem('folio_visited'))
  const [showNudge, setShowNudge] = useState(true)
  const [pillPhase, setPillPhase] = useState<'work' | 'book'>('work')

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(false), 15000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!OPEN_TO_WORK) return
    let t: ReturnType<typeof setTimeout>
    function schedule() {
      t = setTimeout(() => {
        setPillPhase(p => p === 'work' ? 'book' : 'work')
        schedule()
      }, 3500 + Math.random() * 1500)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])
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
    if (activePage !== 'about-me') setChatOpen(false)
    if (activePage === 'about-me') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [activePage])

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

  useEffect(() => {
    function onNavigate(e: Event) {
      const page = (e as CustomEvent).detail as Page
      setActivePage(page)
    }
    document.addEventListener('folio-navigate', onNavigate)
    return () => document.removeEventListener('folio-navigate', onNavigate)
  }, [])

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
    if (isFirstVisit) localStorage.setItem('folio_visited', '1')
    setShowNudge(false)
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 print:hidden relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Brand */}
          <div className="flex items-center gap-1.5 shrink-0">
            <AnimatedBorder radius="9999px" className="shrink-0" innerClassName="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-900">
              <span className="text-base leading-none select-none">🤖</span>
            </AnimatedBorder>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />
          {/* Page tabs — desktop only */}
          <div className="hidden sm:flex items-center gap-0.5">
            {(['folio', 'about-me', 'projects'] as Page[]).map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activePage === page
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {PAGE_LABELS[page]}
              </button>
            ))}
          </div>
          {/* Active page label — mobile only */}
          <span className="sm:hidden text-xs font-semibold text-gray-700 dark:text-gray-200">
            {PAGE_LABELS[activePage]}
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-1 shrink-0">
            {OPEN_TO_WORK && (
              <a href={CALENDLY} target="_blank" rel="noreferrer" className="shrink-0">
                <AnimatedBorder radius="9999px" innerClassName={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 transition-colors duration-500 ${pillPhase === 'book' ? 'bg-emerald-50 dark:bg-emerald-900/40' : 'bg-white dark:bg-gray-900'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="hidden sm:block relative overflow-hidden" style={{ height: '16px', minWidth: '76px' }}>
                    <span className={`absolute inset-0 flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-medium whitespace-nowrap transition-all duration-500 ease-in-out ${pillPhase === 'work' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
                      Open to work
                    </span>
                    <span className={`absolute inset-0 flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-medium whitespace-nowrap transition-all duration-500 ease-in-out ${pillPhase === 'book' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                      Book a call
                    </span>
                  </span>
                </AnimatedBorder>
              </a>
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

      <div key={activePage} className="animate-fade-in-up pb-16 sm:pb-0">
        {activePage === 'folio' ? <AboutPage onOpenChat={() => { setActivePage('about-me'); setChatOpen(true) }} />
         : activePage === 'about-me' ? <ResumePage onAboutClick={() => setActivePage('folio')} />
         : <ProjectsPage onFolioClick={() => setActivePage('folio')} />}
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-20 sm:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 print:hidden"
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-stretch">
          {(['folio', 'about-me', 'projects'] as Page[]).map((page) => {
            const Icon = PAGE_ICONS[page]
            return (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-2 text-[10px] font-semibold transition-colors ${
                  activePage === page
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={17} />
                {PAGE_LABELS[page]}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          className="fixed left-3 sm:left-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:shadow-lg transition-all animate-fade-in print:hidden folio-fab-bottom"
        >
          <ArrowUp size={15} />
        </button>
      )}

      {!chatOpen && (activePage === 'about-me' || activePage === 'projects') && (
        <div className="fixed right-4 sm:right-6 z-30 flex flex-col items-end gap-2 print:hidden folio-fab-bottom">
          {/* Nudge callout */}
          {showNudge && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-br-sm shadow-lg border border-emerald-400 dark:border-emerald-500 px-3 sm:px-4 py-2.5 sm:py-3 max-w-[180px] sm:max-w-[220px] text-center leading-snug animate-fade-in">
              <span className="block font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm mb-0.5">✨ Try the chatbot!</span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Ask Folio anything about Dan's experience! 🤖</span>
            </div>
          )}

          <AnimatedBorder radius="1rem" className="shadow-lg hover:shadow-xl active:scale-95 transition-all" innerClassName="bg-emerald-600">
            <button
              onClick={openChat}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 w-full"
            >
              <MessageSquare size={16} className="text-white" />
              <span className="text-sm font-medium text-white">Chat with {BOT_NAME}</span>
              {rateLimit.remaining < limit && (
                <span className="text-xs bg-emerald-500/40 text-white px-1.5 py-0.5 rounded-full">
                  {rateLimit.remaining} left
                </span>
              )}
            </button>
          </AnimatedBorder>
        </div>
      )}
    </div>
  )
}
