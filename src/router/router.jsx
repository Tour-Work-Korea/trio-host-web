/* eslint-disable react/prop-types */
import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import GuestLayout from "@components/layout/GuestLayout";
import UserLayout from "@components/layout/UserLayout";
import useUserStore from "@stores/userStore";
import { tryRefresh } from "@utils/authFlow";
import PageLoader from "@components/PageLoader";

const LandingPage = lazy(() => import("@pages/LandingPage"));
const LoginPage = lazy(() => import("@pages/Auth/LoginPage"));
const FindIdPage = lazy(() => import("@pages/Auth/FindIdPage"));
const FindPasswordPage = lazy(() => import("@pages/Auth/FindPasswordPage"));
const ApplicantPage = lazy(() => import("@pages/Employ/ApplicantPage"));
const MyRecruitPage = lazy(() => import("@pages/Employ/MyRecruitPage"));
const RecruitFormPage = lazy(() => import("@pages/Employ/RecruitFormPage"));
const MyGuesthousePage = lazy(() =>
  import("@pages/Guesthouse/MyGuesthousePage")
);
const GuesthouseFormPage = lazy(() =>
  import("@pages/Guesthouse/GuesthouseFormPage")
);
const StoreRegisterPage = lazy(() =>
  import("@pages/Guesthouse/StoreRegisterPage")
);
const StoreRegisterFormPage = lazy(() =>
  import("@pages/Guesthouse/StoreRegisterFormPage")
);
const ReviewPage = lazy(() => import("@pages/Guesthouse/ReviewPage"));
const ReservationPage = lazy(() => import("@pages/Guesthouse/ReservationPage"));
const ReservationCalendarPage = lazy(() =>
  import("@pages/Guesthouse/ReservationCalendarPage")
);
const RoomManagementPage = lazy(() =>
  import("@pages/Guesthouse/RoomManagementPage")
);
const ProfilePage = lazy(() => import("@pages/ProfilePage"));

// 공통 Suspense 래퍼
const S = (el) => (
  <Suspense fallback={<PageLoader message="페이지를 불러오는 중입니다" />}>
    {el}
  </Suspense>
);

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
      { path: "find-id", element: S(<FindIdPage />) },
      { path: "find-password", element: S(<FindPasswordPage />) },
    ],
  },

  // 보호 라우트 (유저) — 전부 로그인 필요
  {
    element: <RequireAuth>{S(<UserLayout />)}</RequireAuth>,
    children: [
      // Employ
      { path: "employ/applicant", element: S(<ApplicantPage />) },
      { path: "employ/my-recruit", element: S(<MyRecruitPage />) },
      {
        path: "employ/recruit-form",
        element: S(<RecruitFormPage />),
      },
      {
        path: "employ/recruit-form/:recruitId",
        element: S(<RecruitFormPage />),
      },
      // Guesthouse
      { path: "guesthouse/my", element: S(<MyGuesthousePage />) },
      {
        path: "guesthouse/form/:guesthouseId",
        element: S(<GuesthouseFormPage />),
      },
      {
        path: "guesthouse/form/",
        element: S(<GuesthouseFormPage />),
      },
      { path: "guesthouse/store-register", element: S(<StoreRegisterPage />) },
      {
        path: "guesthouse/store-register-form",
        element: S(<StoreRegisterFormPage />),
      },
      { path: "guesthouse/review", element: S(<ReviewPage />) },
      { path: "reservation", element: S(<ReservationPage />) },
      { path: "reservation-calendar", element: S(<ReservationCalendarPage />) },
      { path: "room-management", element: S(<RoomManagementPage />) },

      // 기타
      { path: "profile", element: S(<ProfilePage />) },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
