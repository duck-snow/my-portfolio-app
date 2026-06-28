"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push("/logs")
    }

    setLoading(false)
  }

  // URLのハッシュを削除し、セッションをクリア
  useEffect(() => {
    const hasAccessToken = window.location.hash.includes('access_token');
    const endsWithHash = window.location.href.endsWith('#');

    if (hasAccessToken || endsWithHash) {
      supabase.auth.signOut();
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300">
      <div className="w-full max-w-md mb-15">
        <h1 className="text-3xl font-extrabold text-center text-slate-800">
          学習ログアプリ
        </h1>
        <p className="text-xs font-medium text-center text-gray-500 uppercase tracking-widest mt-2">
          Study Log Dashboard
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-50 p-8 rounded-lg shadow-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">ログイン</h1>

        <div className="space-y-1">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-1">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
        className="w-full disabled:opacity-70 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </Button>

        <p className="text-center text-sm">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            サインアップへ
          </Link>
        </p>
      </form>
    </div>
  )
}
