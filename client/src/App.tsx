import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { defineChain } from "viem";
import type { ApiConfig } from "./types";
import { ConfigProvider } from "./context/ConfigContext";
import { MarketsStreamProvider } from "./context/MarketsStreamContext";
import { PaperTradeProvider } from "./context/PaperTradeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { WalletProvider } from "./wallet/WalletContext";
import { AppLayout } from "./components/dex/AppLayout";
import { SwapPage } from "./pages/SwapPage";
import { LimitPage } from "./pages/LimitPage";
import { BuyPage } from "./pages/BuyPage";
import { SellPage } from "./pages/SellPage";
import { HomePage } from "./pages/HomePage";
import { MarketsPage } from "./pages/MarketsPage";
import { TradePage } from "./pages/TradePage";
import { DocsPage } from "./pages/DocsPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

function apiBase(): string {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
}

async function loadConfig(): Promise<ApiConfig> {
  const base = apiBase();
  const url = base ? `${base}/api/v1/config` : "/api/v1/config";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`config ${res.status}`);
  return res.json() as Promise<ApiConfig>;
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-white/70">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner" />
        <p className="m-0 text-sm tracking-wide">Loading AureLexa…</p>
      </div>
    </div>
  );
}

export default function App() {
  const [cfg, setCfg] = useState<ApiConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setCfg)
      .catch(() =>
        setLoadError(
          "Could not load API config. Make sure the server is running (`npm run server:dev`) on port 3001.",
        ),
      );
  }, []);

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm rounded-xl border border-white/[0.06] bg-[rgba(12,14,24,0.7)] p-8 text-center backdrop-blur-xl">
          <h2 className="mb-2 text-base font-semibold">Configuration error</h2>
          <p className="m-0 text-sm leading-relaxed text-white/55">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!cfg) return <Loading />;

  const chain = defineChain({
    id: cfg.chain_id,
    name: "Zync network",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [cfg.rpc_url] } },
  });

  return (
    <ConfigProvider value={cfg}>
      <WalletProvider chain={chain} rpcUrl={cfg.rpc_url}>
        <FavoritesProvider>
          <MarketsStreamProvider>
            <PaperTradeProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/swap" element={<SwapPage />} />
                    <Route path="/limit" element={<LimitPage />} />
                    <Route path="/buy" element={<BuyPage />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/markets" element={<MarketsPage />} />
                    <Route path="/trade/:marketId" element={<TradePage />} />
                    <Route path="/trade" element={<Navigate to="/trade/btc-usdt" replace />} />
                    <Route path="/docs" element={<DocsPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </PaperTradeProvider>
          </MarketsStreamProvider>
        </FavoritesProvider>
      </WalletProvider>
    </ConfigProvider>
  );
}
