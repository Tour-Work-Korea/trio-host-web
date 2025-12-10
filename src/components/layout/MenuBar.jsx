import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@stores/userStore";
import { formatPhoneKR } from "@utils/formatPhone";

const linkBase = "px-2 py-1 rounded-md transition-colors text-sm";
const linkActive = "text-primary-orange font-semibold";
const linkIdle = "text-grayscale-800 hover:text-primary-orange";

export default function MenuBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //프로필 정보
  const profile = useUserStore((s) => s.profile);

  const guesthouseLinks = [
    { to: "/guesthouse/my", label: "나의 게스트하우스" },
    { to: "/reservation", label: "예약 관리" },
    { to: "/guesthouse/review", label: "리뷰 관리" },
    { to: "/guesthouse/store-register", label: "입점 신청" },
  ];
  const employLinks = [
    { to: "/employ/my-recruit", label: "나의 공고" },
    { to: "/employ/applicant", label: "지원자 조회" },
  ];

  const isActivePath = (to) => pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="space-y-12">
      {/* 유저 프로필 */}
      <div className="flex-col">
        <div className="bg-white flex items-end gap-3">
          <div className="bg-white flex items-center gap-3">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                width={20}
                className="w-20 min-w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-lg" />
            )}
          </div>
          <div className="flex flex-col w-full items-start gap-2">
            <p className="font-semibold">{profile.name}</p>
            <button
              onClick={() => navigate("/profile")}
              className="cursor-pointer border-1 border-grayscale-300 px-2 text-sm rounded-full text-grayscale-500"
            >
              프로필 수정
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex gap-4">
            <div className="text-grayscale-400">연락처</div>
            <div>{formatPhoneKR(profile.phone)}</div>
          </div>
          <div className="flex gap-4">
            <div className="text-grayscale-400">이메일</div>
            <div>{profile.email}</div>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="bg-white">
        {/* 게스트하우스 */}
        <div>
          <div
            className={`font-bold text-lg ${
              pathname.startsWith("/guesthouse") ||
              pathname.startsWith("/reservation")
                ? "text-orange-blue"
                : ""
            }`}
          >
            게스트하우스
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            {guesthouseLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={`${linkBase} ${
                  isActivePath(l.to) ? linkActive : linkIdle
                }`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 채용 */}
        <div className="mt-8">
          <div
            className={`font-bold text-lg ${
              pathname.startsWith("/employ") ? "text-orange-blue" : ""
            }`}
          >
            알바
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            {employLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={`${linkBase} ${
                  isActivePath(l.to) ? linkActive : linkIdle
                }`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
