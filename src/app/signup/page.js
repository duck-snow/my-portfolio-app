'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
          className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        />

        <Input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        />

        {/* エラーが出た時に少し余白調整 */}
        {error && (
          <p className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? '登録中...' : 'アカウント作成'}
        </Button>

        <p className="text-center text-sm mt-2">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </form>
    </div>
  )
}
