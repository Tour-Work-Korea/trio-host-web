import React, { useMemo, useState } from "react";
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

export default function RoomManagementPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toKey(new Date())
  );
  // 안내 토글
  const [introduceToggle, setIntroduceToggle] = useState(false);

  // 상단 필터: ALL | OPEN | BLOCKED
  const [filter, setFilter] = useState("ALL");

  // 선택된 방(열기/막기 영역에 표시)
  const [selectedToOpen, setSelectedToOpen] = useState([]); // OPEN 상태 방 클릭 시
  const [selectedToBlock, setSelectedToBlock] = useState([]); // BLOCKED 상태 방 클릭 시

  // 모달
  const [modalOpen, setModalOpen] = useState(false);

  const getItemsForDate = (dateKey) => {
    const items = DUMMY_ROOMS_BY_DATE[dateKey] ?? [];
    if (filter === "OPEN") return items.filter((x) => x.status === "OPEN");
    if (filter === "BLOCKED")
      return items.filter((x) => x.status === "BLOCKED");
    return items;
  };

  const selectedDateRooms = useMemo(() => {
    const items = DUMMY_ROOMS_BY_DATE[selectedDateKey] ?? [];
    // (선택 영역 표시용) 필터와 상관없이 원본 기준으로 계산해도 되고,
    // 여기선 "선택된 날짜의 실제 방 목록" 기준으로 둠.
    return items;
  }, [selectedDateKey]);

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
    setSelectedDateKey(dateKey);
    // 날짜 바꾸면 선택 목록은 초기화(원하면 유지로 바꿔도 됨)
    setSelectedToOpen([]);
    setSelectedToBlock([]);
  };

  const handleClickRoom = (room, dateKey) => {
    // "이미 예약된 방은 클릭 시 모달"
    if (room.isReserved) {
      setModalOpen(true);
      return;
    }

    // 날짜 칸에서 클릭한 경우 해당 날짜로 선택도 같이 맞춰주기
    if (dateKey && dateKey !== selectedDateKey) {
      setSelectedDateKey(dateKey);
      setSelectedToOpen([]);
      setSelectedToBlock([]);
    }

    if (room.status === "OPEN") {
      setSelectedToOpen((prev) => {
        const exists = prev.some(
          (x) => x.id === room.id && x.dateKey === (dateKey ?? selectedDateKey)
        );
        if (exists) return prev;
        return [...prev, { ...room, dateKey: dateKey ?? selectedDateKey }];
      });
    } else {
      setSelectedToBlock((prev) => {
        const exists = prev.some(
          (x) => x.id === room.id && x.dateKey === (dateKey ?? selectedDateKey)
        );
        if (exists) return prev;
        return [...prev, { ...room, dateKey: dateKey ?? selectedDateKey }];
      });
    }
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
          e.stopPropagation(); // 날짜 버튼 클릭 전파 방지
          handleClickRoom(room, dateKey);
        }}
        className={[
          "w-full flex items-center gap-2 px-2 py-1 rounded-md border",
          "hover:bg-grayscale-50",
          room.isReserved ? "border-primary-orange/40" : "border-grayscale-200",
        ].join(" ")}
        title={
          room.isReserved ? "이미 예약된 방" : isOpen ? "열린 방" : "닫힌 방"
        }
      >
        <span className={["text-xs truncate", baseText].join(" ")}>
          {room.name}
        </span>
        {room.isReserved ? (
          <span className="ml-auto text-[10px] px-2 py-[2px] rounded-full bg-primary-orange/10 text-primary-orange font-medium">
            예약됨
          </span>
        ) : (
          <span className="ml-auto text-[10px] text-grayscale-500">
            {isOpen ? "OPEN" : "BLOCKED"}
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
        <div className="page-title">리뷰 관리</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 캘린더 */}
        <div className="lg:col-span-2">
          {/* 메뉴얼/레전드 */}
          <div className="text-sm text-grayscale-700 bg-grayscale-100 w-full p-4 rounded-md mb-4">
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-semibold text-grayscale-900">
                방 관리 안내
              </p>
              <img
                src={introduceToggle ? ChevronUp : ChevronDown}
                onClick={() => setIntroduceToggle(!introduceToggle)}
              />
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
                  onPress={() => {}}
                  disabled={selectedToOpen.length == 0}
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
                    key={`${r.dateKey}-${r.id}-${idx}`}
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
                  onPress={() => {}}
                  disabled={selectedToOpen.length == 0}
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
                    key={`${r.dateKey}-${r.id}-${idx}`}
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
