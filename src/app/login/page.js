"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
      console.log("ログイン成功:", data)
      router.push("/logs") // ✅ ログイン成功で /logs にリダイレクト！
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="space-y-6 bg-gray-100 p-8 rounded-md shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center">ログイン</h1>

        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </Button>

        <p className="text-center text-sm">
          アカウントをお持ちでない方は{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            サインアップへ
          </a>
        </p>
      </form>
    </div>
  )
}
