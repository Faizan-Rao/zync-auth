import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketsStream } from "../context/MarketsStreamContext";
import { TOKEN_ICONS } from "../components/dex/tokenIcons";

// All 35 tradeable tokens with their market IDs and display names
const HERO_TOKENS = [
  { symbol: "BTC",    name: "Bitcoin",       id: "btc-usdt",    change: +2.4  },
  { symbol: "ETH",    name: "Ethereum",      id: "eth-usdt",    change: +1.8  },
  { symbol: "BNB",    name: "BNB",           id: "bnb-usdt",    change: +0.9  },
  { symbol: "SOL",    name: "Solana",        id: "sol-usdt",    change: +5.2  },
  { symbol: "XRP",    name: "XRP",           id: "xrp-usdt",    change: -1.1  },
  { symbol: "AVAX",   name: "Avalanche",     id: "avax-usdt",   change: +3.4  },
  { symbol: "DOGE",   name: "Dogecoin",      id: "doge-usdt",   change: +7.1  },
  { symbol: "ADA",    name: "Cardano",       id: "ada-usdt",    change: -0.6  },
  { symbol: "LINK",   name: "Chainlink",     id: "link-usdt",   change: +4.2  },
  { symbol: "DOT",    name: "Polkadot",      id: "dot-usdt",    change: -2.3  },
  { symbol: "MATIC",  name: "Polygon",       id: "matic-usdt",  change: +1.5  },
  { symbol: "UNI",    name: "Uniswap",       id: "uni-usdt",    change: +2.9  },
  { symbol: "ATOM",   name: "Cosmos",        id: "atom-usdt",   change: -0.8  },
  { symbol: "NEAR",   name: "NEAR Protocol", id: "near-usdt",   change: +6.3  },
  { symbol: "ARB",    name: "Arbitrum",      id: "arb-usdt",    change: +3.1  },
  { symbol: "OP",     name: "Optimism",      id: "op-usdt",     change: +2.7  },
  { symbol: "APT",    name: "Aptos",         id: "apt-usdt",    change: -1.4  },
  { symbol: "LTC",    name: "Litecoin",      id: "ltc-usdt",    change: +0.5  },
  { symbol: "INJ",    name: "Injective",     id: "inj-usdt",    change: +8.4  },
  { symbol: "SUI",    name: "Sui",           id: "sui-usdt",    change: +4.6  },
  { symbol: "TIA",    name: "Celestia",      id: "tia-usdt",    change: -3.2  },
  { symbol: "SEI",    name: "Sei",           id: "sei-usdt",    change: +5.8  },
  { symbol: "WLD",    name: "Worldcoin",     id: "wld-usdt",    change: +1.2  },
  { symbol: "JUP",    name: "Jupiter",       id: "jup-usdt",    change: +9.1  },
  { symbol: "PEPE",   name: "Pepe",          id: "pepe-usdt",   change: +12.3 },
  { symbol: "SHIB",   name: "Shiba Inu",     id: "shib-usdt",   change: -0.4  },
  { symbol: "FET",    name: "Fetch.ai",      id: "fet-usdt",    change: +6.7  },
  { symbol: "RENDER", name: "Render",        id: "render-usdt", change: +4.1  },
  { symbol: "GRT",    name: "The Graph",     id: "grt-usdt",    change: -1.9  },
  { symbol: "LDO",    name: "Lido DAO",      id: "ldo-usdt",    change: +2.2  },
  { symbol: "AAVE",   name: "Aave",          id: "aave-usdt",   change: +3.8  },
  { symbol: "CRV",    name: "Curve",         id: "crv-usdt",    change: -0.7  },
];

