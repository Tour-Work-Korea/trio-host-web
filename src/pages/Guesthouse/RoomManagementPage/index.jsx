import React, { useState } from "react";
import Calendar from "@components/Calendar";
import ButtonOrange from "@components/ButtonOrange";
import ButtonWhite from "@components/ButtonWhite";

import ChevronDown from "@assets/images/chevron_down_black.svg";
import ChevronUp from "@assets/images/chevron_up_black.svg";
import Delete from "@assets/images/delete_gray.svg";

const pad2 = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// ===== 더미 데이터 =====
// status: "OPEN" | "BLOCKED"
// isReserved: true면 "이미 예약된 방" (클릭 시 모달)
const DUMMY_ROOMS_BY_DATE = {
  "2025-12-22": [
    { id: "r-101", name: "101호", status: "OPEN", isReserved: false },
    { id: "r-102", name: "102호", status: "BLOCKED", isReserved: false },
    { id: "r-201", name: "201호", status: "OPEN", isReserved: true }, // 예약됨
  ],
  "2025-12-23": [
    { id: "r-101", name: "101호", status: "BLOCKED", isReserved: false },
    { id: "r-102", name: "102호", status: "OPEN", isReserved: false },
    { id: "r-201", name: "201호", status: "OPEN", isReserved: false },
    { id: "r-202", name: "202호", status: "OPEN", isReserved: true }, // 예약됨
  ],
  "2025-12-24": [
    { id: "r-101", name: "101호", status: "OPEN", isReserved: false },
    { id: "r-102", name: "102호", status: "OPEN", isReserved: false },
    { id: "r-201", name: "201호", status: "BLOCKED", isReserved: false },
  ],
};

