import React, { useEffect, useState } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import { ChevronRight, Plus, CheckCircle2, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import guesthouseApi from "@api/guesthouseApi";
import useUserStore from "@stores/userStore";

export default function HostHomePage() {
  const { guesthouses, setActiveGuesthouseId } = useGuesthouseStore();
  const { profile } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await guesthouseApi.getMyApplications();
        if (res.data && Array.isArray(res.data)) {
          setApplications(res.data);
        } else if (res.data?.content && Array.isArray(res.data.content)) {
          setApplications(res.data.content);
        } else if (res.data && !Array.isArray(res.data)) {
           // 단일 객체로 올 수도 있음
           setApplications([res.data]);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // [스마트 전환 로직] 
  // 업체가 승인 완료된 1개 뿐이고 심사중인 내역이 없을 경우, 포털을 스킵하고 바로 대시보드로 이동
  useEffect(() => {
    if (!loading) {
      const preventAutoRedirect = location.state?.preventAutoRedirect;
      if (!preventAutoRedirect && guesthouses.length === 1 && applications.length === 0) {
        const autoGuesthouseId = guesthouses[0].guesthouseId || guesthouses[0].id;
        setActiveGuesthouseId(autoGuesthouseId);
        navigate("/guesthouse/dashboard", { replace: true });
      }
    }
  }, [loading, guesthouses, applications, location.state, navigate, setActiveGuesthouseId]);

  const handleCardClick = (guesthouseId) => {
    setActiveGuesthouseId(guesthouseId);
    navigate("/guesthouse/dashboard");
  };

  const totalCount = guesthouses.length + applications.length;

  return (
    <div className="max-w-6xl w-full mx-auto pb-24 pt-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 헤더 타이틀 & 등록 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-grayscale-900 tracking-tight flex items-center gap-2">
            내 업체 <span className="text-primary-blue bg-blue-50 px-2 py-0.5 rounded-lg text-2xl">{totalCount}</span>
          </h1>
          <p className="text-grayscale-500 font-medium mt-1">
            어떤 업체를 관리하시겠어요? 원하는 매장을 선택하여 대시보드로 이동하세요.
          </p>
        </div>
        <button 
          onClick={() => navigate("/guesthouse/store-register-form")}
          className="bg-grayscale-900 hover:bg-grayscale-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          새 게스트하우스 등록
        </button>
      </div>

      {/* 1. 마케팅 배너 (PC와이드) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-blue-100 hover:shadow-md transition cursor-pointer group">
        <div>
          <span className="inline-block px-3 py-1 bg-white text-primary-orange font-bold text-xs rounded-full shadow-sm mb-3">
            사장님 지원 혜택
          </span>
          <h2 className="text-grayscale-900 font-extrabold text-xl sm:text-2xl leading-snug mb-2">
            제휴 게스트하우스 대상 홍보 콘텐츠 제작 지원
          </h2>
          <p className="text-grayscale-600 font-medium whitespace-pre-wrap">
            <strong className="text-primary-blue">게딱지 인증 마크</strong>를 달고 숙소를 홍보해보세요. 담당자가 직접 방문하여 인스타 릴스를 만들어 드립니다!
          </p>
        </div>
        <div className="flex items-center gap-2 font-bold text-primary-blue bg-white px-5 py-3 rounded-xl shadow-sm group-hover:bg-primary-blue group-hover:text-white transition-colors">
          신청하기 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 2. 업체 갤러리 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        {/* 심사 중인 업체 (Applications) */}
        {applications.map((app, idx) => (
          <div 
            key={`app-${app.applicationId || idx}`} 
            className="flex flex-col bg-white border border-grayscale-200 rounded-2xl overflow-hidden shadow-sm opacity-90 transition-all hover:shadow-md"
          >
            {/* 커버 이미지 영역 */}
            <div className="aspect-video bg-grayscale-100 relative mb-4">
              {app.profileImg ? (
                 <img src={app.profileImg} alt={app.name} className="w-full h-full object-cover filter grayscale opacity-80" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-grayscale-400">
                  <Clock className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-bold">이미지 준비중</span>
                </div>
              )}
              {/* 심사중 뱃지 */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-red-100 text-red-500 rounded-lg text-sm font-extrabold shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                등록 심사중
              </div>
            </div>

            {/* 업체 정보 영역 */}
            <div className="px-5 pb-6">
              <h4 className="text-lg font-extrabold text-grayscale-900 mb-1 line-clamp-1">{app.name || "이름 없는 업체"}</h4>
              <p className="text-sm text-grayscale-500 font-medium">관리자 승인 후 대시보드가 열립니다.</p>
            </div>
          </div>
        ))}

        {/* 운영중인 업체 (Guesthouses) */}
        {guesthouses.map((gh) => {
          const gId = gh.guesthouseId || gh.id;
          return (
            <div 
              key={`gh-${gId}`} 
              onClick={() => handleCardClick(gId)}
              className="flex flex-col bg-white border border-grayscale-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary-blue/30 transition-all cursor-pointer group"
            >
              {/* 커버 이미지 영역 */}
              <div className="aspect-video bg-grayscale-50 relative border-b border-grayscale-100">
                {gh.guesthouseImageUrl ? (
                   <img src={gh.guesthouseImageUrl} alt={gh.guesthouseName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-grayscale-300 bg-grayscale-100">
                    <span className="text-4xl font-extrabold">{gh.guesthouseName?.charAt(0)}</span>
                  </div>
                )}
                {/* 운영중 뱃지 */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white backdrop-blur-sm text-grayscale-800 rounded-lg text-sm font-extrabold shadow-sm border border-grayscale-100">
                  <CheckCircle2 className="w-4 h-4 text-primary-blue" /> 운영 중
                </div>
              </div>

              {/* 업체 정보 영역 */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-extrabold text-grayscale-900 mb-1 group-hover:text-primary-blue transition-colors line-clamp-1">
                    {gh.guesthouseName}
                  </h4>
                  <p className="text-sm text-grayscale-500 font-medium">관리자 대시보드 입장하기</p>
                </div>
                <div className="mt-4 flex items-center justify-end">
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
                     <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 안내 카드: 항목이 하나도 없을때의 플레이스홀더 (Loading 상태가 아닐때만) */}
        {!loading && totalCount === 0 && (
          <div 
            onClick={() => navigate("/guesthouse/store-register-form")}
            className="flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-grayscale-300 rounded-2xl aspect-[4/3] text-grayscale-400 cursor-pointer hover:border-primary-blue hover:text-primary-blue transition-colors hover:bg-blue-50/50"
          >
            <div className="w-14 h-14 rounded-full bg-grayscale-100 flex items-center justify-center mb-4 group-hover:bg-primary-blue/10">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold">여기를 눌러 새 업체를 추가하세요</p>
          </div>
        )}
      </div>

      {/* 3. 공지사항 */}
      <div className="border-t border-grayscale-200 pt-10 mb-8 max-w-2xl">
        <h3 className="text-lg font-extrabold text-grayscale-900 mb-4 flex items-center gap-1 cursor-pointer hover:text-primary-blue transition-colors">
          게딱지 파트너 센터 공지사항 <ChevronRight className="w-5 h-5 text-grayscale-400" />
        </h3>
        <div className="bg-white border border-grayscale-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg shrink-0">운영안내</span>
            <span className="text-grayscale-800 font-medium group-hover:text-primary-blue truncate">게딱지 사장님 전용 대시보드 베타 오픈 안내</span>
          </div>
          <div className="border-t border-grayscale-100" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-lg shrink-0">마케팅</span>
            <span className="text-grayscale-800 font-medium group-hover:text-primary-blue truncate">여름 성수기 트래픽 대비 안정화 점검 완료</span>
          </div>
        </div>
      </div>

    </div>
  );
}
