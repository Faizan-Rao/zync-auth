import { useState } from "react";

const SECTIONS = [
  {
    id: "introduction",
    label: "Introduction",
    icon: "📖",
    content: {
      title: "What is ZYNC?",
      body: `ZYNC is a next-generation decentralized trading protocol built for speed, security, and multi-chain accessibility. It aggregates liquidity across leading DEXs and AMMs to deliver the best execution prices with minimal slippage.

Unlike traditional centralized exchanges, ZYNC is fully non-custodial — your private keys never leave your wallet. Every trade is settled on-chain, transparently and permissionlessly.`,
      highlights: [
        { icon: "⚡", title: "Sub-50ms Execution", desc: "Intra-block order execution with no block delay" },
        { icon: "🔒", title: "Non-Custodial", desc: "Your keys, your crypto. Always." },
        { icon: "🌐", title: "Multi-Chain", desc: "Trade across Ethereum, Solana, BNB Chain, Arbitrum and more" },
        { icon: "🤖", title: "AI-Powered", desc: "Smart routing and AI research tools built in" },
      ],
    },
  },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: "🚀",
    content: {
      title: "Getting Started",
      body: `Getting started with ZYNC takes less than 60 seconds. No account creation, no KYC, no email required.`,
      steps: [
        { step: "01", title: "Connect Your Wallet", desc: "Click 'Connect Wallet' in the top right. ZYNC supports MetaMask, Phantom, Coinbase Wallet, Trust Wallet, Rainbow, and 50+ other wallets via WalletConnect." },
        { step: "02", title: "Select a Network", desc: "Choose your preferred blockchain — Ethereum, Arbitrum, BNB Chain, Solana, Avalanche, or Polygon. ZYNC auto-detects your connected network." },
        { step: "03", title: "Fund Your Wallet", desc: "Ensure you have tokens to trade and a small amount of native gas token (ETH, BNB, SOL) to cover transaction fees." },
        { step: "04", title: "Make Your First Trade", desc: "Navigate to Swap, select your token pair, enter an amount, review the quote, and confirm. Your trade executes in milliseconds." },
      ],
    },
  },
  {
    id: "swap",
    label: "Swap",
    icon: "🔄",
    content: {
      title: "Instant Swap",
      body: `The Swap interface is the fastest way to exchange tokens. ZYNC's smart routing engine scans hundreds of liquidity sources simultaneously to find the optimal path for your trade.`,
      features: [
        { title: "Smart Routing", desc: "Automatically splits orders across multiple DEXs to minimize price impact and maximize output." },
        { title: "Price Protection", desc: "Set custom slippage tolerance (0.1% – 5%) to protect against unfavorable price movements." },
        { title: "Gas Optimization", desc: "ZYNC batches and optimizes transactions to reduce gas costs by up to 40%." },
        { title: "MEV Protection", desc: "Private transaction routing prevents front-running and sandwich attacks." },
      ],
      code: `// Example: Swap 1 ETH for USDC
const quote = await zync.getQuote({
  tokenIn: "ETH",
  tokenOut: "USDC",
  amountIn: "1.0",
  slippage: 0.5, // 0.5%
});

await zync.swap(quote);`,
    },
  },
  {
    id: "advanced-orders",
    label: "Advanced Orders",
    icon: "📊",
    content: {
      title: "Advanced Order Types",
      body: `ZYNC supports professional-grade order types that give you full control over your trading strategy.`,
      features: [
        { title: "Limit Orders", desc: "Set a target price and your order executes automatically when the market reaches it. No need to watch charts." },
        { title: "Stop Loss", desc: "Protect your position by automatically selling if the price drops below your threshold." },
        { title: "Take Profit", desc: "Lock in gains by setting an automatic sell target above your entry price." },
        { title: "DCA (Dollar Cost Average)", desc: "Automatically buy or sell fixed amounts at regular intervals to reduce timing risk." },
        { title: "TWAP", desc: "Time-Weighted Average Price orders split large trades over time to minimize market impact." },
      ],
    },
  },
  {
    id: "smart-routing",
    label: "Smart Routing",
    icon: "🛣️",
    content: {
      title: "Smart Routing Engine",
      body: `ZYNC's proprietary routing algorithm analyzes all available liquidity paths in real-time to guarantee the best possible execution price.`,
      features: [
        { title: "Multi-hop Routing", desc: "Routes through intermediate tokens when a direct pair has insufficient liquidity (e.g., TOKEN → ETH → USDC)." },
        { title: "Split Routing", desc: "Divides large orders across multiple DEXs simultaneously to reduce price impact." },
        { title: "Cross-chain Routing", desc: "Bridges and swaps in a single transaction across supported chains." },
        { title: "Real-time Simulation", desc: "Simulates every route on-chain before execution to guarantee the quoted output." },
      ],
      supported: ["Uniswap V2/V3", "Raydium", "Orca", "PancakeSwap", "Curve", "Balancer", "SushiSwap", "Jupiter", "1inch"],
    },
  },
  {
    id: "copy-trading",
    label: "Copy Trading",
    icon: "📋",
    content: {
      title: "Copy Trading",
      body: `Mirror the trades of top-performing wallets automatically. ZYNC's copy trading engine monitors on-chain activity and replicates trades in real-time.`,
      features: [
        { title: "Wallet Tracking", desc: "Follow any public wallet address. ZYNC monitors it 24/7 and copies trades proportionally." },
        { title: "Risk Controls", desc: "Set maximum trade size, daily loss limits, and token blacklists to manage your risk." },
        { title: "Performance Analytics", desc: "View historical PnL, win rate, and drawdown for any wallet before following." },
        { title: "Instant Execution", desc: "Trades are copied within the same block as the original, ensuring near-identical fill prices." },
      ],
    },
  },
  {
    id: "security",
    label: "Security",
    icon: "🛡️",
    content: {
      title: "Security Architecture",
      body: `Security is the foundation of ZYNC. Every component of the protocol has been designed with a security-first mindset.`,
      features: [
        { title: "Non-Custodial", desc: "ZYNC never holds your funds. All trades execute directly from your wallet via smart contracts." },
        { title: "Audited Contracts", desc: "All smart contracts have been audited by Trail of Bits and Certik. Audit reports are publicly available." },
        { title: "Bug Bounty", desc: "Active bug bounty program with rewards up to $500,000 for critical vulnerabilities." },
        { title: "2FA Protection", desc: "Optional two-factor authentication for additional account security." },
        { title: "Open Source", desc: "All protocol code is open source and verifiable on GitHub." },
      ],
      auditors: ["Trail of Bits", "Certik", "OpenZeppelin", "Quantstamp"],
    },
  },
  {
    id: "fees",
    label: "Fees",
    icon: "💰",
    content: {
      title: "Fee Structure",
      body: `ZYNC maintains a transparent, competitive fee structure with no hidden costs.`,
      table: [
        { type: "Swap Fee", amount: "0.05% – 0.3%", note: "Varies by liquidity pool" },
        { type: "Limit Orders", amount: "0.1%", note: "Charged on execution only" },
        { type: "Cross-chain Bridge", amount: "0.15%", note: "Plus destination gas" },
        { type: "Copy Trading", amount: "5% of profits", note: "Only on profitable trades" },
        { type: "Withdrawal", amount: "Free", note: "No withdrawal fees ever" },
      ],
    },
  },
  {
    id: "api",
    label: "API Reference",
    icon: "⚙️",
    content: {
      title: "API Reference",
      body: `ZYNC provides a comprehensive REST and WebSocket API for developers building on top of the protocol.`,
      endpoints: [
        { method: "GET", path: "/api/v1/quote", desc: "Get a swap quote for a token pair" },
        { method: "POST", path: "/api/v1/swap", desc: "Execute a swap transaction" },
        { method: "GET", path: "/api/v1/markets", desc: "List all available trading pairs" },
        { method: "GET", path: "/api/v1/price/:token", desc: "Get real-time token price" },
        { method: "WS", path: "/ws/trades", desc: "Stream live trade events" },
        { method: "WS", path: "/ws/orderbook/:pair", desc: "Stream live orderbook updates" },
      ],
    },
  },
];