// Positions: left%, top%, size(px), float delay(s), float duration(s)
const TOKEN_POSITIONS = [
  { l: 2,  t: 8,  s: 56, d: 0,   dur: 7   },
  { l: 7,  t: 38, s: 48, d: 1.5, dur: 8   },
  { l: 4,  t: 68, s: 44, d: 0.8, dur: 6.5 },
  { l: 11, t: 85, s: 48, d: 2.2, dur: 7.5 },
  { l: 38, t: 55, s: 34, d: 1.0, dur: 9   },
  { l: 15, t: 20, s: 42, d: 3.1, dur: 7   },
  { l: 22, t: 92, s: 30, d: 0.4, dur: 8.5 },
  { l: 86, t: 6,  s: 54, d: 0.7, dur: 7   },
  { l: 91, t: 32, s: 46, d: 2.0, dur: 8   },
  { l: 88, t: 68, s: 40, d: 1.3, dur: 6.5 },
  { l: 94, t: 82, s: 36, d: 0.2, dur: 9   },
  { l: 35, t: 6, s: 44, d: 2.8, dur: 7.5 },
  { l: 76, t: 13, s: 38, d: 1.6, dur: 8   },
  { l: 83, t: 90, s: 32, d: 3.4, dur: 7   },
  { l: 72, t: 72, s: 36, d: 0.6, dur: 8.5 },
  { l: 3,  t: 52, s: 32, d: 2.5, dur: 6   },
  { l: 9,  t: 15, s: 36, d: 1.9, dur: 7.5 },
  { l: 20, t: 35, s: 28, d: 0.3, dur: 9   },
  { l: 48, t: 35, s: 70, d: 1.1, dur: 7   },
  { l: 68, t: 88, s: 48, d: 2.7, dur: 8   },
  { l: 25, t: 75, s: 36, d: 3.8, dur: 6.5 },
  { l: 50, t: 55, s: 32, d: 0.9, dur: 7.5 },
  { l: 55, t: 25, s: 48, d: 2.3, dur: 8   },
  { l: 60, t: 78, s: 46, d: 1.7, dur: 9   },
  { l: 55, t: 10, s: 30, d: 3.2, dur: 7   },
  { l: 50, t: 88, s: 44, d: 0.5, dur: 8.5 },
  { l: 45, t: 65, s: 48, d: 2.1, dur: 6   },
  { l: 40, t: 20, s: 46, d: 1.4, dur: 7.5 },
  { l: 35, t: 45, s: 44, d: 3.6, dur: 8   },
  { l: 30, t: 82, s: 42, d: 0.7, dur: 9   },
  { l: 96, t: 50, s: 46, d: 2.9, dur: 7   },
  { l: 13, t: 5,  s: 30, d: 1.8, dur: 8   },
];

// ── Floating token component ──────────────────────────────────────────────────
type HeroToken = typeof HERO_TOKENS[number];
type TokenPos  = typeof TOKEN_POSITIONS[number];