function SimpleModal({ open, title, description, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="close backdrop"
      />
      <div className="relative w-[92%] max-w-md rounded-2xl bg-white shadow-lg p-5">
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-2 text-sm text-grayscale-700">{description}</div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-grayscale-900 text-white text-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// 선택 키(date + roomId) 생성
const selKey = (dateKey, roomId) => `${dateKey}__${roomId}`;

export default function RoomManagementPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());

  // 안내 토글
  const [introduceToggle, setIntroduceToggle] = useState(false);

  // 상단 필터: ALL | OPEN | BLOCKED
  const [filter, setFilter] = useState("ALL");

  // (UI 표시용) 마지막으로 클릭한 날짜만 보여주고 싶을 때 사용
  const [viewDateKey, setViewDateKey] = useState(() => toKey(new Date()));

  // 선택된 방(열기/막기 영역에 표시) - ✅ dateKey를 포함한 payload로 관리
  // RoomSelection: { id, name, status, isReserved, dateKey }
  const [selectedToOpen, setSelectedToOpen] = useState([]); // 닫힌 방(BLOCKED) 클릭 시 들어감
  const [selectedToBlock, setSelectedToBlock] = useState([]); // 열린 방(OPEN) 클릭 시 들어감

  // 모달
  const [modalOpen, setModalOpen] = useState(false);

  const getItemsForDate = (dateKey) => {
    const items = DUMMY_ROOMS_BY_DATE[dateKey] ?? [];
    if (filter === "OPEN") return items.filter((x) => x.status === "OPEN");
    if (filter === "BLOCKED")
      return items.filter((x) => x.status === "BLOCKED");
    return items;
  };

  const onPrevMonth = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() - 1);
    setMonthDate(d);
  };

  const onNextMonth = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + 1);
    setMonthDate(d);
  };

  const onClickDate = (dateKey) => {
    // ✅ 날짜를 클릭해도 선택 리스트는 비우지 않음 (날짜+방 단위로 누적 선택 가능)
    setViewDateKey(dateKey);
  };

  const toggleSelect = (listSetter, picked) => {
    // picked: { ...room, dateKey }
    listSetter((prev) => {
      const k = selKey(picked.dateKey, picked.id);
      const idx = prev.findIndex((x) => selKey(x.dateKey, x.id) === k);
      if (idx >= 0) {
        // ✅ 같은 날짜+방을 다시 클릭하면 토글로 제거
        return prev.filter((_, i) => i !== idx);
      }
      return [...prev, picked];
    });
  };

  const handleClickRoom = (room, dateKey) => {
    // "이미 예약된 방은 클릭 시 모달"
    if (room.isReserved) {
      setModalOpen(true);
      return;
    }

    const picked = { ...room, dateKey }; // ✅ 항상 dateKey 포함해서 저장

    // UI 표시용 날짜도 맞춰주기(선택 로직과는 분리)
    setViewDateKey(dateKey);

    // ✅ 열린 방 클릭 => "방 막기" 리스트
    if (room.status === "OPEN") {
      toggleSelect(setSelectedToBlock, picked);
      return;
    }

    // ✅ 닫힌 방 클릭 => "방 열기" 리스트
    toggleSelect(setSelectedToOpen, picked);
  };

  const renderTop = () => {
    return (
      <div className="flex flex-col gap-2">
        {/* 필터 버튼 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("OPEN")}
            className={[
              "px-3 rounded-md text-sm border h-6",
              filter === "OPEN"
                ? "bg-primary-blue text-white border-primary-blue"
                : "bg-white text-grayscale-900 border-grayscale-300",
            ].join(" ")}
          >
            열린 방
          </button>
          <button
            type="button"
            onClick={() => setFilter("BLOCKED")}
            className={[
              "px-3 rounded-md text-sm border h-6",
              filter === "BLOCKED"
                ? "bg-primary-blue text-white border-primary-blue"
                : "bg-white text-grayscale-900 border-grayscale-300",
            ].join(" ")}
          >
            막힌 방
          </button>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={[
              "ml-auto px-3 rounded-md text-sm border h-6",
              filter === "ALL"
                ? "bg-primary-blue text-white border-primary-blue"
                : "bg-white text-grayscale-900 border-grayscale-300",
            ].join(" ")}
          >
            전체 보기
          </button>
        </div>
      </div>
    );
  };

  const renderItem = (room, { dateKey }) => {
    const isOpen = room.status === "OPEN";
    const baseText = isOpen
      ? "text-grayscale-900 font-semibold"
      : "text-grayscale-400 font-medium";

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClickRoom(room, dateKey);
        }}
        className={[
          "w-full flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer",
          "hover:bg-grayscale-50",
          room.isReserved
            ? "bg-orange-100"
            : isOpen
            ? "bg-white"
            : "bg-grayscale-100",
        ].join(" ")}
        title={
          room.isReserved ? "이미 예약된 방" : isOpen ? "열린 방" : "닫힌 방"
        }
      >
        <span className={["text-xs truncate", baseText].join(" ")}>
          {room.name}
        </span>
        {room.isReserved ? (
          <span className="ml-auto text-xs text-primary-orange">예약</span>
        ) : (
          <span className="ml-auto text-xs text-grayscale-500">
            {isOpen ? "열림" : "닫힘"}
          </span>
        )}
      </button>
    );
  };

  const removeSelected = (type, idx) => {
    if (type === "OPEN") {
      setSelectedToOpen((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setSelectedToBlock((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="container">
      <div className="flex items-center">
        <div className="page-title">방 관리</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 캘린더 */}
        <div className="lg:col-span-3">
          {/* 메뉴얼/레전드 */}
          <div className="text-sm text-grayscale-700 bg-grayscale-100 w-full p-4 rounded-md mb-4">
            <div
              className="flex justify-between items-center w-full cursor-pointer"
              onClick={() => setIntroduceToggle(!introduceToggle)}
            >
              <p className="text-base font-semibold text-grayscale-900">
                방 관리 안내
              </p>
              <img src={introduceToggle ? ChevronUp : ChevronDown} />
            </div>

            {introduceToggle && (
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  <span className="font-semibold text-grayscale-900">
                    열린 방
                  </span>
                  은 진한 글씨로 표시됩니다.
                </li>
                <li>
                  <span className="text-grayscale-400">닫힌 방</span>은 연한
                  글씨로 표시됩니다.
                </li>
                <li>
                  방을 클릭하면 상태에 따라 “방 열기/방 막기” 영역에 추가됩니다.
                </li>
                <li>이미 예약된 방은 막을 수 없습니다.</li>
                <li className="list-none pl-0 mt-2 text-xs text-grayscale-600">
                  현재 선택 날짜:{" "}
                  <span className="font-medium text-grayscale-900">
                    {viewDateKey}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div className="border-grayscale-200 border-2 rounded-lg bg-white p-4 scrollbar-hide ">
            <Calendar
              monthDate={monthDate}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
              onClickDate={onClickDate}
              renderTop={renderTop}
              getItemsForDate={getItemsForDate}
              renderItem={renderItem}
            />
          </div>
        </div>

        {/* 우측: 액션/선택 목록 */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* 방 열기 */}
          <div className="rounded-lg bg-grayscale-100 p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">방 열기</div>
              <div>
                <ButtonOrange
                  title="방 열기"
                  onPress={() => {
                    // TODO: API 호출 시 selectedToOpen을 그대로 보내면 됨 (dateKey 포함)
                    // console.log(selectedToOpen);
                  }}
                  className="text-[14px] h-8"
                  disabled={selectedToOpen.length === 0}
                />
              </div>
            </div>

            <div className="mt-3 text-sm text-grayscale-600">
              닫힌 방을 클릭하면 이 아래에 쌓입니다.
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {selectedToOpen.length === 0 ? (
                <div className="text-sm text-grayscale-400">
                  선택된 닫힌 방이 없습니다.
                </div>
              ) : (
                selectedToOpen.map((r, idx) => (
                  <div
                    key={selKey(r.dateKey, r.id)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-grayscale-200 bg-white"
                  >
                    <div className="text-sm font-semibold text-grayscale-900">
                      {r.name}
                    </div>
                    <div className="text-sm text-grayscale-500">
                      {r.dateKey}
                    </div>
                    <button
                      type="button"
                      className="ml-auto text-sm text-grayscale-600 hover:text-grayscale-900"
                      onClick={() => removeSelected("OPEN", idx)}
                    >
                      <img src={Delete} className="w-6" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 방 막기 */}
          <div className="rounded-lg bg-grayscale-100 p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">방 막기</div>
              <div>
                <ButtonOrange
                  title="방 막기"
                  onPress={() => {
                    // TODO: API 호출 시 selectedToBlock을 그대로 보내면 됨 (dateKey 포함)
                    // console.log(selectedToBlock);
                  }}
                  className="text-[14px] h-8"
                  disabled={selectedToBlock.length === 0}
                />
              </div>
            </div>

            <div className="mt-3 text-sm text-grayscale-600">
              열린 방을 클릭하면 이 아래에 쌓입니다.
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {selectedToBlock.length === 0 ? (
                <div className="text-sm text-grayscale-400">
                  선택된 열린 방이 없습니다.
                </div>
              ) : (
                selectedToBlock.map((r, idx) => (
                  <div
                    key={selKey(r.dateKey, r.id)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-grayscale-200 bg-white"
                  >
                    <div className="text-sm font-semibold text-grayscale-900">
                      {r.name}
                    </div>
                    <div className="text-sm text-grayscale-500">
                      {r.dateKey}
                    </div>
                    <button
                      type="button"
                      className="ml-auto text-sm text-grayscale-600 hover:text-grayscale-900"
                      onClick={() => removeSelected("BLOCKED", idx)}
                    >
                      <img src={Delete} className="w-6" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <SimpleModal
        open={modalOpen}
        title="안내"
        description="이미 예약된 방은 막을 수 없습니다."
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
