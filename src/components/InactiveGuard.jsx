import React from "react";
import { useNavigate } from "react-router-dom";
import useGuesthouseStore from "@stores/guesthouseStore";
import { useGuesthouseProfiles } from "@profile/useGuesthouseProfiles";

export default function InactiveGuard({ children }) {
  const { activeGuesthouseId } = useGuesthouseStore();
  const { guesthouseProfiles } = useGuesthouseProfiles();
  const navigate = useNavigate();

  const activeGh = guesthouseProfiles.find(
    (g) => String(g.guesthouseId) === String(activeGuesthouseId)
  );

  const isInactive = activeGh?.guesthouseStatus === "INACTIVE";

  if (isInactive) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-in fade-in bg-white rounded-2xl border border-grayscale-100 shadow-sm mt-4 p-8">
        <h2 className="text-2xl font-extrabold text-grayscale-900 mb-4 whitespace-pre-wrap">
          {`${activeGh?.name || "게스트하우스"}에 대한 등록 심사가\n완료되었습니다.`}
        </h2>
        <p className="text-grayscale-500 font-medium mb-8">
          게스트하우스 정보를 작성해보세요!
        </p>
        <button
          onClick={() => navigate(`/guesthouse/form/${activeGh?.guesthouseId || activeGuesthouseId}`)}
          className="px-8 py-4 bg-primary-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          게스트하우스 정보 작성
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