function FloatingToken({ tk, pos, liveChange, onClick }: {
  tk: HeroToken; pos: TokenPos; liveChange?: number; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const change = liveChange ?? tk.change;
  const pos24 = change >= 0;

  // Tooltip placement: flip to left side if token is on the right half
  const tooltipLeft = pos.l > 55;

  return (
    <div
      className="absolute hidden lg:block"
      style={{
        left: `${pos.l}%`,
        top: `${pos.t}%`,
        animation: `floatY ${pos.dur}s ease-in-out ${pos.d}s infinite`,
        zIndex: hovered ? 20 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Token icon button */}
      <button
        type="button"
        onClick={onClick}
        className="relative block rounded-full transition-all duration-300"
        style={{
          width: pos.s, height: pos.s,
          opacity: hovered ? 1 : 0.22,
          transform: hovered ? "scale(1.25)" : "scale(1)",
          filter: hovered
            ? `drop-shadow(0 0 16px ${pos24 ? "rgba(61,255,160,0.7)" : "rgba(239,83,80,0.7)"})`
            : "drop-shadow(0 0 8px rgba(61,255,160,0.3))",
        }}>
        <img
          src={TOKEN_ICONS[tk.symbol]}
          alt={tk.symbol}
          width={pos.s} height={pos.s}
          className="rounded-full object-contain w-full h-full"
        />
        {/* Glow ring on hover */}
        {hovered && (
          <span className="absolute inset-0 rounded-full animate-ping"
            style={{ border: `2px solid ${pos24 ? "#3dffa0" : "#ef5350"}`, opacity: 0.5 }} />
        )}
      </button>

      {/* Tooltip card */}
      {hovered && (
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            [tooltipLeft ? "right" : "left"]: pos.s + 10,
            animation: "fadeSlideIn 0.18s ease forwards",
            minWidth: 140,
          }}>
          <div className="rounded-xl px-3 py-2.5 text-left shadow-2xl"
            style={{
              background: "rgba(10,16,30,0.96)",
              border: `1px solid ${pos24 ? "rgba(61,255,160,0.3)" : "rgba(239,83,80,0.3)"}`,
              backdropFilter: "blur(12px)",
            }}>
            <div className="flex items-center gap-2 mb-1">
              <img src={TOKEN_ICONS[tk.symbol]} alt={tk.symbol} className="h-5 w-5 rounded-full" />
              <span className="font-bold text-white text-sm">{tk.symbol}</span>
            </div>
            <div className="text-xs text-white/50 mb-1.5">{tk.name}</div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold"
                style={{ color: pos24 ? "#3dffa0" : "#ef5350" }}>
                {pos24 ? "+" : ""}{change.toFixed(2)}%
              </span>
              <span className="text-[10px] text-white/35">24h</span>
            </div>
            <div className="mt-1.5 text-[10px] font-medium"
              style={{ color: pos24 ? "rgba(61,255,160,0.7)" : "rgba(239,83,80,0.7)" }}>
              Click to trade →
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 -translate-y-1/2"
            style={{
              [tooltipLeft ? "right" : "left"]: -5,
              width: 0, height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              [tooltipLeft ? "borderLeft" : "borderRight"]: `5px solid ${pos24 ? "rgba(61,255,160,0.3)" : "rgba(239,83,80,0.3)"}`,
            }} />
        </div>
      )}
    </div>
  );
}

function fmtPrice(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n < 0.01) return n.toFixed(6);
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!target || started.current) return;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

// ── Sub-components (each calls hooks at top level) ────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="text-base font-medium text-white/90">{q}</span>
        <span className="shrink-0 text-white/40 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p className="pb-5 text-sm leading-relaxed text-white/55">{a}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const ref = useFadeIn(delay);
  return (
    <div ref={ref} className="rounded-2xl p-6 transition-all hover:border-white/[0.15]"
      style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "rgba(61,255,160,0.1)", color: "#3dffa0" }}>
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{desc}</p>
    </div>
  );
}

