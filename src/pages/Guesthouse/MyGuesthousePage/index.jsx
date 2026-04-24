import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGuesthouseStore from "@stores/guesthouseStore";
import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import DeleteIcon from "@assets/images/delete_gray.svg";
import EditIcon from "@assets/images/edit_gray.svg";
import { ChevronRight, Settings, Plus } from "lucide-react";

export default function MyGuesthousePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("INFO"); // INFO | ROOMS
  const [errorModal, setErrorModal] = useState({ visible: false, title: "", message: null, buttonText: "확인" });

  const { guesthouses, activeGuesthouseId, fetchGuesthouses, setActiveGuesthouseId } = useGuesthouseStore();

  const activeGh = guesthouses.find((g) => (g.guesthouseId || g.id) === activeGuesthouseId);

  const getGuesthouseThumb = (item) => item?.thumbnailImg ?? item?.thumbnailUrl ?? item?.rooms?.[0]?.thumbnailImg ?? "";
  const getRoomThumb = (room) => room?.thumbnailImg ?? room?.roomImageUrl ?? "";

  const handleDeleteGuesthouse = (id) => {
    setErrorModal({
      visible: true,
      title: `정말 [${activeGh?.guesthouseName}]을(를) 삭제하시겠습니까?`,
      buttonText: "삭제할게요",
      buttonText2: "취소",
      onPress: async () => {
        setErrorModal((p) => ({ ...p, visible: false }));
        try {
          await guesthouseApi.deleteGuesthouse(id);
          setActiveGuesthouseId(null);
          await fetchGuesthouses();
          navigate("/guesthouse/home");
        } catch (err) {
          alert("삭제 실패: " + err.message);
        }
      },
      onPress2: () => setErrorModal((p) => ({ ...p, visible: false })),
    });
  };

  const handleDeleteRoom = (id, roomId) => {
    setErrorModal({
      visible: true,
      title: `해당 객실을 삭제하시겠습니까?`,
      buttonText: "삭제할게요",
      buttonText2: "취소",
      onPress: async () => {
        setErrorModal((p) => ({ ...p, visible: false }));
        try {
          await guesthouseApi.deleteRoom(id, roomId);
          await fetchGuesthouses();
        } catch (err) {
          alert("객실 삭제 실패");
        }
      },
      onPress2: () => setErrorModal((p) => ({ ...p, visible: false })),
    });
  };

  if (!activeGuesthouseId || !activeGh) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] animate-in fade-in">
        <EmptyComponent
          title="선택된 업체가 없습니다"
          subtitle="좌측 메뉴 최상단에서 업체를 선택하거나 새로 추가해주세요."
          buttonText="홈으로 돌아가기"
          onPress={() => navigate("/guesthouse/home")}
        />
      </div>
    );
  }

  const ghId = activeGh.guesthouseId || activeGh.id;
  const ghThumb = getGuesthouseThumb(activeGh);

  return (
    <div className="max-w-5xl w-full text-grayscale-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-grayscale-500 mb-6 font-semibold">
        <span>업체 정보</span> <ChevronRight className="w-4 h-4" /> <span className="text-primary-blue">{activeGh.guesthouseName}</span>
      </div>

      {/* Top Tabs */}
      <div className="flex items-center border-b border-grayscale-200 mb-8">
        <button
          onClick={() => setActiveTab("INFO")}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === "INFO" ? "border-primary-blue text-primary-blue" : "border-transparent text-grayscale-500 hover:text-grayscale-800"
          }`}
        >
          기본 정보
        </button>
        <button
          onClick={() => setActiveTab("ROOMS")}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === "ROOMS" ? "border-primary-blue text-primary-blue" : "border-transparent text-grayscale-500 hover:text-grayscale-800"
          }`}
        >
          등록된 객실
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-grayscale-100 shadow-sm p-6 lg:p-10">
        {activeTab === "INFO" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src={ghThumb || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"}
                alt={activeGh.guesthouseName}
                className="w-full md:w-80 h-80 rounded-2xl bg-grayscale-100 object-cover shadow-inner"
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold tracking-tight">{activeGh.guesthouseName}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/guesthouse/form/${ghId}`)}
                      className="p-2 bg-grayscale-50 hover:bg-grayscale-100 text-grayscale-600 rounded-lg transition border border-grayscale-200 flex items-center justify-center"
                      title="업체 정보 수정"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGuesthouse(ghId)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition border border-red-100 flex items-center justify-center"
                      title="업체 삭제"
                    >
                      <img src={DeleteIcon} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4 text-grayscale-700 bg-grayscale-50 p-6 rounded-xl border border-grayscale-100">
                  <p className="flex justify-between border-b pb-3 border-grayscale-200/60"><span className="font-semibold text-grayscale-500">전화번호</span> <span>{activeGh.guesthousePhone || "-"}</span></p>
                  <p className="flex justify-between border-b pb-3 border-grayscale-200/60"><span className="font-semibold text-grayscale-500">주소</span> <span className="text-right">{activeGh.guesthouseAddress} {activeGh.guesthouseDetailAddress}</span></p>
                  <p className="flex justify-between border-b pb-3 border-grayscale-200/60"><span className="font-semibold text-grayscale-500">체크인</span> <span>{activeGh.checkIn || "15:00"}</span></p>
                  <p className="flex justify-between"><span className="font-semibold text-grayscale-500">체크아웃</span> <span>{activeGh.checkOut || "11:00"}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ROOMS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">운영 중인 객실 <span className="text-primary-blue">{activeGh.rooms?.length || 0}</span>개</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-blue/90 transition-colors">
                <Plus className="w-4 h-4" />
                객실 추가
              </button>
            </div>

            {(!activeGh.rooms || activeGh.rooms.length === 0) ? (
              <div className="py-20 flex flex-col items-center justify-center bg-grayscale-50 rounded-xl border border-grayscale-200 border-dashed">
                <div className="text-grayscale-400 font-semibold">아직 등록된 객실이 없습니다.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGh.rooms.map((room) => {
                  const roomId = room.roomId || room.id;
                  const roomTypeLabel = room.roomType === "FEMALE_ONLY" ? "여성 전용" : room.roomType === "MALE_ONLY" ? "남성 전용" : "혼성";
                  
                  return (
                    <div key={roomId} className="flex gap-4 p-4 rounded-xl border border-grayscale-200 hover:border-primary-blue/30 hover:shadow-md transition-all bg-white relative group">
                      <img
                        src={getRoomThumb(room) || "https://images.unsplash.com/photo-1598928506311-c55dd1b76483?auto=format&fit=crop&q=80"}
                        alt={room.roomName}
                        className="w-24 h-24 rounded-lg object-cover bg-grayscale-100"
                      />
                      <div className="flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">{roomTypeLabel}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-600 rounded-full">최대 {room.roomMaxCapacity || room.roomCapacity}인</span>
                        </div>
                        <h3 className="font-bold text-lg mt-1">{room.roomName}</h3>
                        <p className="text-sm font-bold text-grayscale-800 mt-2">{room.roomPrice?.toLocaleString()}원 <span className="text-xs text-grayscale-400 font-medium">/ 1박</span></p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteRoom(ghId, roomId)}
                        className="absolute top-4 right-4 p-2 bg-grayscale-100 hover:bg-red-50 text-grayscale-400 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <img src={DeleteIcon} className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <ErrorModal
        visible={errorModal.visible} title={errorModal.title} message={errorModal.message}
        buttonText={errorModal.buttonText} buttonText2={errorModal.buttonText2} onPress={errorModal.onPress} onPress2={errorModal.onPress2}
      />
    </div>
  );
}
