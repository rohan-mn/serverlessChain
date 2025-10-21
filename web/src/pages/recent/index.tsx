import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Copy, ArrowLeft, Activity, AlertCircle, Search, ChevronDown } from 'lucide-react';

type Tx = { hash: string; from?: string; to?: string; value?: string; blockNumber?: string };

export default function RecentPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [address, setAddress] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('count', String(count));
    if (address.trim()) params.set('address', address.trim());
    return `/api/recent?${params.toString()}`;
  }, [count, address]);

  async function fetchRows() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setRows(data?.txs ?? []);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRows(); }, [apiUrl]);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(fetchRows, 5000);
    return () => clearInterval(id);
  }, [auto, apiUrl]);

  const filterAddr = address.trim().toLowerCase();
  const highlight = (val?: string) => filterAddr && val && val.toLowerCase() === filterAddr;

  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition">
                <ArrowLeft size={20} className="text-gray-400" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Activity size={20} className="text-emerald-400" />
                  </div>
                  <h1 className="text-3xl font-bold">Recent Transactions</h1>
                </div>
                <p className="text-sm text-gray-400">Local Hardhat via Lambda · Auto-refresh enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                auto 
                  ? 'bg-emerald-500/20 border border-emerald-400/30' 
                  : 'bg-slate-700/50 border border-slate-600'
              }`}>
                <span className={`inline-flex h-2 w-2 rounded-full ${auto ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-sm font-semibold">{auto ? 'Live' : 'Paused'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Controls Panel */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6 mb-8 hover:border-purple-400/40 transition">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Search/Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200">Filter by Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-4 text-gray-400" />
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x... (optional)"
                    spellCheck={false}
                    className="w-full bg-slate-900/50 border border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 rounded-xl pl-12 pr-10 py-3 outline-none transition font-mono text-sm"
                  />
                  {address && (
                    <button 
                      onClick={() => setAddress('')}
                      className="absolute right-3 p-1 hover:bg-slate-700 rounded-lg transition"
                      title="Clear"
                    >
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12M18 6l-12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Count Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200">Number of Blocks</label>
              <div className="relative">
                <select 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 rounded-xl px-4 py-3 outline-none transition appearance-none cursor-pointer font-semibold"
                >
                  {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} blocks</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={fetchRows} 
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 active:translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Refresh
                </>
              )}
            </button>

            <label className="flex items-center gap-3 px-6 py-3 rounded-lg border border-slate-600 bg-slate-900/30 hover:border-slate-500 cursor-pointer transition">
              <input 
                type="checkbox" 
                checked={auto} 
                onChange={(e) => setAuto(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="font-semibold text-sm">Auto-refresh</span>
            </label>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 flex gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-400">Error loading transactions</p>
                <p className="text-sm text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl overflow-hidden hover:border-purple-400/40 transition">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-700 bg-slate-900/30">
            <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Hash</div>
            <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-400">From</div>
            <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-400">To</div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Value (Wei)</div>
            <div className="col-span-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Block</div>
          </div>

          {/* Loading Skeleton */}
          {loading && rows.length === 0 && (
            <div className="divide-y divide-slate-700">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                  <div className="col-span-3 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded" />
                  <div className="col-span-3 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded" />
                  <div className="col-span-3 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded" />
                  <div className="col-span-2 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded" />
                  <div className="col-span-1 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && rows.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-slate-700/50 rounded-full mb-4">
                <Activity size={32} className="text-slate-400" />
              </div>
              <p className="text-gray-300 font-semibold">No transactions found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or refreshing</p>
            </div>
          )}

          {/* Table Rows */}
          {rows.length > 0 && (
            <div className="divide-y divide-slate-700">
              {rows.map((tx) => {
                const fromHit = highlight(tx.from);
                const toHit = highlight(tx.to);
                return (
                  <div 
                    key={tx.hash}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 transition hover:bg-slate-700/30 ${
                      fromHit || toHit ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
                    }`}
                  >
                    {/* Hash */}
                    <div className="col-span-3 flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => copy(tx.hash)}
                        className="flex-shrink-0 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold transition whitespace-nowrap"
                        title="Copy hash"
                      >
                        {copied === tx.hash ? 'Copied!' : 'Copy'}
                      </button>
                      <span className="font-mono text-sm text-gray-300 truncate" title={tx.hash}>
                        {tx.hash}
                      </span>
                    </div>

                    {/* From */}
                    <div className="col-span-3 font-mono text-sm truncate">
                      {tx.from ? (
                        <span 
                          className={`px-3 py-1 rounded-lg truncate inline-block max-w-full ${
                            fromHit 
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50' 
                              : 'text-gray-300'
                          }`}
                          title={tx.from}
                        >
                          {tx.from}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>

                    {/* To */}
                    <div className="col-span-3 font-mono text-sm truncate">
                      {tx.to ? (
                        <span 
                          className={`px-3 py-1 rounded-lg truncate inline-block max-w-full ${
                            toHit 
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50' 
                              : 'text-gray-300'
                          }`}
                          title={tx.to}
                        >
                          {tx.to}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>

                    {/* Value */}
                    <div className="col-span-2 font-mono text-sm text-gray-300 truncate">
                      {tx.value ?? '0'}
                    </div>

                    {/* Block */}
                    <div className="col-span-1 font-mono text-sm text-gray-300 text-center">
                      {tx.blockNumber ?? '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 py-6 border-t border-slate-700/50">
          <p>Serverless Blockchain · Powered by Next.js & AWS Lambda</p>
        </footer>
      </main>
    </div>
  );
}