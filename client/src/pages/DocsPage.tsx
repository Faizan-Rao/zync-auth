export function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
      
      <section className="mb-8 rounded-xl border border-white/[0.06] bg-[rgba(12,14,24,0.5)] p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold text-[#00d9c0]">Getting Started</h2>
        <p className="mb-4 text-white/70">
          Welcome to ZyncSwap, a decentralized exchange platform built on the Zync network.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-white/70">
          <li>Connect your wallet to start trading</li>
          <li>Swap tokens instantly with low fees</li>
          <li>View real-time market data and charts</li>
          <li>Trade with limit orders</li>
        </ul>
      </section>

      <section className="mb-8 rounded-xl border border-white/[0.06] bg-[rgba(12,14,24,0.5)] p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold text-[#00d9c0]">Features</h2>
        <div className="space-y-4 text-white/70">
          <div>
            <h3 className="mb-2 font-medium text-white/90">Swap</h3>
            <p>Exchange tokens instantly at the best available rates.</p>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-white/90">Markets</h3>
            <p>Browse all available trading pairs and their current prices.</p>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-white/90">Trade</h3>
            <p>Advanced trading interface with charts and order books.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.06] bg-[rgba(12,14,24,0.5)] p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold text-[#00d9c0]">Support</h2>
        <p className="text-white/70">
          For questions or support, please reach out to our community channels.
        </p>
      </section>
    </div>
  );
}