function StepCard({ n, title, desc, last, delay }: { n: string; title: string; desc: string; last: boolean; delay: number }) {
  const ref = useFadeIn(delay);
  return (
    <div ref={ref} className="relative rounded-2xl p-6"
      style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="mb-4 text-4xl font-black" style={{ color: "rgba(56,189,248,0.2)" }}>{n}</div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{desc}</p>
      {!last && (
        <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
          <svg className="h-6 w-6 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      )}
    </div>
  );
}

type MarketRow = { id: string; base: string; quote: string; mark_price: number; change_24h_pct: number; max_leverage: number };
const BASE_IMG: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
  XRP: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png",
  DOGE:"https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/thumb/photo_2023-03-29_21.47.00.jpeg",
  OP:  "https://assets.coingecko.com/coins/images/25244/thumb/Optimism.png",
};

function MarketCard({ m, delay, onClick }: { m: MarketRow; delay: number; onClick: () => void }) {
  const ref = useFadeIn(delay);
  const pos = m.change_24h_pct >= 0;
  return (
    <div ref={ref}>
      <button type="button" onClick={onClick}
        className="group flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all hover:border-white/[0.15]"
        style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <img src={BASE_IMG[m.base] ?? BASE_IMG.ETH} alt={m.base} className="h-9 w-9 rounded-full" />
          <div>
            <div className="font-semibold text-white">{m.base}<span className="text-white/40">/{m.quote}</span></div>
            <div className="text-xs text-white/40">Max {m.max_leverage}× leverage</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono font-semibold text-white">{fmtPrice(m.mark_price)}</div>
          <div className={`text-xs font-medium ${pos ? "text-[#3dffa0]" : "text-red-400"}`}>
            {pos ? "+" : ""}{m.change_24h_pct.toFixed(2)}%
          </div>
        </div>
      </button>
    </div>
  );
}

// ── Mini swap widget ──────────────────────────────────────────────────────────
const SWAP_TOKENS = [
  { symbol: "ETH",  img: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" },
  { symbol: "BTC",  img: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
  { symbol: "SOL",  img: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png" },
  { symbol: "USDT", img: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png" },
];

function MiniSwapWidget() {
  const navigate = useNavigate();
  const [from, setFrom] = useState(SWAP_TOKENS[0]);
  const [to, setTo]     = useState(SWAP_TOKENS[3]);
  const [amt, setAmt]   = useState("");

  function flip() { const t = from; setFrom(to); setTo(t); }

  return (
    <div className="w-full rounded-3xl p-5"
      style={{ background: "rgba(11,17,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Quick Swap</span>
        <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      </div>
      <div className="rounded-2xl p-4 mb-1" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="mb-2 text-xs text-white/50">You pay</p>
        <div className="flex items-center gap-3">
          <input value={amt} onChange={e => setAmt(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.0" inputMode="decimal"
            className="w-full bg-transparent text-3xl font-light text-white outline-none placeholder:text-white/20" />
          <button type="button" onClick={flip}
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <img src={from.img} alt={from.symbol} className="h-5 w-5 rounded-full" />
            {from.symbol}
            <svg className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      <div className="relative z-10 flex justify-center" style={{ marginTop: -10, marginBottom: -10 }}>
        <button type="button" onClick={flip}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:text-white transition-all"
          style={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </button>
      </div>
      <div className="rounded-2xl p-4 mb-4" style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="mb-2 text-xs text-white/50">You receive</p>
        <div className="flex items-center gap-3">
          <span className="w-full text-3xl font-light text-white/25">0.0</span>
          <button type="button"
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold text-[#0b1120]"
            style={{ background: "linear-gradient(135deg,#3dffa0,#38bdf8)", boxShadow: "0 4px 16px rgba(61,255,160,0.3)" }}>
            <img src={to.img} alt={to.symbol} className="h-5 w-5 rounded-full" />
            {to.symbol}
            <svg className="h-3 w-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      <button type="button" onClick={() => navigate("/swap")}
        className="w-full rounded-2xl py-3.5 text-base font-bold text-[#060c18] transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#3dffa0,#38bdf8)", boxShadow: "0 4px 24px rgba(61,255,160,0.3)" }}>
        Get Started
      </button>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const FEATURES = [
  { title: "Instant Swaps",    desc: "Swap any token pair in seconds with live Binance prices and minimal slippage.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
  { title: "Pro Charts",       desc: "Full TradingView integration with drawing tools, indicators, and real-time candlesticks.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
  { title: "Non-Custodial",    desc: "Your keys, your crypto. We never hold your funds — connect any EVM wallet and trade freely.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> },
  { title: "Limit Orders",     desc: "Set your price and walk away. Limit orders execute automatically when the market hits your target.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  { title: "Multi-Wallet",     desc: "MetaMask, Coinbase, WalletConnect and more — connect with any EIP-6963 compatible wallet.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  { title: "ZYNC Token",       desc: "The native utility token powering AureLexa. Stake, govern, and unlock premium features on launch.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> },
];

const HOW_STEPS = [
  { n: "01", title: "Connect your wallet", desc: "Click 'Connect wallet' and choose from MetaMask, Coinbase Wallet, or any injected EVM provider." },
  { n: "02", title: "Select your tokens",  desc: "Pick the token you want to sell and the one you want to receive. Prices update in real time." },
  { n: "03", title: "Review & confirm",    desc: "Check the rate, slippage, and gas estimate. Approve the transaction in your wallet." },
  { n: "04", title: "Done — tokens arrive",desc: "Your new tokens land in your wallet within seconds. No sign-up, no KYC, no custody." },
];

const FAQS = [
  { q: "What is ZynC?", a: "ZynC is a decentralised trading platform built on EVM-compatible chains. It lets you swap tokens, place limit orders, and trade perpetual futures — all without giving up custody of your assets." },
  { q: "Which wallets are supported?", a: "Any EIP-6963 or EIP-1193 compatible wallet works: MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and more. Hardware wallets via MetaMask are also supported." },
  { q: "Are there any trading fees?", a: "ZynC charges a small protocol fee on swaps (typically 0.3%). Limit orders and perpetuals have their own fee schedules visible before you confirm any trade." },
  { q: "What is the ZynC token?", a: "ZynC is the native utility token of the AureLexa ecosystem. It will be used for governance, fee discounts, staking rewards, and unlocking premium platform features. The public mint opens on mainnet launch." },
  { q: "Is ZynC safe to use?", a: "ZynC is non-custodial — your funds never leave your wallet until you sign a transaction. Smart contracts are audited and open-source. Always verify contract addresses before interacting." },
  { q: "Which chains are supported?", a: "ZynC currently supports Ethereum mainnet and local Hardhat for development. Multi-chain support (Arbitrum, Optimism, Base) is on the roadmap." },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export function HomePage() {
  const { overview } = useMarketsStream();
  const navigate = useNavigate();
  const topMarkets = (overview?.markets.slice(0, 6) ?? []) as MarketRow[];

  const vol  = useCountUp(overview ? Math.round(overview.volume_24h_total / 1e9) : 4, 2000);
  const oi   = useCountUp(overview ? Math.round(overview.total_open_interest / 1e9) : 2, 2000);
  const mkts = useCountUp(overview?.markets.length ?? 7, 1500);
  const featHeadRef = useFadeIn(0);
  const statsRef    = useFadeIn(0);
  const howHeadRef  = useFadeIn(0);
  const faqRef      = useFadeIn(0);

  return (
    <div className="overflow-x-hidden" style={{ background: "#060c18" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 70% at 60% 20%, rgba(56,189,248,0.1) 0%, rgba(61,255,160,0.06) 40%, transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {HERO_TOKENS.map((tk, i) => {
          const pos = TOKEN_POSITIONS[i];
          if (!pos) return null;
          const live = overview?.markets.find(m => m.id === tk.id);
          return (
            <FloatingToken
              key={tk.symbol}
              tk={tk}
              pos={pos}
              liveChange={live?.change_24h_pct}
              onClick={() => navigate(`/trade/${tk.id}`)}
            />
          );
        })}

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-16 px-6 pb-20 pt-20 lg:flex-row lg:pt-28">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(61,255,160,0.1)", border: "1px solid rgba(61,255,160,0.25)", color: "#3dffa0" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#3dffa0] animate-pulse" />
              Live on mainnet · ZYNC launching soon
            </div>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Trade crypto<br />
              <span style={{ background: "linear-gradient(135deg,#3dffa0,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                without limits
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/55 mx-auto lg:mx-0">
              Swap, limit order, and trade perpetuals on a non-custodial platform powered by real-time Binance data and the ZYNC utility token.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <button type="button" onClick={() => navigate("/swap")}
                className="rounded-2xl px-7 py-3.5 text-base font-bold text-[#060c18] transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#3dffa0,#38bdf8)", boxShadow: "0 6px 30px rgba(61,255,160,0.35)" }}>
                Get Started
              </button>
              <button type="button" onClick={() => navigate("/markets")}
                className="rounded-2xl border px-7 py-3.5 text-base font-semibold text-white/80 transition-all hover:text-white hover:border-white/30"
                style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}>
                View Markets
              </button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start">
              {["Non-custodial", "Audited contracts", "No KYC"].map(b => (
                <div key={b} className="flex items-center gap-2 text-sm text-white/45">
                  <svg className="h-4 w-4 text-[#3dffa0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {b}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-[420px] shrink-0">
            <MiniSwapWidget />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div ref={statsRef} className="mx-auto grid max-w-[1200px] grid-cols-2 px-6 md:grid-cols-4">
          {[
            { label: "24h Volume",    prefix: "$", suffix: "B+", ref: vol.ref,  val: vol.val  },
            { label: "Open Interest", prefix: "$", suffix: "B+", ref: oi.ref,   val: oi.val   },
            { label: "Markets",       prefix: "",  suffix: "+",  ref: mkts.ref, val: mkts.val },
            { label: "Avg. Slippage", prefix: "",  suffix: "%",  ref: null,     val: null, fixed: "0.3" },
          ].map(({ label, prefix, suffix, ref: r, val, fixed }) => (
            <div key={label} ref={r ?? undefined} className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-1 text-4xl font-bold text-white">
                {fixed ?? `${prefix}${val}`}{suffix}
              </div>
              <div className="text-sm text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div ref={featHeadRef} className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#3dffa0" }}>Why ZYNC</p>
          <h2 className="text-4xl font-bold text-white">Everything you need to trade</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/50">A complete DeFi trading suite — from quick swaps to professional perpetuals, all in one place.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.08} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <div ref={howHeadRef} className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#38bdf8" }}>How it works</p>
            <h2 className="text-4xl font-bold text-white">Start trading in 4 steps</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s, i) => <StepCard key={s.n} {...s} last={i === HOW_STEPS.length - 1} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* ── LIVE MARKETS ── */}
      {topMarkets.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#3dffa0" }}>Live markets</p>
              <h2 className="text-3xl font-bold text-white">Top trading pairs</h2>
            </div>
            <button type="button" onClick={() => navigate("/markets")}
              className="hidden text-sm font-medium transition-colors hover:text-white sm:block" style={{ color: "#38bdf8" }}>
              View all markets →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topMarkets.map((m, i) => (
              <MarketCard key={m.id} m={m} delay={i * 0.06} onClick={() => navigate(`/trade/${m.id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{ background: "linear-gradient(135deg,rgba(61,255,160,0.12),rgba(56,189,248,0.12))", border: "1px solid rgba(61,255,160,0.2)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%,rgba(61,255,160,0.15) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(56,189,248,0.15) 0%,transparent 50%)" }} />
          <h2 className="relative mb-3 text-4xl font-bold text-white">Ready to start trading?</h2>
          <p className="relative mx-auto mb-8 max-w-md text-white/55">Connect your wallet and make your first swap in under 30 seconds. No account needed.</p>
          <button type="button" onClick={() => navigate("/swap")}
            className="relative rounded-2xl px-10 py-4 text-base font-bold text-[#060c18] transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#3dffa0,#38bdf8)", boxShadow: "0 8px 32px rgba(61,255,160,0.4)" }}>
            Get Started — it's free
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-[800px] px-6 py-24">
          <div ref={faqRef} className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#38bdf8" }}>FAQ</p>
            <h2 className="text-4xl font-bold text-white">Frequently asked questions</h2>
          </div>
          <div className="rounded-2xl px-6" style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.07)" }}>
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-14px) rotate(3deg); }
          66%      { transform: translateY(-7px) rotate(-2deg); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-50%) translateX(-6px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  );
}
