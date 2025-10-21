'use client'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, ExternalLink, Zap, Lock } from 'lucide-react'

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
const addressRegex = /^0x[a-fA-F0-9]{40}$/

export default function SendNativePage() {
  const [to, setTo] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
  const [amountEth, setAmountEth] = useState('0.01')
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const validAddress = useMemo(() => addressRegex.test(to.trim()), [to])
  const validAmount = useMemo(() => {
    const n = Number(amountEth)
    return Number.isFinite(n) && n > 0
  }, [amountEth])

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setHash(null)
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), amountEth: amountEth.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Send failed')
      setHash(data?.hash ?? null)
    } catch (err: any) {
      setError(String(err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Send Transaction</h1>
              <p className="text-sm text-gray-400">Serverless ETH transfer via AWS Lambda</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-sm font-semibold text-emerald-300">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on Hardhat
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Zap size={24} className="text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Transaction Details</h2>
              </div>

              <div className="space-y-6">
                {/* Recipient Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200">Recipient Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                    <div className="relative">
                      <input
                        className={cn(
                          'w-full bg-slate-900/50 border rounded-xl px-4 py-3 outline-none transition focus:ring-2 font-mono text-sm',
                          validAddress
                            ? 'border-slate-600 focus:border-purple-400 focus:ring-purple-500/30'
                            : 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20'
                        )}
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                        spellCheck={false}
                      />
                      {to && (
                        <button
                          onClick={() => setTo('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-gray-300 transition"
                          title="Clear"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  {!validAddress && to && (
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={16} />
                      Invalid address. Use a 42-character hex format.
                    </div>
                  )}
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200">Amount (ETH)</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                    <div className="relative">
                      <input
                        className={cn(
                          'w-full bg-slate-900/50 border rounded-xl px-4 py-3 outline-none transition focus:ring-2 font-mono text-sm',
                          validAmount
                            ? 'border-slate-600 focus:border-purple-400 focus:ring-purple-500/30'
                            : 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20'
                        )}
                        value={amountEth}
                        onChange={(e) => setAmountEth(e.target.value)}
                        placeholder="0.01"
                        inputMode="decimal"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ETH</span>
                    </div>
                  </div>
                  {!validAmount && amountEth && (
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={16} />
                      Enter a positive number.
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={onSend}
                  disabled={!validAddress || !validAmount || loading}
                  className={cn(
                    'w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition',
                    loading || !validAddress || !validAmount
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 active:translate-y-0.5'
                  )}
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Send Transaction
                    </>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg flex items-start gap-3">
                <Lock size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  Secured via serverless architecture. Private keys remain on the server. No CORS exposure.
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-4">
                <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-400 mb-1">Transaction Failed</h3>
                  <p className="text-sm text-red-300/80">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 h-full sticky top-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle2 size={24} className="text-purple-400" />
                </div>
                Result
              </h2>

              {!hash ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/30 py-12 text-center">
                  <div className="p-3 bg-slate-800 rounded-full mb-3">
                    <Zap size={24} className="text-slate-400" />
                  </div>
                  <p className="text-gray-300 font-medium">No transaction yet</p>
                  <p className="text-sm text-gray-400 mt-1">Submit the form to send your transaction</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full w-fit">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-300">Transaction Sent</span>
                  </div>

                  {/* Hash Display */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Transaction Hash</p>
                    <div className="font-mono text-sm break-all text-gray-200 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                      {hash}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={cn(
                        'py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition',
                        copied
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
                      )}
                      onClick={() => { navigator.clipboard.writeText(hash || ''); setCopied(true) }}
                    >
                      <Copy size={18} />
                      {copied ? 'Copied!' : 'Copy Hash'}
                    </button>

                    <a
                      className="py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50"
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={18} />
                      Explorer
                    </a>
                  </div>

                  {/* Tip */}
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-gray-400 space-y-2">
                    <p className="font-semibold text-gray-300">💡 Pro tip:</p>
                    <p>Enhance your Lambda to wait for 1 confirmation and return <code className="bg-slate-800 px-1.5 py-0.5 rounded text-gray-300 font-mono">status: "confirmed"</code></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700/50 text-center text-sm text-gray-400">
          <p>Local dev: Next.js → API Route → LocalStack Lambda → Hardhat RPC</p>
        </footer>
      </main>
    </div>
  )
}