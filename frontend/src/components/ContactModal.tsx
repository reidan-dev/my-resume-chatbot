import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { sendContactForm } from '../lib/api'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'reinieldan@gmail.com'

interface Props {
  onClose: () => void
}

export function ContactModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await sendContactForm({ name, email, message, honeypot })
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">✉️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Message sent!</h2>
            <p className="text-sm text-gray-500">Dan will get back to you soon.</p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Get in touch with Dan</h2>
            <p className="text-sm text-gray-500 mb-5">
              Send a message and Dan will reply to your email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'd like to discuss an opportunity…"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">
                  {errorMsg}{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                    Email Dan directly.
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
