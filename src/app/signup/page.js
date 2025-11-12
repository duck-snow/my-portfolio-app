'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      alert('確認メールを送信しました！メールを確認してください。')
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">サインアップ</h2>

        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '登録中...' : 'アカウント作成'}
        </Button>

        <p className="text-center text-sm mt-2">
          すでにアカウントをお持ちですか？{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            ログイン
          </a>
        </p>
      </form>
    </div>
  )
}
