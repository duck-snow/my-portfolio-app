"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 🔥 ユーザー確認
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  // 🔥 fetchLogs を useCallback で安定化
  const fetchLogs = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching logs:", error);
    else setLogs(data);
  }, [user]);

  // 🔥 ログ取得（依存関係に fetchLogs を入れる）
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (loading) return <p>読み込み中...</p>;

  // 🔥 投稿処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("logs").insert([
      {
        title,
        content,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding log:", error);
    } else {
      setTitle("");
      setContent("");
      fetchLogs(); // 投稿後に更新
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 学習ログ一覧</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">{user.email}</p>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
            >
              ログアウト
            </Button>
          </div>
        )}
      </div>

      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit">投稿</Button>
      </form>

      {/* 投稿一覧 */}
      {logs.length === 0 ? (
        <p>まだログがありません。</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li key={log.id} className="border p-3 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">{log.title}</h2>
              <p className="text-gray-700">{log.content}</p>
              <p className="text-sm text-gray-500">
                🕒 {new Date(log.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
