import React, { useState } from "react";
import { ChevronLeft, Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoticePage() {
  const navigate = useNavigate();
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const notices = [
    {
      id: 1,
      category: "마케팅",
      categoryColor: "bg-pink-100 text-pink-600",
      title: "무료 인스타 피드 제작 지원 안내",
      date: "2026.04.07",
      content: (
        <div className="space-y-6 text-grayscale-800 leading-relaxed">
          <p className="text-xl font-bold tracking-tight text-grayscale-900 border-b border-grayscale-100 pb-6">
            “사장님, 게딱지가 직접 가서 홍보해드려요!” 무료 인스타 피드 제작 지원 안내
          </p>
          <p>
            안녕하세요, 사장님! 게딱지 팀입니다.<br />
            우리 게스트하우스의 매력을 더 널리 알리고 싶은데,<br />
            SNS 홍보가 막막하셨나요?<br />
            게딱지가 사장님들을 위해 <strong className="text-primary-blue">‘인스타그램 홍보 피드’</strong>를 직접 제작해 드립니다!
          </p>

          <div className="bg-grayscale-50 p-6 rounded-2xl border border-grayscale-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-green-500">✅</span> 이런 분들께 추천해요!
            </h3>
            <ul className="space-y-3 font-medium text-grayscale-700">
              <li className="flex items-start gap-2"><span className="text-grayscale-400 font-bold">·</span> 우리 숙소의 감성을 예쁜 피드로 남기고 싶으신 사장님</li>
              <li className="flex items-start gap-2"><span className="text-grayscale-400 font-bold">·</span> 인스타그램 콜라보 게시물로 팔로워를 늘리고 싶으신 사장님</li>
              <li className="flex items-start gap-2"><span className="text-grayscale-400 font-bold">·</span> 직접 다녀온 생생한 후기 형태의 콘텐츠가 필요하신 사장님</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-red-500">📍</span> 지원 내용
            </h3>
            <ul className="space-y-2 font-medium text-grayscale-700">
              <li className="flex items-start gap-2"><span className="text-grayscale-400 font-bold">·</span> 진행 비용: 무료 (현재 프로모션 기간 한정)</li>
              <li className="flex items-start gap-2"><span className="text-grayscale-400 font-bold">·</span> 제작 방식: 게딱지 팀이 직접 방문하여 후기 형식의 콘텐츠 촬영 및 제작</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      category: "운영",
      categoryColor: "bg-blue-100 text-blue-600",
      title: "'게딱지' 사장님 전용 서비스 오픈 안내",
      date: "2026.04.02",
      content: (
        <div className="space-y-6 text-grayscale-800 leading-relaxed">
          <p className="text-xl font-bold tracking-tight text-grayscale-900 border-b border-grayscale-100 pb-6">
            '게딱지' 사장님 전용 서비스가 드디어 공식 오픈했습니다!
          </p>
          <p>
            안녕하세요, 게딱지 팀입니다.<br />
            오랜 준비 끝에 사장님들이 게스트하우스를 더욱 편리하게 관리하실 수 있도록<br />
            <strong>업체 전용 웹 대시보드</strong>와 <strong>관리 시스템</strong>을 런칭하게 되었습니다.
          </p>
          <p className="font-medium text-grayscale-700">
            앞으로 게딱지를 통해 예약 관리, 알바생 채용, 그리고 리뷰 관리까지 한 번에 해결해 보세요.<br />
            늘 사장님들의 목소리에 귀 기울이며 함께 성장하는 게딱지가 되겠습니다. 감사합니다.
          </p>
        </div>
      )
    }
  ];

  const selectedNotice = notices.find(n => n.id === selectedNoticeId);

  return (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 text-grayscale-900 w-fit cursor-pointer mb-8 group" onClick={() => selectedNoticeId ? setSelectedNoticeId(null) : navigate(-1)}>
        <div className="p-2.5 bg-white rounded-full border border-grayscale-100 shadow-sm group-hover:shadow-md transition">
          <ChevronLeft className="w-5 h-5 text-grayscale-800" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">게딱지 공지사항</span>
      </div>

      {selectedNotice ? (
        /* Notice Detail View */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] slide-in-from-right-4 duration-300 animate-in">
          <div className="mb-8">
            <span className={`inline-block px-3 py-1 font-bold text-sm rounded-full mb-4 ${selectedNotice.categoryColor}`}>
              {selectedNotice.category}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-grayscale-900 mb-3">{selectedNotice.title}</h1>
            <div className="text-grayscale-400 font-medium text-sm flex items-center gap-4">
              <span>{selectedNotice.date}</span>
            </div>
          </div>
          <div className="text-lg">
            {selectedNotice.content}
          </div>
        </div>
      ) : (
        /* Notice List View */
        <div className="space-y-6 slide-in-from-left-4 duration-300 animate-in">
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-2xl border border-grayscale-200 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-blue/20 focus-within:border-primary-blue transition-all">
            <select className="bg-transparent text-grayscale-700 font-semibold border-none outline-none mr-4 pr-4 border-r border-grayscale-200 cursor-pointer">
              <option>전체</option>
              <option>마케팅</option>
              <option>운영</option>
            </select>
            <input 
              type="text" 
              placeholder="입력 후 검색하세요" 
              className="flex-1 bg-transparent border-none outline-none text-grayscale-900 font-medium placeholder-grayscale-400"
            />
            <Search className="w-6 h-6 text-grayscale-300 ml-2" />
          </div>

          {/* List */}
          <div className="bg-white rounded-3xl border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] overflow-hidden">
            {notices.map((notice, idx) => (
              <div 
                key={notice.id} 
                onClick={() => setSelectedNoticeId(notice.id)}
                className={`p-6 sm:p-8 cursor-pointer group transition-colors hover:bg-grayscale-50 ${idx !== notices.length - 1 ? "border-b border-grayscale-100" : ""}`}
              >
                <span className={`inline-block px-3 py-1 font-bold text-sm rounded-full mb-3 shadow-sm ${notice.categoryColor}`}>
                  {notice.category}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-grayscale-900 mb-2 group-hover:text-primary-blue transition-colors">
                  {notice.title}
                </h3>
                <p className="text-grayscale-400 font-semibold text-sm">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
