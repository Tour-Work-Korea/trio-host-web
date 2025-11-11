/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import LeftChevron from "@assets/images/chevron_left_gray.svg";
import RightChevron from "@assets/images/chevron_right_gray.svg";

const DOW_HEADER = ["월", "화", "수", "목", "금", "토", "일"]; // 월요일 시작
const DOW_KR = ["일", "월", "화", "수", "목", "금", "토"]; // 선택일 표기용

const pad2 = (n) => String(n).padStart(2, "0");
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatSelected = (d) =>
  `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}(${DOW_KR[d.getDay()]})`;

export default function KoreanDatePicker({
  value, // Date | null
  onChange, // (date: Date) => void
  minDate, // Date (옵션)
  maxDate, // Date (옵션)
  label = "날짜", // 상단 라벨
  className = "", // 외부 클래스
}) {
  const [current, setCurrent] = useState(value ?? new Date()); // 현재 달
  const [selected, setSelected] = useState(value ?? null);

  useEffect(() => {
    if (value instanceof Date) {
      setSelected(value);
      setCurrent(value);
    }
  }, [value]);

  const today = useMemo(() => new Date(), []);
  const year = current.getFullYear();
  const month = current.getMonth(); // 0~11

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = endOfMonth.getDate();

  // 월요일 시작 offset
  const firstDowSun0 = startOfMonth.getDay(); // 0(일)~6(토)
  const startOffset = (firstDowSun0 + 6) % 7; // 0(월)~6(일)

  const prevMonthDays = new Date(year, month, 0).getDate();

  // 월 네비게이션 가능 여부
  const canGoPrev =
    !minDate ||
    new Date(year, month, 1) >
      new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canGoNext =
    !maxDate ||
    new Date(year, month + 1, 1) <=
      new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);

  const goPrev = () => {
    if (!canGoPrev) return;
    setCurrent(new Date(year, month - 1, 1));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setCurrent(new Date(year, month + 1, 1));
  };

  // 6주(42칸) 그리드
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 42; i++) {
      const inPrev = i < startOffset;
      const inCurr = i >= startOffset && i < startOffset + daysInMonth;
      const inNext = i >= startOffset + daysInMonth;
      let day;
      let dateObj;
      let inMonth = false;

      if (inPrev) {
        day = prevMonthDays - (startOffset - i - 1);
        dateObj = new Date(year, month - 1, day);
      } else if (inCurr) {
        day = i - startOffset + 1;
        dateObj = new Date(year, month, day);
        inMonth = true;
      } else if (inNext) {
        day = i - (startOffset + daysInMonth) + 1;
        dateObj = new Date(year, month + 1, day);
      }

      const disabledByRange =
        (minDate &&
          dateObj <
            new Date(
              minDate.getFullYear(),
              minDate.getMonth(),
              minDate.getDate()
            )) ||
        (maxDate &&
          dateObj >
            new Date(
              maxDate.getFullYear(),
              maxDate.getMonth(),
              maxDate.getDate()
            ));

      arr.push({
        key: dateObj.toISOString(),
        label: day,
        date: dateObj,
        inMonth,
        isToday: isSameDay(dateObj, today),
        isSelected: selected ? isSameDay(dateObj, selected) : false,
        disabled: !inMonth || disabledByRange,
      });
    }
    return arr;
  }, [
    year,
    month,
    startOffset,
    daysInMonth,
    prevMonthDays,
    selected,
    minDate,
    maxDate,
    today,
  ]);

  const handleSelect = (date, disabled) => {
    if (disabled) return;
    setSelected(date);
    onChange?.(date);
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white px-3 py-5 flex flex-col gap-5 ${className}`}
    >
      {/* 상단 라벨/선택일 */}
      <div className="flex items-center justify-between">
        <span className="text-md font-medium text-gray-900">{label}</span>
        <span className="text-md font-semibold text-primary-blue">
          {selected ? formatSelected(selected) : "선택"}
        </span>
      </div>

      <div className="border-t border-gray-200" />

      {/* 월 네비 + 제목 */}
      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`p-1 ${!canGoPrev ? "opacity-30 cursor-default" : ""}`}
        >
          <img src={LeftChevron} width={20} height={20} />
        </button>
        <span className="text-md font-semibold text-gray-900">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className={`p-1 ${!canGoNext ? "opacity-30 cursor-default" : ""}`}
        >
          <img src={RightChevron} width={20} height={20} />
        </button>
      </div>

      {/* 요일 헤더 (월~일) */}
      <div className="flex justify-between px-2">
        {DOW_HEADER.map((d) => (
          <span
            key={d}
            className="w-[calc(100%/7)] text-center text-[11px] text-gray-400"
          >
            {d}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="flex flex-wrap">
        {cells.map((c) => {
          const baseText = !c.inMonth ? "text-gray-300" : "text-gray-900";
          const selectedClass = c.isSelected
            ? "bg-primary-orange text-white"
            : "";
          const todayRing =
            c.isToday && !c.isSelected
              ? "ring-[1px] ring-primary-orange/40 rounded-full"
              : "";

          return (
            <button
              key={c.key}
              type="button"
              disabled={c.disabled}
              onClick={() => handleSelect(c.date, c.disabled)}
              className={`w-[calc(100%/7)] flex items-center justify-center my-2 ${
                c.disabled ? "cursor-default opacity-40" : "cursor-pointer"
              }`}
            >
              <span
                className={`flex items-center justify-center text-[13px] ${baseText} ${selectedClass} ${todayRing} ${
                  c.isSelected ? "rounded-full w-6 h-6" : "w-6 h-6"
                }`}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
