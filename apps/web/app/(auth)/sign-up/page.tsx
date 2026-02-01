"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-studio-ink/5">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-studio-ink mb-2">Create your account</h1>
        <p className="text-sm text-studio-ink/60">Get started with Namazing — it&apos;s free</p>
      </div>

      <button
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-full border border-studio-ink/10 bg-white hover:bg-studio-cream text-studio-ink text-sm font-medium transition-colors mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-studio-ink/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-studio-ink/40">or</span>
        </div>
      </div>

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-studio-ink/70 mb-1.5">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-studio-ink/10 bg-white text-studio-ink placeholder:text-studio-ink/30 focus:outline-none focus:ring-2 focus:ring-studio-terracotta/30 focus:border-studio-terracotta/30"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-studio-ink/70 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 px-4 rounded-xl border border-studio-ink/10 bg-white text-studio-ink placeholder:text-studio-ink/30 focus:outline-none focus:ring-2 focus:ring-studio-terracotta/30 focus:border-studio-terracotta/30"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-studio-ink/70 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full h-12 px-4 rounded-xl border border-studio-ink/10 bg-white text-studio-ink placeholder:text-studio-ink/30 focus:outline-none focus:ring-2 focus:ring-studio-terracotta/30 focus:border-studio-terracotta/30"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
        )}

        <Button type="submit" variant="terracotta" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-studio-ink/50 mt-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-studio-terracotta hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
