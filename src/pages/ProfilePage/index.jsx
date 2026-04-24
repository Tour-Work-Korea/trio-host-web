import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@stores/userStore";
import useGuesthouseStore from "@stores/guesthouseStore";
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  Bell, 
  FileText, 
  Settings, 
  Headset, 
  ChevronRight 
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = useUserStore((s) => s.profile);
  const guesthouses = useGuesthouseStore((s) => s.guesthouses);

  const menuGroups = [
    {
      title: "기본 관리",
      items: [
        { 
          label: "내 게스트하우스", 
          icon: <Building2 className="w-5 h-5" />, 
          action: () => navigate("/guesthouse/my"),
          badge: guesthouses.length > 0 ? guesthouses.length : null
        },
        { 
          label: "정산 관리", 
          icon: <Wallet className="w-5 h-5" />, 
          action: () => navigate("/guesthouse/sales")
        },
        { 
          label: "매출 분석", 
          icon: <TrendingUp className="w-5 h-5" />, 
          action: () => navigate("/guesthouse/sales")
        },
        { 
          label: "공지사항", 
          icon: <Bell className="w-5 h-5" />, 
          action: () => navigate("/guesthouse/notices")
        },
      ]
    },
    {
      title: "기타 설정",
      items: [
        { 
          label: "계약서 및 개인정보 동의 현황", 
          icon: <FileText className="w-5 h-5" />, 
          action: () => alert("준비 중인 기능입니다.")
        },
        { 
          label: "알림 설정", 
          icon: <Bell className="w-5 h-5" />, 
          action: () => alert("준비 중인 기능입니다.")
        },
        { 
          label: "설정", 
          icon: <Settings className="w-5 h-5" />, 
          action: () => navigate("/profile/edit")
        },
        { 
          label: "고객 센터", 
          icon: <Headset className="w-5 h-5" />, 
          action: () => alert("준비 중인 기능입니다.")
        },
      ]
    }
  ];

  return (
    <div className="max-w-2xl w-full mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header & Profile Area */}
      <div className="bg-white rounded-3xl border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] p-8 mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          {profile?.photoUrl ? (
            <img 
              src={profile.photoUrl} 
              alt="프로필 이미지" 
              className="w-20 h-20 rounded-full object-cover shadow-sm border border-grayscale-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-blue flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
              {profile?.name ? profile.name.charAt(0) : "사"}
            </div>
          )}
          
          {/* Info */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-grayscale-900 tracking-tight">
              {profile?.name || "사장님"}
            </h2>
            <p className="text-grayscale-500 font-medium">
              {profile?.email || profile?.phone || "이메일 정보 없음"}
            </p>
          </div>
        </div>

        {/* 2. Quick Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-grayscale-100/60">
          <button 
            onClick={() => navigate("/guesthouse/store-register")}
            className="flex-1 py-3.5 bg-grayscale-50 hover:bg-grayscale-100 text-grayscale-900 font-bold rounded-xl transition-colors border border-grayscale-200"
          >
            게스트하우스 등록
          </button>
          <button 
            onClick={() => alert("이용방법 안내 준비 중")}
            className="flex-1 py-3.5 bg-grayscale-50 hover:bg-grayscale-100 text-grayscale-900 font-bold rounded-xl transition-colors border border-grayscale-200"
          >
            이용방법 안내
          </button>
        </div>
      </div>

      {/* 3. Menu List */}
      <div className="bg-white rounded-3xl border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className={gIdx > 0 ? "border-t border-grayscale-100/60" : ""}>
            <div className="px-8 py-5 flex flex-col gap-1">
              {group.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between py-4 group"
                >
                  <div className="flex items-center gap-4 text-grayscale-700 font-semibold group-hover:text-grayscale-900 transition-colors">
                    <span className="text-grayscale-400 group-hover:text-primary-orange transition-colors">
                      {item.icon}
                    </span>
                    <span className="text-[17px]">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="text-primary-orange font-bold text-lg">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-grayscale-300 group-hover:text-grayscale-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
