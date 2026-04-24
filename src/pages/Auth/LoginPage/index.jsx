import React, { useState } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { tryLogin } from "@utils/authFlow";
import useUserStore from "@stores/userStore";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state && loc.state.from) || "/portal";
  const authenticated = useUserStore((state) => state.authenticated);
  const sessionReady = useUserStore((state) => state.sessionReady);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  if (sessionReady && authenticated) {
    return <Navigate to={from} replace />;
  }

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
    <div className="flex items-center justify-center p-6 flex-1">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-neutral-white  p-6 space-y-4"
      >
        <h1 className="text-3xl font-bold mb-8 tracking-tight text-gray-900 text-center">게딱지 파트너센터</h1>

        <div className="form-group">
          <label className="form-label">이메일</label>
          <div className="form-input-wrap">
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="block">
          <label className="form-label">비밀번호</label>
          <div className="form-input-wrap">
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {err && <p className="text-sm text-red-500">{err}</p>}

        <div className="flex justify-end text-sm gap-2 text-grayscale-400">
          <a href="/find-id" className="hover:underline hover:text-grayscale-900">
            아이디 찾기
          </a>
          <p>|</p>
          <a href="/find-password" className="hover:underline hover:text-grayscale-900">
            비밀번호 찾기
          </a>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-orange text-neutral-white py-2 disabled:opacity-60 font-semibold"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex gap-2 text-sm justify-center">
          <p className="text-grayscale-400">계정이 없으신가요?</p>
          <Link to="/signup" className="hover:underline font-semibold text-primary-orange">
            회원가입하러 가기
          </Link>
        </div>
      </form>
    </div>
  );
}
