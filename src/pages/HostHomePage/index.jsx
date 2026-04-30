import React, { useEffect, useState, useRef } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import { ChevronRight, Plus, CheckCircle2, Clock, MoreVertical, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import guesthouseApi from "@api/guesthouseApi";
import adminApi from "@api/adminApi";
import useUserStore from "@stores/userStore";
import { uploadSingleImageToS3Web } from "@utils/s3ImageWeb";

const NOTICE_CATEGORY_MAP = {
  OPERATIONS: { label: "운영안내", bgColor: "bg-blue-50", textColor: "text-blue-600" },
  MARKETING: { label: "마케팅", bgColor: "bg-pink-50", textColor: "text-pink-600" },
  POLICY: { label: "정책", bgColor: "bg-yellow-50", textColor: "text-yellow-600" },
  EVENT: { label: "이벤트", bgColor: "bg-green-50", textColor: "text-green-600" },
};

export default function HostHomePage() {
  const { guesthouses, setActiveGuesthouseId } = useGuesthouseStore();
  const { profile } = useUserStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState([]);
  const [homeNotices, setHomeNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kebab Menu & Delete Modal State
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Edit Profile Modal State
  const [editTargetGh, setEditTargetGh] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleEditInfo = (e, gh) => {
    e.stopPropagation();
    setMenuOpenId(null);
    setEditTargetGh(gh);
    setEditName(gh.guesthouseName || "");
    setEditImagePreview(
      gh.thumbnailImg || gh.guesthouseProfileImageUrl || gh.guesthouseImageUrl || gh.profileImageUrl || gh.imgUrl || ""
    );
    setEditImageFile(null);
  };

  const handleCloseEditModal = () => {
    setEditTargetGh(null);
    setEditName("");
    setEditImagePreview("");
    setEditImageFile(null);
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
      e.target.value = null;
    }
  };

  const confirmEditProfile = async () => {
    if (!editName.trim()) return alert("게스트하우스 이름을 입력해주세요.");
    
    setIsSubmitting(true);
    try {
      let finalImageUrl = editImagePreview; // 기존 url 유지 기본값
      
      // 새 썸네일 등록 시 S3 업로드
      if (editImageFile) {
        finalImageUrl = await uploadSingleImageToS3Web(editImageFile);
      }

      // 스웨거에 적힌 /profile 전용 구조
      const payload = {
        guesthouseName: editName.trim(),
        profileImageUrl: finalImageUrl,
      };

      // 백엔드에서 쿠키를 통해 자체 검증한다고 하셨으므로 어떤 페이로드나 더미 id도 넣지 않습니다! 완벽하게 깔끔한 호출입니다.
      await guesthouseApi.updateGuesthouseProfile(editTargetGh.guesthouseId || editTargetGh.id, payload);

      alert("프로필이 성공적으로 수정되었습니다.");
      window.location.reload();
    } catch(err) {
       console.error("프로필 수정 오류:", err);
       alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (e, gId) => {
    e.stopPropagation();
    setMenuOpenId(null);
    setDeleteTargetId(gId);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await guesthouseApi.deleteGuesthouse(deleteTargetId);

      // 알림 표출 및 새로고침으로 화면 갱신
      alert("게스트하우스가 안전하게 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("게스트하우스 삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // 입점 신청(심사 중) 목록에 있는 게스트하우스 이름들 수집
  const pendingNames = applications.map(app => {
    const tempGh = app.guesthouse || app.tempGuesthouse || app;
    return tempGh.guesthouseName || app.guesthouseName || app.businessName || app.name;
  }).filter(Boolean);

  // 승인 완료되어 실제 운영 중인 게스트하우스만 필터링 (임시 생성된 심사 중 객체 제외)
  const activeGuesthouses = guesthouses.filter(gh => {
    const s = gh.status ? gh.status.toString().toUpperCase() : "";
    const isPending = s.includes("대기") || s.includes("심사") || s.includes("PENDING") || s.includes("WAIT");
    const isStillInApplications = pendingNames.includes(gh.guesthouseName);
    
    // 상태 텍스트에 심사/대기 키워드가 있거나, 아직 심사 중 목록(Applications)에 이름이 있다면 무조건 제외!
    return !isPending && !isStillInApplications;
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await guesthouseApi.getMyApplications();
        let items = [];
        if (res.data && Array.isArray(res.data)) {
          items = res.data;
        } else if (res.data?.content && Array.isArray(res.data.content)) {
          items = res.data.content;
        } else if (res.data && !Array.isArray(res.data)) {
          // 단일 객체로 올 수도 있음
          items = [res.data];
        }
        
        // 승인된 내역은 대시보드 심사중 목록에서 제외
        const pendingItems = items.filter(
          item => item.status !== "승인 완료" && item.status !== "APPROVED"
        );
        setApplications(pendingItems);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHomeNotices = async () => {
      try {
        const res = await adminApi.getHomeNotices();
        const data = res.data;
        const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
        setHomeNotices(items.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch home notices:", error);
      }
    };

    fetchApplications();
    fetchHomeNotices();
  }, []);

  // [스마트 전환 로직] 
  // 게스트하우스가 승인 완료된 1개 뿐이고 심사중인 내역이 없을 경우, 포털을 스킵하고 바로 대시보드로 이동
  useEffect(() => {
    if (!loading) {
      const preventAutoRedirect = location.state?.preventAutoRedirect;
      if (!preventAutoRedirect && activeGuesthouses.length === 1 && applications.length === 0) {
        const autoGuesthouseId = activeGuesthouses[0].guesthouseId || activeGuesthouses[0].id;
        setActiveGuesthouseId(autoGuesthouseId);
        navigate("/guesthouse/dashboard", { replace: true });
      }
    }
  }, [loading, activeGuesthouses, applications, location.state, navigate, setActiveGuesthouseId]);

  const handleCardClick = (guesthouseId) => {
    setActiveGuesthouseId(guesthouseId);
    navigate("/guesthouse/dashboard");
  };

  const totalCount = activeGuesthouses.length + applications.length;

  return (
    <div className="max-w-6xl w-full mx-auto pb-24 pt-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 헤더 타이틀 & 등록 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-grayscale-900 tracking-tight flex items-center gap-2">
            내 게스트하우스 <span className="text-primary-blue bg-blue-50 px-2 py-0.5 rounded-lg text-2xl">{totalCount}</span>
          </h1>
          <p className="text-grayscale-500 font-medium mt-1">
            어떤 게스트하우스를 관리하시겠어요? 원하는 숙소를 선택하여 대시보드로 이동하세요.
          </p>
        </div>
        <button
          onClick={() => navigate("/guesthouse/store-register-form")}
          className="bg-grayscale-700 hover:bg-grayscale-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          새 게스트하우스 등록
        </button>
      </div>

      {/* 상단 대시보드 위젯 영역 (마케팅 & 공지사항) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">

        {/* 1. 마케팅 배너 (좌측 위젯) */}
        <div
          onClick={() => window.open('https://www.instagram.com/guesthouse_ddakji/', '_blank')}
          className="lg:col-span-6 xl:col-span-7 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-10 sm:gap-20 shadow-sm border border-blue-100 hover:shadow-md transition cursor-pointer group overflow-hidden relative h-full"
        >
          {/* 데코레이션 배경 요소 */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>

          {/* 텍스트 및 버튼 영역 */}
          <div className="flex flex-col items-start z-10 w-full sm:w-auto max-w-lg">
            <span className="inline-block px-3 py-1 bg-white text-primary-orange font-bold text-[11px] sm:text-xs rounded-full shadow-sm mb-3 mt-1">
              사장님 지원 혜택
            </span>
            <h2 className="text-grayscale-900 font-extrabold text-xl leading-snug mb-2 break-keep sm:whitespace-nowrap">
              게스트하우스 대상 홍보 콘텐츠 제작 지원
            </h2>
            <p className="text-grayscale-600 text-sm font-medium whitespace-pre-wrap mb-5 leading-relaxed break-keep">
              <strong className="text-primary-blue">게딱지 인증 마크</strong>를 달고 숙소를 홍보해보세요. <br className="hidden xl:block" />담당자가 직접 방문하여 인스타 포스트를 만들어 드립니다!
            </p>
            <div className="flex items-center gap-1.5 font-bold text-sm text-primary-blue bg-white px-4 py-2.5 rounded-xl shadow-sm group-hover:bg-primary-blue group-hover:text-white transition-colors mt-auto">
              신청하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 썸네일 이미지 영역 */}
          <div className="shrink-0 relative z-10 mt-6 sm:mt-0">
            <div className="w-36 sm:w-44 aspect-[4/5] bg-white p-1.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-grayscale-100 transform rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500">
              <div className="w-full h-full rounded-lg overflow-hidden bg-grayscale-50 relative group/img">
                <img
                  src="/images/promotion_sample.png"
                  alt="홍보 콘텐츠 예시"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* 이미지 로드 실패시 보일 플레이스홀더 */}
                <div className="absolute inset-0 flex-col items-center justify-center bg-blue-50/50 text-primary-blue hidden">
                  <span className="text-[10px] sm:text-xs font-bold text-center px-1 leading-tight">
                    사진을<br />넣어주세요
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 공지사항 (우측 위젯) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white border border-grayscale-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <h3
            className="text-base sm:text-lg font-extrabold text-grayscale-900 mb-5 flex items-center justify-between cursor-pointer hover:text-primary-blue transition-colors group"
            onClick={() => navigate('/guesthouse/notices')}
          >
            파트너 센터 공지사항
            <div className="w-8 h-8 rounded-full bg-grayscale-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-grayscale-400 group-hover:text-primary-blue" />
            </div>
          </h3>

          <div className="flex flex-col gap-4 flex-1 justify-center">
            {homeNotices.length > 0 ? (
              homeNotices.map((notice, idx) => {
                const categoryInfo = NOTICE_CATEGORY_MAP[notice.category] || NOTICE_CATEGORY_MAP.OPERATIONS;
                return (
                  <React.Fragment key={notice.id || idx}>
                    <div
                      className="flex items-start sm:items-center gap-3 cursor-pointer group"
                      onClick={() => navigate('/guesthouse/notices', { state: { selectedNoticeId: notice.id } })}
                    >
                      <span className={`px-2.5 py-1.5 ${categoryInfo.bgColor} ${categoryInfo.textColor} text-[11px] font-bold rounded-lg shrink-0 mt-0.5 sm:mt-0 leading-none`}>
                        {notice.categoryLabel || categoryInfo.label}
                      </span>
                      <span className="text-grayscale-800 text-sm font-medium group-hover:text-primary-blue line-clamp-2 sm:line-clamp-1 leading-snug">
                        {notice.title}
                      </span>
                    </div>
                    {idx < homeNotices.length - 1 && (
                      <div className="border-t border-grayscale-100" />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="text-sm text-grayscale-500 font-medium text-center py-4">등록된 공지사항이 없습니다.</div>
            )}
          </div>
        </div>

      </div>

      {/* 3. 게스트하우스 갤러리 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

        {/* 심사 중인 게스트하우스 (Applications) */}
        {applications.map((app, idx) => {
          // 이름 및 이미지 경로 탐색 모듈 (객체 깊이 등 고려)
          const tempGh = app.guesthouse || app.tempGuesthouse || app;

          const appName = tempGh.guesthouseName || app.guesthouseName || app.businessName || app.name || "이름 없는 게스트하우스";

          const appImage = app.thumbnailImg || app.guesthouseProfileImageUrl || tempGh.thumbnailImg || tempGh.guesthouseProfileImage || tempGh.guesthouseImageUrl || tempGh.profileImg || 
            app.guesthouseProfileImage || app.guesthouseImageUrl || app.profileImg || app.profileImageUrl || app.imgUrl || app.img || app.imageUrl;

          return (
            <div
              key={`app-${app.applicationId || app.recruitId || app.id || idx}`}
              className="flex flex-col bg-white border border-grayscale-200 rounded-2xl overflow-hidden shadow-sm opacity-90 transition-all hover:shadow-md"
            >
              {/* 커버 이미지 영역 (고정 비율 강제) */}
              <div className="relative w-full pt-[70%] bg-grayscale-50 border-b border-grayscale-100 overflow-hidden">
                {appImage ? (
                  <img
                    src={appImage}
                    alt={appName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-grayscale-400 p-2 text-center bg-grayscale-50">
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

              {/* 게스트하우스 정보 영역 */}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-extrabold text-grayscale-900 mb-2 line-clamp-1">
                  {appName}
                </h4>
                <p className="text-sm text-grayscale-500 font-medium line-clamp-1">관리자 승인 후 대시보드가 열립니다.</p>
              </div>
            </div>
          );
        })}

        {/* 운영중인 게스트하우스 (Guesthouses) */}
        {activeGuesthouses.map((gh) => {
          const gId = gh.guesthouseId || gh.id;
          return (
            <div
              key={`gh-${gId}`}
              onClick={() => handleCardClick(gId)}
              className="flex flex-col bg-white border border-grayscale-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary-blue/30 transition-all cursor-pointer group"
            >
              {/* 커버 이미지 영역 (고정 비율 강제) */}
              <div className="relative w-full pt-[70%] bg-grayscale-50 border-b border-grayscale-100 overflow-hidden">
                {(gh.thumbnailImg || gh.guesthouseProfileImageUrl || gh.guesthouseImageUrl || gh.profileImageUrl || gh.imgUrl) ? (
                  <img src={gh.thumbnailImg || gh.guesthouseProfileImageUrl || gh.guesthouseImageUrl || gh.profileImageUrl || gh.imgUrl} alt={gh.guesthouseName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center text-grayscale-300 bg-grayscale-100">
                    <span className="text-4xl font-extrabold">{gh.guesthouseName?.charAt(0)}</span>
                  </div>
                )}
                {/* 운영중 뱃지 */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white backdrop-blur-sm text-grayscale-800 rounded-lg text-sm font-extrabold shadow-sm border border-grayscale-100">
                  <CheckCircle2 className="w-4 h-4 text-primary-blue" /> 운영 중
                </div>

                {/* 메뉴 버튼 */}
                <div className="absolute top-4 right-4 z-20 w-9 h-9 border border-grayscale-200 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-grayscale-100 transition shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === gId ? null : gId);
                  }}
                >
                  <MoreVertical className="w-5 h-5 text-grayscale-700" />
                  
                  {/* 드롭다운 메뉴 및 오버레이 */}
                  {menuOpenId === gId && (
                    <>
                      {/* 바탕 오버레이 (클릭 시 메뉴 닫힘) */}
                      <div 
                        className="fixed inset-0 z-30 cursor-default"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(null);
                        }}
                      />
                      <div className="absolute top-11 right-0 w-[140px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-grayscale-200 overflow-hidden z-40 animate-in zoom-in-95 duration-150">
                        <div 
                          className="px-4 py-3.5 text-sm font-bold text-grayscale-800 hover:bg-grayscale-50 cursor-pointer border-b border-grayscale-100 transition-colors"
                          onClick={(e) => handleEditInfo(e, gh)}
                        >
                          정보수정
                        </div>
                        <div 
                          className="px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                          onClick={(e) => handleDeleteRequest(e, gId)}
                        >
                          게스트하우스 삭제
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 게스트하우스 정보 영역 */}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-extrabold text-grayscale-900 mb-2 group-hover:text-primary-blue transition-colors line-clamp-1">
                  {gh.guesthouseName}
                </h4>
                <p className="text-sm text-grayscale-500 font-medium line-clamp-1">
                  관리자 대시보드 입장하기
                </p>
                
                <div className="mt-auto pt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue">
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
            <p className="font-bold">여기를 눌러 새 게스트하우스를 추가하세요</p>
          </div>
        )}
      </div>

      {/* 게스트하우스 삭제 경고 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDeleteTargetId(null)}
              className="absolute top-4 right-4 p-1 text-grayscale-400 hover:text-grayscale-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 pt-10 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-extrabold text-grayscale-900 mb-2">삭제하시겠습니까?</h3>
              <p className="text-sm text-grayscale-500 leading-relaxed mb-8">
                삭제하시면 복구되지 않으며, <br />새롭게 게스트하우스 등록을 진행하셔야 합니다.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-3.5 rounded-xl bg-grayscale-100 text-grayscale-700 font-bold hover:bg-grayscale-200 transition"
                >
                  취소
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-sm shadow-red-500/20"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 정보 수정 모달 (경량) */}
      {editTargetGh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-5 border-b border-grayscale-100 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-grayscale-900">프로필 수정</h3>
              <button 
                onClick={handleCloseEditModal}
                className="p-1 text-grayscale-400 hover:text-grayscale-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {/* 이미지 썸네일 수정 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-grayscale-700">대표 썸네일 이미지</label>
                <div 
                  className="w-full relative pt-[70%] bg-grayscale-50 border border-grayscale-200 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editImagePreview ? (
                    <img 
                      src={editImagePreview} 
                      alt="preview" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-grayscale-400">
                      <Plus className="w-8 h-8 mb-1" />
                      <span className="text-sm font-medium">터치하여 사진 검색</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-grayscale-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    사진 변경
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                />
              </div>

              {/* 게스트하우스 이름 수정 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-grayscale-700">게스트하우스 명</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="게스트하우스 이름을 입력하세요"
                  className="w-full px-4 py-3.5 border border-grayscale-200 rounded-xl font-medium focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition"
                />
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex gap-3">
              <button 
                onClick={handleCloseEditModal}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl bg-grayscale-100 text-grayscale-700 font-bold hover:bg-grayscale-200 transition"
              >
                취소
              </button>
              <button 
                onClick={confirmEditProfile}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl bg-primary-blue text-white font-bold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isSubmitting ? "업로드 중..." : "수정 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