export function DocsPage() {
  const [active, setActive] = useState("introduction");
  const section = SECTIONS.find(s => s.id === active)!;

  return (
    <div className="min-h-screen flex" style={{ background: "#060c18" }}>

      {/* Sidebar */}
      <aside className="sticky top-[3.25rem] h-[calc(100vh-3.25rem)] w-64 shrink-0 overflow-y-auto border-r"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "#07101e" }}>
        <div className="p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#38bdf8" }}>Documentation</p>
          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all"
                style={{
                  background: active === s.id ? "rgba(56,189,248,0.1)" : "transparent",
                  color: active === s.id ? "#38bdf8" : "rgba(255,255,255,0.5)",
                  borderLeft: active === s.id ? "2px solid #38bdf8" : "2px solid transparent",
                }}>
                <span>{s.icon}</span>
                <span className="font-medium">{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-10 py-12">

          {/* Breadcrumb */}
          <p className="mb-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Docs / {section.label}
          </p>

          <h1 className="mb-4 text-4xl font-bold text-white">{section.content.title}</h1>
          <p className="mb-10 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", whiteSpace: "pre-line" }}>
            {section.content.body}
          </p>

          {/* Highlights grid */}
          {"highlights" in section.content && (
            <div className="mb-10 grid grid-cols-2 gap-4">
              {section.content.highlights.map(h => (
                <div key={h.title} className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="mb-2 text-2xl">{h.icon}</div>
                  <div className="mb-1 font-semibold text-white">{h.title}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{h.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Steps */}
          {"steps" in section.content && (
            <div className="mb-10 space-y-4">
              {section.content.steps.map(s => (
                <div key={s.step} className="flex gap-5 rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="shrink-0 text-2xl font-black" style={{ color: "#38bdf8" }}>{s.step}</div>
                  <div>
                    <div className="mb-1 font-semibold text-white">{s.title}</div>
                    <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          {"features" in section.content && (
            <div className="mb-10 space-y-3">
              <h3 className="mb-4 text-lg font-semibold text-white">Features</h3>
              {section.content.features.map(f => (
                <div key={f.title} className="flex gap-4 rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "#3dffa0", marginTop: 8 }} />
                  <div>
                    <span className="font-semibold text-white">{f.title} — </span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Code block */}
          {"code" in section.content && (
            <div className="mb-10">
              <h3 className="mb-3 text-lg font-semibold text-white">Example</h3>
              <pre className="overflow-x-auto rounded-xl p-5 text-sm leading-relaxed"
                style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.08)", color: "#3dffa0", fontFamily: "monospace" }}>
                {section.content.code}
              </pre>
            </div>
          )}

          {/* Supported DEXs */}
          {"supported" in section.content && (
            <div className="mb-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Supported Protocols</h3>
              <div className="flex flex-wrap gap-2">
                {section.content.supported.map(p => (
                  <span key={p} className="rounded-full px-3 py-1 text-sm font-medium"
                    style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fee table */}
          {"table" in section.content && (
            <div className="mb-10 overflow-hidden rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <th className="px-5 py-3 text-left font-semibold text-white">Type</th>
                    <th className="px-5 py-3 text-left font-semibold text-white">Fee</th>
                    <th className="px-5 py-3 text-left font-semibold text-white">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {section.content.table.map((row, i) => (
                    <tr key={row.type} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td className="px-5 py-3 font-medium text-white">{row.type}</td>
                      <td className="px-5 py-3" style={{ color: "#3dffa0" }}>{row.amount}</td>
                      <td className="px-5 py-3" style={{ color: "rgba(255,255,255,0.45)" }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Auditors */}
          {"auditors" in section.content && (
            <div className="mb-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Audited By</h3>
              <div className="flex flex-wrap gap-3">
                {section.content.auditors.map(a => (
                  <span key={a} className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "rgba(61,255,160,0.08)", border: "1px solid rgba(61,255,160,0.2)" }}>
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* API endpoints */}
          {"endpoints" in section.content && (
            <div className="mb-10 space-y-2">
              <h3 className="mb-4 text-lg font-semibold text-white">Endpoints</h3>
              {section.content.endpoints.map(e => (
                <div key={e.path} className="flex items-center gap-4 rounded-xl px-5 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="shrink-0 rounded px-2 py-0.5 text-xs font-bold"
                    style={{
                      background: e.method === "GET" ? "rgba(56,189,248,0.15)" : e.method === "POST" ? "rgba(61,255,160,0.15)" : "rgba(168,85,247,0.15)",
                      color: e.method === "GET" ? "#38bdf8" : e.method === "POST" ? "#3dffa0" : "#a855f7",
                    }}>
                    {e.method}
                  </span>
                  <code className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.8)" }}>{e.path}</code>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{e.desc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 flex items-center justify-between border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            {SECTIONS.findIndex(s => s.id === active) > 0 ? (
              <button onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].id)}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                ← {SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].label}
              </button>
            ) : <div />}
            {SECTIONS.findIndex(s => s.id === active) < SECTIONS.length - 1 && (
              <button onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].id)}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "#38bdf8" }}>
                {SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].label} →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
