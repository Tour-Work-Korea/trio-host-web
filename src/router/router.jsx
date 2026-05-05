/* eslint-disable react/prop-types */
import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import GuestLayout from "@components/layout/GuestLayout";
import UserLayout from "@components/layout/UserLayout";
import PortalLayout from "@components/layout/PortalLayout";
import useUserStore from "@stores/userStore";
import { bootstrapSession } from "@utils/authFlow";
import PageLoader from "@components/PageLoader";

const LandingPage = lazy(() => import("@pages/LandingPage"));
const LoginPage = lazy(() => import("@pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("@pages/Auth/SignupPage"));
const MyGuesthouseList = lazy(() => import("@pages/MyGuesthouseList"));
const HostDashboardPage = lazy(() => import("@pages/HostDashboardPage"));
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
const SalesAnalysisPage = lazy(() =>
  import("@pages/Guesthouse/SalesAnalysisPage")
);
const NoticePage = lazy(() => import("@pages/NoticePage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));
const EditProfilePage = lazy(() => import("@pages/ProfilePage/EditProfile"));
const TermsPage = lazy(() => import("@pages/LegalPage/TermsPage"));
const PrivacyPage = lazy(() => import("@pages/LegalPage/PrivacyPage"));

// 공통 Suspense 래퍼
const S = (el) => (
  <Suspense fallback={<PageLoader message="페이지를 불러오는 중입니다" />}>
    {el}
  </Suspense>
);

function RequireAuth({ children }) {
  const authenticated = useUserStore((s) => s.authenticated);
  const sessionReady = useUserStore((s) => s.sessionReady);
  const [checking, setChecking] = useState(!sessionReady);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (sessionReady) {
        setChecking(false);
        return;
      }
      const refreshed = await bootstrapSession();
      if (!mounted) return;
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [sessionReady]);

  if (checking) return <div>세션 확인 중…</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  // 공개 라우트 (게스트)
  {
    element: <GuestLayout />,
    children: [
      { index: true, element: S(<LandingPage />) }, // /
      { path: "login", element: S(<LoginPage />) }, // /login
      { path: "signup", element: S(<SignupPage />) }, // /signup
      { path: "find-id", element: S(<FindIdPage />) },
      { path: "find-password", element: S(<FindPasswordPage />) },
      { path: "terms", element: S(<TermsPage />) },
      { path: "privacy", element: S(<PrivacyPage />) },
    ],
  },

  // 포털 라우트 (유저) — 인증되었으나 특정 업체의 관리자 페이지(UserLayout) 전 단계
  {
    element: <RequireAuth>{S(<PortalLayout />)}</RequireAuth>,
    children: [
      { path: "portal", element: S(<MyGuesthouseList />) },
      { path: "guesthouse/store-register", element: S(<StoreRegisterPage />) },
      {
        path: "guesthouse/store-register-form",
        element: S(<StoreRegisterFormPage />),
      },
      { path: "guesthouse/notices", element: S(<NoticePage />) },
      // Index Route for Private Area
      { index: true, element: <Navigate to="/portal" replace /> },
    ],
  },

  // 보호 라우트 (유저) — 개별 업체 관리자 대시보드
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
      // Guesthouse Admin
      { path: "guesthouse/dashboard", element: S(<HostDashboardPage />) },
      { path: "guesthouse/my", element: S(<MyGuesthousePage />) },
      {
        path: "guesthouse/form/:guesthouseId",
        element: S(<GuesthouseFormPage />),
      },
      {
        path: "guesthouse/form/",
        element: S(<GuesthouseFormPage />),
      },
      { path: "guesthouse/review", element: S(<ReviewPage />) },
      { path: "guesthouse/sales", element: S(<SalesAnalysisPage />) },
      { path: "reservation", element: S(<ReservationPage />) },

      // 기타
      { path: "profile", element: S(<ProfilePage />) },
      { path: "profile/edit", element: S(<EditProfilePage />) },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);
