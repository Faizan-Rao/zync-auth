import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function apiBase(): string {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
}

export function LoginPage() {
  const navigate = useNavigate();
  const base = useMemo(() => apiBase(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${base}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await res.json()) as
        | { token?: string; error?: string }
        | undefined;
      if (!res.ok || !body?.token) {
        setError(body?.error ?? "Login failed");
        return;
      }
      localStorage.setItem("accessToken", body.token);
      navigate("/", { replace: true });
    } catch {
      setError("Could not reach server");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.25rem)] w-full max-w-7xl items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-white/8 bg-[rgba(11,18,23,0.82)] p-6 backdrop-blur-xl">
        <h1 className="m-0 text-xl font-semibold text-white">Login</h1>
        <p className="mt-2 text-sm text-white/55">
          Sign in to place and manage orders.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm text-white/70">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-white/35 focus:border-[#00d9c0]/45"
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <span className="mt-1 block text-xs text-red-300">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>
          <label className="block text-sm text-white/70">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-white/35 focus:border-[#00d9c0]/45"
              placeholder="Enter your password"
            />
            {fieldErrors.password ? (
              <span className="mt-1 block text-xs text-red-300">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>
          {error && <p className="m-0 text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#00d9c0] px-3 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-white/60">
          Need an account?{" "}
          <Link to="/signup" className="text-[#00d9c0] hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
