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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
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
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
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
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-1">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </Button>

        <p className="text-center text-sm">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            サインアップへ
          </Link>
        </p>
      </form>
    </div>
  )
}
