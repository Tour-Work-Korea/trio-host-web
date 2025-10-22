/* eslint-disable react/prop-types */
import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import GuestLayout from "@components/layout/GuestLayout";
import UserLayout from "@components/layout/UserLayout";
import useUserStore from "@stores/userStore";
import { tryRefresh } from "@utils/authFlow";

const LandingPage = lazy(() => import("@pages/LandingPage"));
const LoginPage = lazy(() => import("@pages/LoginPage"));
const ApplicantPage = lazy(() => import("@pages/Employ/ApplicantPage"));
const MyRecruitPage = lazy(() => import("@pages/Employ/MyRecruitPage"));
const MyGuestHousePage = lazy(() =>
  import("@pages/Guesthouse/MyGuestHousePage")
);
const StoreRegisterPage = lazy(() =>
  import("@pages/Guesthouse/StoreRegisterPage")
);
const ReviewPage = lazy(() => import("@pages/Guesthouse/ReviewPage"));
const ReservationPage = lazy(() => import("@pages/Guesthouse/ReservationPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));

// 공통 Suspense 래퍼
const S = (el) => <Suspense fallback={<div>로딩중…</div>}>{el}</Suspense>;

function RequireAuth({ children }) {
  const accessToken = useUserStore((s) => s.accessToken);
  const [checking, setChecking] = useState(!accessToken);
  const [ok, setOk] = useState(!!accessToken);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (accessToken) return; // 이미 로그인
      const refreshed = await tryRefresh();
      if (!mounted) return;
      setOk(refreshed);
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (checking) return <div>세션 확인 중…</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  // 공개 라우트 (게스트)
  {
    element: <GuestLayout />,
    children: [
      { index: true, element: S(<LandingPage />) }, // /
      { path: "login", element: S(<LoginPage />) }, // /login
    ],
  },

  // 보호 라우트 (유저) — 전부 로그인 필요
  {
    element: <RequireAuth>{S(<UserLayout />)}</RequireAuth>,
    children: [
      // Employ
      { path: "employ/applicant", element: S(<ApplicantPage />) },
      { path: "employ/my-recruit", element: S(<MyRecruitPage />) },

      // Guesthouse
      { path: "guesthouse/my", element: S(<MyGuestHousePage />) },
      { path: "guesthouse/store-register", element: S(<StoreRegisterPage />) },
      { path: "guesthouse/review", element: S(<ReviewPage />) },
      { path: "reservation", element: S(<ReservationPage />) },

      // 기타
      { path: "profile", element: S(<ProfilePage />) },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
