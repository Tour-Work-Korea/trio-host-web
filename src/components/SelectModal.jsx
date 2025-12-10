/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ButtonOrange from "./ButtonOrange";
import ButtonWhite from "./ButtonWhite";

/**
 * 라디오 선택 모달
 * - items: 자유형태
 *   - 기본 기대: { id, title, subtitle }
 *   - 지원: { recruitId, recruitTitle, guesthouseName } 등도 자동 매핑
 */
export default function SelectModal({
  visible,
  title,
  message,
  buttonText = "적용하기",
  buttonText2 = null,
  onPress = null,
  onPress2 = null,
  items = [],
  setSelect = null,
  initialSelectedId = undefined,
  requireSelection = true,
  onClose = null,
}) {
  const [selected, setSelected] = useState(initialSelectedId);

  useEffect(() => {
    if (visible) setSelected(initialSelectedId);
  }, [visible, initialSelectedId]);

  if (!visible) return null;

  // ✅ items 정규화
  // recruits가 들어오면:
  //  - id        ← recruitId
  //  - title     ← recruitTitle
  //  - subtitle  ← guesthouseName
  const normalizedItems = items.map((item) => ({
    id: item.id ?? item.recruitId ?? item.value, // 혹시 다른 케이스 대비
    title: item.title ?? item.recruitTitle ?? item.label, // 공고 제목
    subtitle: item.subtitle ?? item.guesthouseName ?? item.description ?? "", // 게하 이름
    raw: item,
  }));

  const handleApply = () => {
    if (onPress) {
      onPress(selected);
      return;
    }
    if (setSelect) setSelect(selected);
    if (onClose) onClose();
  };

  const canApply = requireSelection
    ? selected !== undefined && selected !== null
    : true;

  return (
    <div
      className="fixed inset-0 z-50 bg-modal-background flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-[90%] max-w-md rounded-2xl bg-grayscale-0 p-6 text-center shadow-lg flex flex-col gap-4 items-center">
        {/* 제목/메시지 */}
        <div className="w-full">
          <h2
            id="error-modal-title"
            className="text-lg font-semibold text-grayscale-900 whitespace-pre-line"
          >
            {title}
          </h2>
          {message ? (
            <p className="mt-1 text-sm text-grayscale-600 whitespace-pre-line">
              {message}
            </p>
          ) : null}
        </div>

        {/* 라디오 리스트 */}
        <div
          className="w-full max-h-64 overflow-y-auto text-left space-y-2"
          role="radiogroup"
          aria-label="옵션 선택"
        >
          {normalizedItems.map((item) => {
            const isSelected = item.id === selected;
            return (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors border-grayscale-200 hover:border-grayscale-300"
                onClick={() => setSelected(item.id)}
              >
                <input
                  type="radio"
                  name="modal-radio"
                  className="mt-1"
                  checked={isSelected}
                  onChange={() => setSelected(item.id)}
                />
                <div className="flex-1 min-w-0">
                  {/* ✅ 공고 제목 */}
                  <div className="font-medium truncate">{item.title}</div>
                  {/* ✅ 게스트하우스 이름 */}
                  {item.subtitle ? (
                    <div className="text-sm text-grayscale-600 line-clamp-2">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
              </label>
            );
          })}
          {normalizedItems.length === 0 && (
            <div className="text-sm text-grayscale-500 text-center py-6">
              선택할 항목이 없습니다.
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        {buttonText2 ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <ButtonWhite title={buttonText2} onPress={onPress2 ?? onClose} />
            <ButtonOrange
              title={buttonText}
              onPress={handleApply}
              disabled={!canApply}
            />
          </div>
        ) : (
          <ButtonOrange
            title={buttonText}
            onPress={handleApply}
            disabled={!canApply}
          />
        )}
      </div>
    </div>
  );
}
