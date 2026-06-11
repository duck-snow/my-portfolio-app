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

  // 新規投稿フォーム
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 編集用
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // ユーザー確認
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

  // fetchLogs
  const fetchLogs = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setLogs(data);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, fetchLogs]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );

  // 新規投稿
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) return alert("タイトルは必須です");
    if (!content.trim()) return alert("内容は必須です");

    const { error } = await supabase.from("logs").insert([
      {
        title,
        content,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setContent("");
      fetchLogs();
    }
  };

  // 削除
  const handleDelete = async (id) => {
    if (!window.confirm("このログを本当に削除しますか？")) return;

    await supabase.from("logs").delete().eq("id", id);
    fetchLogs();
  };

  // 編集開始
  const startEdit = (log) => {
    setEditingId(log.id);
    setEditTitle(log.title);
    setEditContent(log.content);
  };

  // 編集保存
  const handleUpdate = async () => {
    if (!editTitle.trim()) return alert("タイトルは必須です");
    if (!editContent.trim()) return alert("内容は必須です");

    await supabase
      .from("logs")
      .update({ title: editTitle, content: editContent })
      .eq("id", editingId);

    setEditingId(null);
    fetchLogs();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 学習ログ一覧</h1>

          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">{user?.email}</p>
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
        </div>

        {/* 新規投稿カード */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <Input
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <Textarea
            placeholder="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <Button type="submit" className="w-full">
            投稿
          </Button>
        </form>

        {/* 投稿一覧 */}
        {logs.length === 0 ? (
          <p className="text-gray-600">まだログがありません。</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                {editingId === log.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-white border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleUpdate}>保存</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{log.title}</h2>
                    <p className="text-gray-700 whitespace-pre-line">{log.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      🕒 {new Date(log.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="outline"
                        onClick={() => startEdit(log)}
                      >
                        編集
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(log.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
