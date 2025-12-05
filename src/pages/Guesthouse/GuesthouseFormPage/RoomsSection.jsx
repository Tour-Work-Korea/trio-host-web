/* eslint-disable react/prop-types */
import React, { useState } from "react";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import StarFilled from "@assets/images/star_filled.svg";
import StarEmpty from "@assets/images/star_white.svg";
import XBtn from "@assets/images/x_gray.svg";
import ImageDropzone from "@components/ImageDropzone";

const EMPTY_ROOM = {
  roomName: "",
  roomDesc: "",
  roomImages: [], // { roomImageUrl, isThumbnail }
  roomCapacity: "",
  roomMaxCapacity: "",
  roomType: "",
  roomPrice: "",
};

const translateRoomType = (type) => {
  switch (type) {
    case "FEMALE_ONLY":
      return "여성전용";
    case "MALE_ONLY":
      return "남성전용";
    case "MIXED":
      return "혼숙";
    default:
      return "";
  }
};

export default function RoomsSection({
  open,
  onToggle,
  valid,
  rooms,
  onChangeRooms,
  onImageUploadError,
}) {
  const [draft, setDraft] = useState(EMPTY_ROOM);
  const [editingIndex, setEditingIndex] = useState(-1); // -1이면 새로 추가

  const isEditing = editingIndex >= 0;

  const resetDraft = () => {
    setDraft(EMPTY_ROOM);
    setEditingIndex(-1);
  };

  const handleRoomImagesUploaded = (urls) => {
    setDraft((prev) => {
      const existing = prev.roomImages || [];
      const hasThumb = existing.some((img) => img.isThumbnail);
      const mapped = urls.map((url, idx) => ({
        roomImageUrl: url,
        isThumbnail: !hasThumb && idx === 0,
      }));
      const merged = [...existing, ...mapped].slice(0, 10);
      const safe = merged.some((img) => img.isThumbnail)
        ? merged
        : merged.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));
      return { ...prev, roomImages: safe };
    });
  };

  const setThumbnail = (index) => {
    setDraft((prev) => ({
      ...prev,
      roomImages: prev.roomImages.map((img, idx) => ({
        ...img,
        isThumbnail: idx === index,
      })),
    }));
  };

  const deleteImage = (index) => {
    setDraft((prev) => {
      const next = prev.roomImages.filter((_, i) => i !== index);
      const hasThumb = next.some((img) => img.isThumbnail);
      const normalized = hasThumb
        ? next
        : next.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));
      return { ...prev, roomImages: normalized };
    });
  };

  const handleClickEdit = (index) => {
    const target = rooms[index];
    if (!target) return;
    setEditingIndex(index);
    setDraft({
      roomName: target.roomName ?? "",
      roomDesc: target.roomDesc ?? "",
      roomImages: target.roomImages ?? [],
      roomCapacity: target.roomCapacity?.toString() ?? "",
      roomMaxCapacity:
        target.roomMaxCapacity?.toString() ??
        target.roomCapacity?.toString() ??
        "",
      roomType: target.roomType ?? "",
      roomPrice: target.roomPrice?.toString() ?? "",
    });
  };

  const handleDeleteRoom = (index) => {
    const next = rooms.filter((_, i) => i !== index);
    onChangeRooms(next);
    // 편집 중인 걸 지웠으면 초기화
    if (editingIndex === index) {
      resetDraft();
    }
  };

  const handleSaveRoom = () => {
    const trimmedName = draft.roomName.trim();
    const trimmedDesc = draft.roomDesc.trim();
    const capacityNum = Number(draft.roomCapacity);
    const priceNum = Number(draft.roomPrice);

    if (
      !trimmedName ||
      !trimmedDesc ||
      !draft.roomType ||
      !draft.roomImages.length ||
      !draft.roomImages.some((img) => img.isThumbnail) ||
      Number.isNaN(capacityNum) ||
      capacityNum <= 0 ||
      Number.isNaN(priceNum) ||
      priceNum <= 0
    ) {
      // 간단한 validation만. 필요하면 섹션 위에 에러 문구를 추가해도 됨
      return;
    }

    const normalized = {
      roomName: trimmedName,
      roomDesc: trimmedDesc,
      roomImages: draft.roomImages,
      roomCapacity: capacityNum,
      roomMaxCapacity: capacityNum,
      roomType: draft.roomType,
      roomPrice: priceNum,
    };

    const next = [...rooms];
    if (editingIndex >= 0) {
      next[editingIndex] = normalized;
    } else {
      next.push(normalized);
    }
    onChangeRooms(next);
    resetDraft();
  };

  const isSaveDisabled = (() => {
    const capacityNum = Number(draft.roomCapacity);
    const priceNum = Number(draft.roomPrice);
    return (
      !draft.roomName.trim() ||
      !draft.roomDesc.trim() ||
      !draft.roomType ||
      !draft.roomImages.length ||
      !draft.roomImages.some((img) => img.isThumbnail) ||
      Number.isNaN(capacityNum) ||
      capacityNum <= 0 ||
      Number.isNaN(priceNum) ||
      priceNum <= 0
    );
  })();

  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">객실</span>
        {valid ? (
          <img src={CheckOrange} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container flex flex-col gap-6">
          {/* 등록된 객실 리스트 */}
          <div>
            <p className="form-body-label mb-2">등록된 객실</p>
            {rooms.length === 0 && (
              <p className="text-sm text-gray-400">
                아직 등록된 객실이 없습니다. 아래에서 첫 객실을 추가해 주세요.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {rooms.map((room, index) => {
                const thumb =
                  room.roomImages?.find((img) => img.isThumbnail)
                    ?.roomImageUrl ??
                  room.roomImages?.[0]?.roomImageUrl ??
                  "";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      {thumb && (
                        <img
                          src={thumb}
                          alt=""
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {room.roomName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {room.roomCapacity}인실{" "}
                          {translateRoomType(room.roomType)}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {room.roomPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs text-primary-blue underline"
                        onClick={() => handleClickEdit(index)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="text-xs text-gray-400 underline"
                        onClick={() => handleDeleteRoom(index)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 구분선 */}
          <hr className="my-2 border-gray-200" />

          {/* 객실 입력폼 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="form-body-label mb-0">
                {isEditing ? "객실 수정" : "새 객실 추가"}
              </p>
              {isEditing && (
                <button
                  type="button"
                  className="text-xs text-gray-400 underline"
                  onClick={resetDraft}
                >
                  새로 추가하기
                </button>
              )}
            </div>

            {/* 객실 이름 */}
            <div>
              <p className="text-sm text-gray-700 mb-1">객실 이름</p>
              <input
                type="text"
                className="form-input"
                placeholder="객실 이름을 입력해 주세요"
                value={draft.roomName}
                maxLength={50}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, roomName: e.target.value }))
                }
              />
            </div>

            {/* 객실 사진 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700 mb-0">객실 사진</p>
                <span className="text-sm text-gray-400">
                  <span className="text-primary-orange">
                    {draft.roomImages.length}
                  </span>
                  /10
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                대표로 보여줄 사진을 선택해 주세요. (별 표시된 사진이 대표
                사진입니다.)
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="w-40">
                  <ImageDropzone
                    label="객실 사진 업로드"
                    accept="image/*"
                    sensitive={false}
                    maxCount={10}
                    currentCount={draft.roomImages.length}
                    disabled={draft.roomImages.length >= 10}
                    onUploaded={handleRoomImagesUploaded}
                    onError={onImageUploadError}
                  />
                </div>
                {draft.roomImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-40 w-40 overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={img.roomImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {img.isThumbnail && (
                      <div className="absolute left-2 top-2 rounded-full bg-white px-1">
                        <img src={StarFilled} width={18} height={18} />
                      </div>
                    )}
                    {!img.isThumbnail && (
                      <button
                        type="button"
                        className="absolute left-2 top-2 rounded-full bg-white px-1"
                        onClick={() => setThumbnail(index)}
                      >
                        <img src={StarEmpty} width={18} height={18} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-white px-1"
                      onClick={() => deleteImage(index)}
                    >
                      <img src={XBtn} width={18} height={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 객실 간략 소개 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700 mb-0">
                  객실을 간략하게 소개해 주세요
                </p>
                <span className="text-sm text-gray-400">
                  <span className="text-primary-orange">
                    {draft.roomDesc.length}
                  </span>
                  /500
                </span>
              </div>
              <textarea
                className="form-input mt-1 min-h-[160px]"
                placeholder="객실 소개를 입력해 주세요"
                maxLength={500}
                value={draft.roomDesc}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, roomDesc: e.target.value }))
                }
              />
              <button
                type="button"
                className="mt-1 text-sm text-gray-400 underline"
                onClick={() => setDraft((prev) => ({ ...prev, roomDesc: "" }))}
              >
                다시쓰기
              </button>
            </div>

            {/* 객실 타입 / 이용대상 / 가격 */}
            <div className="flex gap-8">
              {/* 인원 */}
              <div className="max-w-30 flex-1 flex-col">
                <p className="text-sm text-gray-700 mb-1">수용 인원</p>
                <input
                  type="number"
                  className="form-input"
                  placeholder="예: 4"
                  value={draft.roomCapacity}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      roomCapacity: e.target.value,
                    }))
                  }
                />
              </div>

              {/* 이용대상 */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-700 mb-1">객실 이용대상</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "MIXED", label: "혼숙" },
                    { value: "MALE_ONLY", label: "남성전용" },
                    { value: "FEMALE_ONLY", label: "여성전용" },
                  ].map((opt) => {
                    const active = draft.roomType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            roomType: opt.value,
                          }))
                        }
                        className={`rounded-full px-4 py-2 font-medium ${
                          active
                            ? "bg-primary-orange text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 가격 */}
              <div className="flex-1 flex-col max-w-50 min-w-50">
                <p className="text-sm text-gray-700 mb-1">객실 가격</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="예: 45000"
                    value={draft.roomPrice}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        roomPrice: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">원</span>
                </div>
                <p className="text-sm text-primary-orange">
                  최소 금액은 10,000원 이상입니다.
                </p>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500"
                onClick={resetDraft}
              >
                취소
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm ${
                  isSaveDisabled
                    ? "bg-gray-200 text-gray-400"
                    : "bg-primary-orange text-white"
                }`}
                disabled={isSaveDisabled}
                onClick={handleSaveRoom}
              >
                {isEditing ? "객실 수정하기" : "객실 추가하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
