import Link from 'next/link';
import { ArrowRight, Zap, Shield, Code2, ChevronDown } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Serverless Chain</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition font-medium text-sm">Features</a>
            <a href="#how" className="text-gray-300 hover:text-white transition font-medium text-sm">How it works</a>
            <a href="#why" className="text-gray-300 hover:text-white transition font-medium text-sm">Why it works</a>
            <Link href="/send" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm font-semibold text-purple-300">
                ✨ Production-Ready Serverless Stack
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Blockchain transactions on <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AWS Lambda</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Route Next.js requests through serverless functions to your EVM node. No CORS headaches. No infrastructure overhead. Just clean, secure, auditable flows.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/send" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/50 transition">
                Send ETH now <ArrowRight size={20} />
              </Link>
              <a href="#how" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-600 rounded-xl font-bold hover:border-purple-400 hover:text-purple-400 transition">
                See how <ChevronDown size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-400">💻 Local dev with LocalStack + Hardhat · 🚀 Production-ready AWS patterns</p>
          </div>

          {/* Stats Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-400">Live Demo</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Function</p>
                    <p className="text-lg font-bold">send-native</p>
                  </div>
                  <Zap className="text-yellow-400" size={24} />
                </div>

                <div className="flex justify-between items-start p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latency</p>
                    <p className="text-lg font-bold">~200–500ms</p>
                  </div>
                  <Shield className="text-blue-400" size={24} />
                </div>

                <div className="flex justify-between items-start p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">RPC</p>
                    <p className="text-lg font-mono font-bold">Hardhat:8545</p>
                  </div>
                  <Code2 className="text-purple-400" size={24} />
                </div>
              </div>

              <Link href="/send" className="block w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-center hover:shadow-lg hover:shadow-purple-500/50 transition">
                Start Transaction
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why teams choose this pattern</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "No-CORS Architecture",
              desc: "Frontend calls Next.js API. Server invokes Lambda via SDK. Private keys stay server-side."
            },
            {
              icon: Zap,
              title: "Serverless by Default",
              desc: "Scale to zero with AWS Lambda. Add API Gateway & IAM when you're ready for production."
            },
            {
              icon: Code2,
              title: "Clean Code Paths",
              desc: "One Lambda to send, one to fetch. Minimal code. Maximum clarity. Production patterns."
            }
          ].map((feature, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition" />
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-purple-400/50 rounded-xl p-8 transition h-full">
                <feature.icon className="mb-4 text-purple-400" size={32} />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>
        <div className="space-y-4">
          {[
            { step: 1, label: "UI", desc: "Posts to <code>/api/send</code> in Next.js" },
            { step: 2, label: "Server", desc: "Invokes <code>send-native</code> on AWS Lambda (LocalStack in dev)" },
            { step: 3, label: "Lambda", desc: "Uses <code>viem</code> to sign & broadcast via Hardhat RPC" },
            { step: 4, label: "Result", desc: "Returns tx hash — view it in the app or your explorer" }
          ].map((item, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                {i < 3 && <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent mt-2" />}
              </div>
              <div className="flex flex-col justify-center pb-6 pt-2">
                <p className="font-bold text-lg mb-1">{item.label}</p>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust */}
      <section id="why" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Built for trust & security</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-12 space-y-4">
          {[
            "🔐 Private keys never touch the browser",
            "🏗️ Clear separation of concerns (UI ↔ API ↔ Lambda)",
            "🧪 Easy local testing with LocalStack + Hardhat",
            "📊 Full auditability & production-grade patterns"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Serverless Chain. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#how" className="hover:text-purple-400 transition">How it works</a>
            <Link href="/send" className="hover:text-purple-400 transition">Launch App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}