import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import useGuesthouseStore from "@stores/guesthouseStore";
import EmptyComponent from "@components/EmptyComponent";

export default function RoomManagementView({ guesthouseId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { guesthouses } = useGuesthouseStore();
  const activeGh = guesthouses.find((g) => (g.guesthouseId || g.id) === guesthouseId);
  const rooms = activeGh?.rooms || [];

  // 로컬 상태로 각 방의 상태 (보유 중인 베드 수/예약 가능 여부) 관리 (추후 API 연동 필요)
  const [roomStates, setRoomStates] = useState(
    rooms.reduce((acc, room) => ({
      ...acc,
      [room.roomId || room.id]: {
        isOpen: true,
        availableBeds: room.roomCapacity || room.roomMaxCapacity || 0
      }
    }), {})
  );

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const day = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${y}.${m}.${d} (${day})`;
  };

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };
  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const toggleRoomStatus = (roomId) => {
    setRoomStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], isOpen: !prev[roomId].isOpen }
    }));
  };

  const updateBeds = (roomId, delta) => {
    setRoomStates(prev => {
      const current = prev[roomId].availableBeds;
      const newBeds = Math.max(0, current + delta);
      return { ...prev, [roomId]: { ...prev[roomId], availableBeds: newBeds } };
    });
  };

  // 객실 분류 로직 (단순 이름에 '도미토리' 포함 여부로 분기)
  const dormitories = rooms.filter(r => r.roomName.includes("도미토리") || r.roomType?.includes("MALE") || r.roomType?.includes("FEMALE"));
  const privateRooms = rooms.filter(r => !dormitories.includes(r));

  const renderRoomCard = (room) => {
    const roomId = room.roomId || room.id;
    const state = roomStates[roomId] || { isOpen: false, availableBeds: 0 };
    return (
      <div key={roomId} className="bg-white rounded-2xl border border-grayscale-200 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold tracking-tight text-grayscale-900">{room.roomName}</span>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm ${state.isOpen ? "text-primary-orange" : "text-grayscale-400"}`}>
              {state.isOpen ? "예약 가능" : "예약 불가"}
            </span>
            {/* iOS 스타일 토글 스위치 */}
            <div 
              onClick={() => toggleRoomStatus(roomId)}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${state.isOpen ? "bg-primary-orange" : "bg-grayscale-300"}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${state.isOpen ? "translate-x-6" : ""}`} />
            </div>
          </div>
        </div>
        
        {/* 베드 수 조절기 */}
        <div className="flex items-center justify-end gap-3 font-semibold text-grayscale-900">
          <span className="text-sm">현재 예약 가능 베드 수</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateBeds(roomId, -1)}
              className="p-1 rounded-full border border-grayscale-300 hover:bg-grayscale-100 transition disabled:opacity-30 disabled:border-grayscale-100 disabled:hover:bg-transparent"
              disabled={!state.isOpen || state.availableBeds <= 0}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-lg">{state.availableBeds}</span>
            <button 
              onClick={() => updateBeds(roomId, 1)}
              className="p-1 rounded-full border border-grayscale-300 hover:bg-grayscale-100 transition disabled:opacity-30 disabled:border-grayscale-100 disabled:hover:bg-transparent"
              disabled={!state.isOpen}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      {/* Date Navigation */}
      <div className="flex items-center justify-between border border-grayscale-200 rounded-2xl p-4 bg-white shadow-sm">
        <button onClick={handlePrevDay} className="p-2 hover:bg-grayscale-100 rounded-xl transition">
          <ChevronLeft className="w-6 h-6 text-grayscale-800" />
        </button>
        <span className="text-xl font-bold tracking-tight">{formatDate(currentDate)}</span>
        <button onClick={handleNextDay} className="p-2 hover:bg-grayscale-100 rounded-xl transition">
          <ChevronRight className="w-6 h-6 text-grayscale-800" />
        </button>
      </div>

      <div className="space-y-12">
        {/* 도미토리 섹션 */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold tracking-tight text-center mb-6">도미토리</h3>
          {dormitories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dormitories.map(renderRoomCard)}
            </div>
          ) : (
            <div className="py-8 text-center text-grayscale-400 font-semibold bg-grayscale-50 rounded-2xl border border-dashed border-grayscale-200">
              도미토리 객실이 없습니다
            </div>
          )}
        </div>

        {/* 일반 객실 섹션 */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold tracking-tight text-center mb-6">일반 객실</h3>
          {privateRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {privateRooms.map(renderRoomCard)}
            </div>
          ) : (
            <div className="py-8 text-center text-grayscale-400 font-semibold bg-grayscale-50 rounded-2xl border border-dashed border-grayscale-200">
              일반 객실이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
