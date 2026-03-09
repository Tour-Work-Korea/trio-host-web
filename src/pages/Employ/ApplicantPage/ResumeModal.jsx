/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import employApi from "@api/employApi";
import { formatDateToDot } from "@utils/formatDate";
import xBtn from "@assets/images/x_gray.svg";

// 태그 컴포넌트(보기 전용)
function TagPills({ tags }) {
  if (!Array.isArray(tags) || tags.length === 0)
    return <p className=" text-gray-400">태그가 없습니다</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t, i) => (
        <span
          key={`${t?.hashtag || t}-${i}`}
          className="px-3 py-1 rounded-full bg-gray-100 font-medium text-blue-700"
        >
          {t?.hashtag}
        </span>
      ))}
    </div>
  );
}

// 경력 섹션(보기 전용)
function ExperienceList({ experiences }) {
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return <p className=" text-gray-400">경력 정보가 없습니다</p>;
  }
  return (
    <div className="space-y-0 border-1 p-4 border-grayscale-200 rounded-lg">
      {experiences.map((exp, idx) => (
        <div key={idx} className="flex gap-3">
          {/* 타임라인 라인 */}
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-primary-orange" />
            {idx !== experiences.length - 1 && (
              <div className="w-0.5 grow bg-primary-orange " />
            )}
          </div>
          {/* 내용 */}
          <div className="flex-1 mb-2">
            <p className="text-sm text-gray-400">
              {formatDateToDot(exp?.startDate)} -{" "}
              {formatDateToDot(exp?.endDate)}
            </p>
            <p className="text-lg font-medium text-gray-800 mt-1">
              {exp?.companyName || "-"}
            </p>
            {exp?.workType && (
              <p className="text-sm text-gray-500">{exp.workType}</p>
            )}
            {exp?.description && (
              <p className=" text-gray-700 whitespace-pre-line">
                {exp.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// 프로필 헤더(보기 전용)
function ProfileHeader({ data }) {
  const name = data?.name || data?.nickname || "이름 미상";
  const gender =
    data?.gender === "F" ? "여자" : data?.gender === "M" ? "남자" : "";
  const age = data?.age ? `${data.age}세` : "";
  const birth = data?.birthDate
    ? `${data.birthDate?.split?.("-")?.[0]}년생`
    : "";
  const meta = [gender, age, birth].filter(Boolean).join(" • ");

  return (
    <section className="rounded-lg bg-neutral-white p-4">
      <div className="grid grid-cols-2 gap-8 items-start">
        {/* 사진: 가로=세로 */}
        <div className="w-full aspect-square rounded-lg bg-gray-200 overflow-hidden">
          {data?.photoUrl ? (
            <img
              src={data.photoUrl}
              alt=""
              className="size-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="size-full grid place-items-center text-gray-400 text-sm">
              no image
            </div>
          )}
        </div>

        {/* 기본 정보: 나머지 반 */}
        <div className="flex flex-col justify-center h-full gap-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900">{name}</p>
          <p className=" text-gray-500">{meta}</p>

          <div className="grid grid-cols-[64px_1fr] gap-y-1 mt-2">
            <span className=" text-gray-400">연락처</span>
            <span className=" text-gray-900">{data?.phone || "-"}</span>
            <span className=" text-gray-400">이메일</span>
            <span className=" text-gray-900 break-all">
              {data?.email || "-"}
            </span>
            <span className=" text-gray-400">MBTI</span>
            <span className=" text-gray-900">
              {data?.mbti || data?.resumeMbti || "-"}
            </span>
            {data?.instagramId && (
              <>
                <span className=" text-gray-400">Insta</span>
                <a
                  href={`https://www.instagram.com/${data.instagramId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-primary-orange"
                >
                  @{data.instagramId}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResumeModal({ visible, onClose, resumeId }) {
  const closeBtnRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({ visible: false, title: "", message: "" });

  // 모달 열릴 때 데이터 조회 + ESC 닫기
  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    closeBtnRef.current?.focus();

    // 스크롤 잠금
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    fetchResume();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, resumeId]);

  const fetchResume = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const res = await employApi.getApplicantDetail(resumeId);
      setResume(res?.data ?? null);
    } catch (error) {
      setErr({
        visible: true,
        title: "지원서 조회 실패",
        message:
          error?.response?.data?.message ||
          "지원서 조회 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-grayscale-900/40 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={() => onClose?.()}
    >
      <div
        className="w-[92%] max-w-3xl h-[90%] rounded-2xl bg-neutral-white px-5 md:px-8 py-5 shadow-xl overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="p-2 w-[20px]" />
          <h2
            id="resume-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            지원서
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="닫기"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => onClose?.()}
          >
            <img src={xBtn} width="20" height="20" aria-hidden="true" />
          </button>
        </div>

        {/* 로딩/에러/본문 */}
        <div className="mt-4 space-y-8">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-28 bg-gray-100 rounded-lg" />
              <div className="h-20 bg-gray-100 rounded-lg" />
              <div className="h-24 bg-gray-100 rounded-lg" />
              <div className="h-40 bg-gray-100 rounded-lg" />
            </div>
          ) : (
            <>
              {/* 프로필 */}
              <ProfileHeader data={resume} />

              {/* 나를 표현하는 한 마디 */}
              <section className="rounded-lg bg-neutral-white p-4">
                <p className=" text-gray-400 mb-2">나를 표현하는 한 마디</p>
                <p className="font-medium text-gray-900">
                  {resume?.resumeTitle || resume?.title || "내용 없음"}
                </p>
              </section>

              {/* 태그 */}
              <section className="rounded-lg bg-neutral-white p-4">
                <div className="flex  gap-2 items-end mb-2">
                  <p className="text-gray-400">태그</p>
                  <p className="text-sm text-primary-blue">
                    나를 표현하는 세 가지 키워드
                  </p>
                </div>
                <TagPills tags={resume?.userHashtag} />
              </section>

              {/* 경력 */}
              <section className="rounded-lg bg-neutral-white p-4">
                <p className="text-gray-400 mb-3">경력</p>
                <ExperienceList
                  experiences={resume?.workExperience || resume?.experiences}
                />
              </section>

              {/* 자기소개 */}
              <section className="rounded-lg bg-neutral-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 mb-3">자기소개</p>
                  <p className="text-sm text-gray-400">
                    <span className="text-orange-500">
                      {(resume?.selfIntro?.length || 0).toLocaleString()}
                    </span>
                    /50,000
                  </p>
                </div>
                <div className="mt-2 border border-gray-200 rounded-xl p-4 max-h-[450px] overflow-auto">
                  <p className="whitespace-pre-wrap  leading-6 text-gray-900">
                    {resume?.selfIntro || "자기소개가 없습니다"}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
