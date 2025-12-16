/* eslint-disable react/prop-types */
import React, { useMemo } from "react";

const pad2 = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

// 월 달력은 보통 “일요일 시작”이 편함 (원하면 Monday 시작으로 바꿔줄게)
const startOfCalendarGrid = (monthDate) => {
  const first = startOfMonth(monthDate);
  const day = first.getDay(); // 0=Sun
  const start = new Date(first);
  start.setDate(first.getDate() - day);
  return start;
};

const buildGrid = (monthDate) => {
  const start = startOfCalendarGrid(monthDate);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

export default function ReservationCalendar({
  monthDate, // Date (해당 월 아무 날짜)
  onPrevMonth,
  onNextMonth,
  onClickDate, // (dateKey, dateObj) => void
  // 상단 영역(상태/필터/레전드) 외부에서 교체
  renderTop = null, // ({ monthDate }) => ReactNode
  // 날짜별 아이템 조회/렌더 외부에서 교체
  getItemsForDate, // (dateKey) => array
  renderItem, // (item, { dateKey }) => ReactNode
  // 옵션
  weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"],
}) {
  const grid = useMemo(() => buildGrid(monthDate), [monthDate]);
  const monthStart = useMemo(() => startOfMonth(monthDate), [monthDate]);
  const monthEnd = useMemo(() => endOfMonth(monthDate), [monthDate]);

  const isInMonth = (d) => d >= monthStart && d <= monthEnd;

  const title = `${monthDate.getFullYear()}년 ${monthDate.getMonth() + 1}월`;

  const todayKey = toKey(new Date());

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">{title}</div>

        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded-lg border border-grayscale-300"
            onClick={onPrevMonth}
          >
            이전
          </button>
          <button
            type="button"
            className="px-3 py-1 rounded-lg border border-grayscale-300"
            onClick={onNextMonth}
          >
            다음
          </button>
        </div>
      </div>

      {/* 상단 커스텀 영역(상태/필터/레전드 등) */}
      {renderTop ? (
        <div className="mb-3">{renderTop({ monthDate })}</div>
      ) : null}

      {/* 요일 */}
      <div className="grid grid-cols-7 text-sm text-grayscale-600 mb-2 font-medium">
        {weekdayLabels.map((w) => (
          <div key={w} className="px-2 py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7">
        {grid.map((d) => {
          const dateKey = toKey(d);
          const inMonth = isInMonth(d);
          const isToday = dateKey === todayKey;
          const items = (getItemsForDate ? getItemsForDate(dateKey) : []) || [];

          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => onClickDate?.(dateKey, d)}
              className={[
                "text-left border p-2 min-h-[110px] border-grayscale-200 flex flex-col",
                inMonth
                  ? "bg-grayscale-0"
                  : "bg-grayscale-100 text-grayscale-400",
                isToday ? "border-primary-orange border-2" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{d.getDate()}</div>
                {items.length > 0 ? (
                  <div className="text-xs text-grayscale-500">
                    {items.length}건
                  </div>
                ) : null}
              </div>

              {/* 날짜 칸 내부 리스트 */}
              <div className="mt-2 flex flex-col gap-1">
                {items.map((item, idx) => (
                  <div key={item?.id ?? idx} className="w-full">
                    {renderItem ? (
                      renderItem(item, { dateKey })
                    ) : (
                      <div className="text-xs text-grayscale-700 truncate">
                        {String(item?.title ?? "item")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
