import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { WalletBar } from "../WalletBar";
import { useConfig } from "../../context/ConfigContext";
import { MarketTicker } from "./MarketTicker";
import { WalletConnectModal } from "../WalletConnectModal";

export function AppLayout() {
  const cfg = useConfig();
  const loc = useLocation();
  const tradeActive = loc.pathname.startsWith("/trade");

  return (
    <div className="min-h-screen font-sans text-white/90"
      style={{
        background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(0,217,192,0.07), transparent 52%), radial-gradient(ellipse 130% 95% at 50% 42%, #0b1217 0%, #050a0f 52%, #020508 100%)",
      }}
    >
      {/* Top nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[rgba(11,18,23,0.88)] px-8 backdrop-blur-[10px]" style={{ height: "3.25rem" }}>
        <div className="flex items-center gap-7">
          <Link to="/" className="text-sm font-bold tracking-widest flex items-center">
            <img src="/logo.png" alt="ZyncSwap logo" className="w-8 h-8 mr-3" />
            <span className="text-[#00d9c0]">ZYNC</span>{" "}
            <span className="text-white/90">SWAP</span>
          </Link>
          <nav className="flex gap-1">
            {[
              { to: "/swap", label: "Swap", end: true },
              { to: "/markets", label: "Markets", end: false },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[rgba(0,217,192,0.15)] text-[#00d9c0]"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/trade/btc-usdt"
              className={() =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tradeActive
                    ? "bg-[rgba(0,217,192,0.15)] text-[#00d9c0]"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              Trade
            </NavLink>
            <NavLink
              to="/docs"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[rgba(0,217,192,0.15)] text-[#00d9c0]"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              Docs
            </NavLink>
          </nav>
        </div>
        <WalletBar expectedChainId={cfg.chain_id} />
      </header>

      <Outlet />
      <MarketTicker />
      <WalletConnectModal />
    </div>
  );
}
