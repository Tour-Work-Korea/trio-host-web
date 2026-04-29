import React, { useState, useEffect } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import adminApi from "@api/adminApi";

const NOTICE_CATEGORY_MAP = {
  OPERATIONS: { label: "운영안내", bgColor: "bg-blue-100", textColor: "text-blue-600" },
  MARKETING: { label: "마케팅", bgColor: "bg-pink-100", textColor: "text-pink-600" },
  POLICY: { label: "정책", bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
  EVENT: { label: "이벤트", bgColor: "bg-green-100", textColor: "text-green-600" },
};

const formatNoticeDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const MarkdownText = ({ text }) => {
  if (!text) return null;
  // 간단한 마크다운 파서 제공 (제목, 볼드체, 줄바꿈)
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function NoticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNoticeId, setSelectedNoticeId] = useState(location.state?.selectedNoticeId || null);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      setLoadingList(true);
      try {
        const res = await adminApi.getAdminNotices({ 
          category: searchCategory || undefined,
          q: searchKeyword.trim() || undefined
        });
        const items = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.items) ? res.data.items : []);
        setNotices(items);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setLoadingList(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchNotices();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchCategory, searchKeyword]);

  useEffect(() => {
    if (selectedNoticeId) {
      const fetchDetail = async () => {
        setLoadingDetail(true);
        try {
          const res = await adminApi.getAdminNoticeDetail(selectedNoticeId);
          setSelectedNotice(res.data);
        } catch(error) {
          console.error("Failed to fetch notice detail:", error);
        } finally {
          setLoadingDetail(false);
        }
      };
      fetchDetail();
    } else {
      setSelectedNotice(null);
    }
  }, [selectedNoticeId]);

  const handleBack = () => {
    if (selectedNoticeId) {
      setSelectedNoticeId(null);
      // location state 비우기
      navigate(".", { replace: true, state: {} });
    } else {
      navigate(-1);
    }
  };

  const currentNotices = notices.map(item => ({
    id: item.id,
    categoryLabel: item.categoryLabel || item.category,
    categoryInfo: NOTICE_CATEGORY_MAP[item.category] || NOTICE_CATEGORY_MAP.OPERATIONS,
    title: item.title,
    date: formatNoticeDate(item.publishedAt || item.updatedAt),
  }));

  const detailInfo = selectedNotice ? {
    id: selectedNotice.id,
    categoryLabel: selectedNotice.categoryLabel || selectedNotice.category,
    categoryInfo: NOTICE_CATEGORY_MAP[selectedNotice.category] || NOTICE_CATEGORY_MAP.OPERATIONS,
    title: selectedNotice.title,
    date: formatNoticeDate(selectedNotice.publishedAt || selectedNotice.updatedAt),
    summary: selectedNotice.summary,
    blocks: Array.isArray(selectedNotice.blocks) ? [...selectedNotice.blocks].sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)) : [],
  } : null;

  return (
    <div className="max-w-5xl w-full mx-auto pb-24 pt-10 px-4 sm:px-6">
      
      {selectedNoticeId ? (
        /* Notice Detail View */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div 
            className="flex items-center gap-1.5 text-grayscale-500 font-medium mb-6 text-sm cursor-pointer hover:text-grayscale-900 transition-colors w-fit" 
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4" /> 목록으로 돌아가기
          </div>

          <div className="bg-white border-t-2 border-grayscale-900 pt-10 pb-16 px-6 sm:px-12 min-h-[500px]">
            {loadingDetail ? (
              <div className="flex justify-center items-center h-64 text-grayscale-500 font-medium">상세 공지사항을 불러오는 중...</div>
            ) : detailInfo ? (
              <>
                <div className="border-b border-grayscale-100 pb-8 mb-10 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                    <span className={`inline-block px-2.5 py-1 font-bold text-xs rounded-lg ${detailInfo.categoryInfo.bgColor} ${detailInfo.categoryInfo.textColor}`}>
                      {detailInfo.categoryLabel}
                    </span>
                    <span className="w-1 h-1 bg-grayscale-300 rounded-full hidden sm:block"></span>
                    <span className="text-grayscale-500 font-medium text-sm">{detailInfo.date}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-grayscale-900 leading-snug break-keep">
                    {detailInfo.title}
                  </h1>
                </div>
                
                <div className="text-base sm:text-lg text-grayscale-800 leading-relaxed font-medium mx-auto max-w-3xl">
                  {detailInfo.summary && (
                    <p className="mb-10 p-6 bg-grayscale-50 rounded-2xl whitespace-pre-wrap text-[15px] sm:text-base text-grayscale-600 leading-relaxed font-semibold">
                      {detailInfo.summary}
                    </p>
                  )}
                  
                  {detailInfo.blocks.map((block, idx) => {
                    if (block.type === 'IMAGE' && block.imageUrl) {
                      return (
                        <img 
                          key={`blk-${idx}`} 
                          src={block.imageUrl} 
                          alt="notice content" 
                          className="w-full rounded-2xl my-10 border border-grayscale-100 shadow-sm" 
                        />
                      );
                    }
                    if (block.type === 'TEXT' && block.text) {
                      return <MarkdownText key={`blk-${idx}`} text={block.text} />;
                    }
                    return null;
                  })}
                </div>
                
                <div className="mt-20 pt-8 border-t border-grayscale-100 flex justify-center">
                  <button 
                    onClick={handleBack} 
                    className="px-10 py-3.5 bg-grayscale-100 hover:bg-grayscale-200 text-grayscale-700 font-bold rounded-xl transition-colors text-sm sm:text-base"
                  >
                    목록으로
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-64 text-grayscale-500 font-medium">공지 내용을 찾을 수 없습니다.</div>
            )}
          </div>
        </div>
      ) : (
        /* Notice List View */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-grayscale-900 tracking-tight">공지사항</h1>
            <p className="text-grayscale-500 font-medium mt-2">게스트하우스 딱지의 새로운 소식과 안내를 확인하세요.</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-xl border border-grayscale-200 px-4 py-3 shadow-sm focus-within:border-primary-blue transition-all mb-8 w-full sm:max-w-md ml-auto">
            <select 
              className="bg-transparent text-grayscale-700 text-sm font-semibold border-none outline-none mr-3 pr-3 border-r border-grayscale-200 cursor-pointer"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">전체</option>
              <option value="OPERATIONS">운영</option>
              <option value="MARKETING">마케팅</option>
              <option value="POLICY">정책</option>
              <option value="EVENT">이벤트</option>
            </select>
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              className="flex-1 bg-transparent border-none outline-none text-sm text-grayscale-900 font-medium placeholder-grayscale-400"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Search className="w-5 h-5 text-grayscale-400 ml-2 cursor-pointer" />
          </div>

          {/* List Board */}
          <div className="bg-white border-t-2 border-grayscale-900 shadow-sm">
            {/* Table Header (Desktop) */}
            <div className="hidden sm:flex items-center px-4 py-4 border-b border-grayscale-200 bg-grayscale-50 text-grayscale-500 font-bold text-[13px] text-center">
              <div className="w-28">분류</div>
              <div className="flex-1">제목</div>
              <div className="w-32">등록일</div>
            </div>

            {loadingList ? (
              <div className="flex justify-center items-center h-64 text-grayscale-500 font-medium border-b border-grayscale-200">목록을 불러오는 중...</div>
            ) : currentNotices.length > 0 ? (
              currentNotices.map((notice, idx) => (
                <div 
                  key={notice.id || idx} 
                  onClick={() => setSelectedNoticeId(notice.id)}
                  className="flex flex-col sm:flex-row sm:items-center px-4 py-5 sm:py-4 border-b border-grayscale-200 cursor-pointer hover:bg-grayscale-50 transition-colors group"
                >
                  <div className="w-28 sm:text-center mb-2 sm:mb-0 shrink-0">
                    <span className={`inline-block px-2.5 py-1 font-bold text-[11px] sm:text-xs rounded-lg ${notice.categoryInfo.bgColor} ${notice.categoryInfo.textColor}`}>
                      {notice.categoryLabel}
                    </span>
                  </div>
                  <div className="flex-1 sm:px-6">
                    <h3 className="text-base font-bold text-grayscale-900 group-hover:text-primary-blue transition-colors line-clamp-1 break-all">
                      {notice.title}
                    </h3>
                  </div>
                  <div className="w-32 sm:text-center mt-2 sm:mt-0 text-grayscale-400 font-medium text-xs sm:text-sm shrink-0">
                    {notice.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-64 text-grayscale-500 font-medium border-b border-grayscale-200">등록된 공지사항이 없습니다.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
