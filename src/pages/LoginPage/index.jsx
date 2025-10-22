import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tryLogin } from "@utils/authFlow";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state && loc.state.from) || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErr("");
    setSubmitting(true);
    try {
      await tryLogin(email, password);
      nav(from, { replace: true });
    } catch (e) {
      console.log(e);
      setErr("이메일 또는 비밀번호를 확인하세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white shadow rounded-xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-gray-800">로그인</h1>

        <label className="block">
          <span className="text-sm text-gray-600">이메일</span>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">비밀번호</span>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
