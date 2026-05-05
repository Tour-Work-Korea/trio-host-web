/* eslint-disable react/prop-types */
import { useState } from "react";

import CheckBlue from "@assets/images/check_blue.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import StarFilled from "@assets/images/star_filled.svg";
import StarEmpty from "@assets/images/star_white.svg";
import XBtn from "@assets/images/x_gray.svg";
import ImageDropzone from "@components/ImageDropzone";

const createEmptyRoom = () => ({
  id: null, // 기존 방이면 서버 id, 새 방이면 null 유지
  roomName: "",
  roomDesc: "",
  roomImages: [], // { roomImageUrl, isThumbnail }
  roomCapacity: "",
  roomMaxCapacity: "",
  roomType: "",
  dormitoryGenderType: "",
  femaleOnly: false,
  isVisible: true,
  roomExtraFees: [],
  roomPrice: "",
});

const translateRoomType = (type) => {
  switch (type) {
    case "DORMITORY":
      return "도미토리";
    case "PRIVATE":
      return "일반 객실";
    default:
      return "";
  }
};

const translateDormitoryGender = (type) => {
  switch (type) {
    case "FEMALE_ONLY":
      return "여성전용";
    case "MALE_ONLY":
      return "남성전용";
    case "MIXED":
      return "공용";
    default:
      return "";
  }
};

export default function RoomsSection({
  open,
  onToggle,
  valid,
  rooms, // [{ id?, roomName, roomDesc, roomImages, roomCapacity, roomMaxCapacity, roomType, roomPrice }]
  onChangeRooms, // rooms 배열 변경 시 호출
  onImageUploadError,
}) {
  const [draft, setDraft] = useState(createEmptyRoom());
  const [editingIndex, setEditingIndex] = useState(-1); // -1이면 새로 추가
  const [isFormOpen, setIsFormOpen] = useState(false);

  const isEditing = editingIndex >= 0;

  const resetDraft = () => {
    setDraft(createEmptyRoom());
    setEditingIndex(-1);
    setIsFormOpen(false);
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

    const legacyDormitoryType = ["MIXED", "MALE_ONLY", "FEMALE_ONLY"];
    const roomType =
      target.roomType === "DORMITORY" || target.roomType === "PRIVATE"
        ? target.roomType
        : "DORMITORY";
    const dormitoryGenderType = legacyDormitoryType.includes(target.roomType)
      ? target.roomType
      : target.dormitoryGenderType ?? "MIXED";

    setEditingIndex(index);
    setIsFormOpen(true);
    setDraft({
      id: target.id ?? null, // ✅ id 유지해서 나중에 submit 시 update/새로생성 구분
      roomName: target.roomName ?? "",
      roomDesc: target.roomDesc ?? "",
      roomImages: target.roomImages ?? [],
      roomCapacity: target.roomCapacity?.toString() ?? "",
      roomMaxCapacity:
        target.roomMaxCapacity?.toString() ??
        target.roomCapacity?.toString() ??
        "",
      roomType,
      dormitoryGenderType,
      femaleOnly: !!target.femaleOnly,
      isVisible: target.isVisible ?? true,
      roomExtraFees: target.roomExtraFees ?? [],
      roomPrice: target.roomPrice?.toString() ?? "",
    });
  };

  const handleDeleteRoom = (index) => {
    const next = rooms.filter((_, i) => i !== index);
    onChangeRooms(next);

    if (editingIndex === index) {
      resetDraft();
    } else if (editingIndex > index) {
      // 삭제한 index보다 뒤를 수정 중이었으면 index 하나 당겨줌
      setEditingIndex((prev) => prev - 1);
    }
  };

  const handleSaveRoom = () => {
    const trimmedName = draft.roomName.trim();
    const trimmedDesc = draft.roomDesc.trim();
    const capacityNum = Number(draft.roomCapacity);
    const roomMaxCapacityNum = Number(draft.roomMaxCapacity);
    const priceNum = Number(draft.roomPrice);
    const isDormitory = draft.roomType === "DORMITORY";
    const isPrivate = draft.roomType === "PRIVATE";
    const hasValidMaxForPrivate =
      !Number.isNaN(roomMaxCapacityNum) &&
      roomMaxCapacityNum > 0 &&
      roomMaxCapacityNum >= capacityNum;
    const normalizedMaxCapacity =
      isPrivate
        ? roomMaxCapacityNum
        : capacityNum;

    if (
      !trimmedName ||
      !trimmedDesc ||
      !draft.roomType ||
      (isDormitory && !draft.dormitoryGenderType) ||
      (isPrivate && !hasValidMaxForPrivate) ||
      !draft.roomImages.length ||
      !draft.roomImages.some((img) => img.isThumbnail) ||
      Number.isNaN(capacityNum) ||
      capacityNum <= 0 ||
      Number.isNaN(priceNum) ||
      priceNum < 10000 // 최소 금액
    ) {
      return;
    }

    const normalized = {
      id: draft.id ?? null, // 기존 방이면 서버에서 받은 id 그 상태로 유지
      roomName: trimmedName,
      roomDesc: trimmedDesc,
      roomImages: draft.roomImages,
      roomCapacity: capacityNum,
      roomMaxCapacity: normalizedMaxCapacity,
      roomType: draft.roomType,
      dormitoryGenderType: isDormitory ? draft.dormitoryGenderType : "MIXED",
      femaleOnly: draft.roomType === "PRIVATE" ? !!draft.femaleOnly : false,
      isVisible: draft.isVisible ?? true,
      roomPrice: priceNum,
      roomExtraFees: draft.roomExtraFees ?? [],
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
    const roomMaxCapacityNum = Number(draft.roomMaxCapacity);
    const priceNum = Number(draft.roomPrice);
    const isDormitory = draft.roomType === "DORMITORY";
    const isPrivate = draft.roomType === "PRIVATE";
    const hasValidMaxForPrivate =
      !Number.isNaN(roomMaxCapacityNum) &&
      roomMaxCapacityNum > 0 &&
      roomMaxCapacityNum >= capacityNum;
    return (
      !draft.roomName.trim() ||
      !draft.roomDesc.trim() ||
      !draft.roomType ||
      (isDormitory && !draft.dormitoryGenderType) ||
      (isPrivate && !hasValidMaxForPrivate) ||
      !draft.roomImages.length ||
      !draft.roomImages.some((img) => img.isThumbnail) ||
      Number.isNaN(capacityNum) ||
      capacityNum <= 0 ||
      Number.isNaN(priceNum) ||
      priceNum < 10000
    );
  })();

  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">객실</span>
        {valid ? (
          <img src={CheckBlue} width={24} height={24} alt="완료" />
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
                const roomTypeText = translateRoomType(room.roomType);
                const roomMetaDetail =
                  room.roomType === "DORMITORY"
                    ? translateDormitoryGender(room.dormitoryGenderType)
                    : room.femaleOnly
                      ? "여성전용"
                      : "";
                const roomMeta =
                  roomTypeText && roomMetaDetail
                    ? `${roomTypeText}(${roomMetaDetail})`
                    : roomTypeText;
                const capacityText =
                  room.roomType === "PRIVATE"
                    ? `기준 ${room.roomCapacity}인 / 최대 ${room.roomMaxCapacity ?? room.roomCapacity
                    }인`
                    : `${room.roomCapacity}인실`;

                return (
                  <div
                    key={room.id ?? index}
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
                          {capacityText} {roomMeta}
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

          {/* 객실 입력폼 토글 */}
          {!isFormOpen ? (
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-6 text-gray-500 font-bold hover:bg-gray-50 hover:border-primary-blue hover:text-primary-blue transition-colors"
              onClick={() => {
                setDraft(createEmptyRoom());
                setEditingIndex(-1);
                setIsFormOpen(true);
              }}
            >
              + 객실 추가하기
            </button>
          ) : (
            <div className="flex flex-col gap-8 rounded-2xl bg-gray-50/50 p-6 border border-gray-200 mt-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <p className="font-bold text-gray-900 text-lg mb-0">
                  {isEditing ? "객실 수정" : "새 객실 추가"}
                </p>
                {isEditing && (
                  <button
                    type="button"
                    className="text-sm font-semibold text-gray-500 hover:text-gray-800 underline"
                    onClick={() => {
                      setDraft(createEmptyRoom());
                      setEditingIndex(-1);
                    }}
                  >
                    새로 추가하기
                  </button>
                )}
              </div>

              {/* 객실 유형 (가장 먼저 선택) */}
              <div>
                <div className="mb-3">
                  <p className="text-sm font-bold text-gray-800 mb-1">객실 유형 <span className="text-primary-orange">*</span></p>
                  <p className="text-xs text-gray-500">객실 유형에 따라 입력 정보가 달라지므로 가장 먼저 선택해 주세요.</p>
                </div>
                <div className="flex gap-3">
                  {[
                    { value: "DORMITORY", label: "도미토리" },
                    { value: "PRIVATE", label: "일반 객실" },
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
                            dormitoryGenderType:
                              opt.value === "DORMITORY"
                                ? prev.dormitoryGenderType || "MIXED"
                                : "",
                            roomMaxCapacity:
                              opt.value === "DORMITORY"
                                ? prev.roomCapacity
                                : prev.roomMaxCapacity,
                            femaleOnly:
                              opt.value === "PRIVATE" ? prev.femaleOnly : false,
                          }))
                        }
                        className={`flex-1 rounded-xl py-3 font-bold transition-colors border ${active
                            ? "bg-primary-orange text-white border-primary-orange shadow-md shadow-orange-500/20"
                            : "bg-white text-gray-500 border-gray-200 hover:border-primary-orange hover:text-primary-orange"
                          }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 객실 이름 */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">객실 이름</p>
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
                  <p className="text-sm font-bold text-gray-800 mb-0">객실 사진</p>
                  <span className="text-sm text-gray-400">
                    <span className="text-primary-orange">
                      {draft.roomImages.length}
                    </span>
                    /10
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  대표로 보여줄 사진을 선택해 주세요. 별모양을 클릭해 대표 사진을
                  선택할 수 있어요.
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
                  <p className="text-sm font-bold text-gray-800 mb-0">
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
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                    onClick={() => setDraft((prev) => ({ ...prev, roomDesc: "" }))}
                  >
                    다시쓰기
                  </button>
                </div>
              </div>

              {/* 이용대상 / 인원 / 가격 */}
              <div className="flex flex-wrap items-start gap-x-6 gap-y-8">
                {/* 인원 */}
                <div className="w-full min-w-[240px] md:flex-[1_1_300px]">
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {draft.roomType === "PRIVATE" ? "기준 인원" : "객실 타입"}
                  </p>
                  {draft.roomType === "DORMITORY" ? (
                    <div className="mt-4 grid grid-cols-2 gap-y-5 gap-x-2">
                      {[2, 3, 4, 5, 6, 7].map((num) => {
                        const isChecked = Number(draft.roomCapacity) === num;
                        return (
                          <div
                            key={num}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setDraft(prev => ({ ...prev, roomCapacity: num.toString() }))}
                          >
                            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${isChecked ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                              {isChecked && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                            </div>
                            <span className="text-gray-800 font-medium">{num}인 도미토리</span>
                          </div>
                        );
                      })}
                      <div className="col-span-2 flex items-center gap-3 mt-1">
                        <div
                          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
                          onClick={() => {
                            if ([2, 3, 4, 5, 6, 7].includes(Number(draft.roomCapacity))) {
                              setDraft(prev => ({ ...prev, roomCapacity: "-1" }));
                            }
                          }}
                        >
                          <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${(![2,3,4,5,6,7].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "") ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                            {(![2,3,4,5,6,7].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "") && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                          </div>
                          <span className="text-gray-800 font-medium">기타</span>
                        </div>
                        <input
                          type="number"
                          className="form-input flex-1 ml-1 text-sm bg-transparent border-gray-200 rounded-xl"
                          placeholder="기타 인원을 입력해주세요"
                          value={(![2,3,4,5,6,7].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "-1" && draft.roomCapacity !== "") ? draft.roomCapacity : ""}
                          onChange={(e) => setDraft(prev => ({ ...prev, roomCapacity: e.target.value }))}
                          onClick={() => {
                            if ([2, 3, 4, 5, 6, 7].includes(Number(draft.roomCapacity))) {
                              setDraft(prev => ({ ...prev, roomCapacity: "-1" }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : draft.roomType === "PRIVATE" ? (
                    <div className="mt-4 grid grid-cols-2 gap-y-5 gap-x-2">
                      {[1, 2, 3, 4].map((num) => {
                        const isChecked = Number(draft.roomCapacity) === num;
                        return (
                          <div
                            key={num}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setDraft(prev => ({ ...prev, roomCapacity: num.toString() }))}
                          >
                            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${isChecked ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                              {isChecked && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                            </div>
                            <span className="text-gray-800 font-medium">{num}인</span>
                          </div>
                        );
                      })}
                      <div className="col-span-2 flex items-center gap-3 mt-1">
                        <div
                          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
                          onClick={() => {
                            if ([1, 2, 3, 4].includes(Number(draft.roomCapacity))) {
                              setDraft(prev => ({ ...prev, roomCapacity: "-1" }));
                            }
                          }}
                        >
                          <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${(![1, 2, 3, 4].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "") ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                            {(![1, 2, 3, 4].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "") && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                          </div>
                          <span className="text-gray-800 font-medium">기타</span>
                        </div>
                        <input
                          type="number"
                          className="form-input flex-1 ml-1 text-sm bg-transparent border-gray-200 rounded-xl"
                          placeholder="기타 인원을 입력해주세요"
                          value={(![1, 2, 3, 4].includes(Number(draft.roomCapacity)) && draft.roomCapacity !== "-1" && draft.roomCapacity !== "") ? draft.roomCapacity : ""}
                          onChange={(e) => setDraft(prev => ({ ...prev, roomCapacity: e.target.value }))}
                          onClick={() => {
                            if ([1, 2, 3, 4].includes(Number(draft.roomCapacity))) {
                              setDraft(prev => ({ ...prev, roomCapacity: "-1" }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {draft.roomType === "PRIVATE" && (
                  <div className="w-full min-w-[240px] md:flex-[1_1_300px]">
                    <p className="text-sm font-bold text-gray-800 mb-1">최대 인원</p>
                    <div className="mt-4 grid grid-cols-2 gap-y-5 gap-x-2">
                      {[1, 2, 3, 4].map((num) => {
                        const isChecked = Number(draft.roomMaxCapacity) === num;
                        return (
                          <div
                            key={num}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setDraft(prev => ({ ...prev, roomMaxCapacity: num.toString() }))}
                          >
                            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${isChecked ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                              {isChecked && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                            </div>
                            <span className="text-gray-800 font-medium">{num}인</span>
                          </div>
                        );
                      })}
                      <div className="col-span-2 flex items-center gap-3 mt-1">
                        <div
                          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
                          onClick={() => {
                            if ([1, 2, 3, 4].includes(Number(draft.roomMaxCapacity))) {
                              setDraft(prev => ({ ...prev, roomMaxCapacity: "-1" }));
                            }
                          }}
                        >
                          <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${(![1, 2, 3, 4].includes(Number(draft.roomMaxCapacity)) && draft.roomMaxCapacity !== "") ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                            {(![1, 2, 3, 4].includes(Number(draft.roomMaxCapacity)) && draft.roomMaxCapacity !== "") && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                          </div>
                          <span className="text-gray-800 font-medium">기타</span>
                        </div>
                        <input
                          type="number"
                          className="form-input flex-1 ml-1 text-sm bg-transparent border-gray-200 rounded-xl"
                          placeholder="최대 인원을 입력해주세요"
                          value={(![1, 2, 3, 4].includes(Number(draft.roomMaxCapacity)) && draft.roomMaxCapacity !== "-1" && draft.roomMaxCapacity !== "") ? draft.roomMaxCapacity : ""}
                          onChange={(e) => setDraft(prev => ({ ...prev, roomMaxCapacity: e.target.value }))}
                          onClick={() => {
                            if ([1, 2, 3, 4].includes(Number(draft.roomMaxCapacity))) {
                              setDraft(prev => ({ ...prev, roomMaxCapacity: "-1" }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {draft.roomType === "PRIVATE" && (
                  <div className="w-full mt-[-8px]">
                    <p className="text-sm text-primary-orange break-keep whitespace-normal">
                      일반 객실은 기준/최대 인원을 모두 입력하고, 최대 인원은 기준
                      인원 이상이어야 합니다.
                    </p>
                  </div>
                )}

                {/* 이용대상 */}
                <div className="w-full min-w-[240px] md:flex-[1_1_300px]">
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {draft.roomType === "PRIVATE" ? "이용 제한(선택)" : "객실 이용대상"}
                  </p>
                  {draft.roomType === "DORMITORY" && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {[
                        { value: "MIXED", label: "공용" },
                        { value: "MALE_ONLY", label: "남성전용" },
                        { value: "FEMALE_ONLY", label: "여성전용" },
                      ].map((opt) => {
                        const active = draft.dormitoryGenderType === opt.value;
                        return (
                          <div
                            key={opt.value}
                            className="flex items-center gap-3 cursor-pointer mr-2"
                            onClick={() =>
                              setDraft((prev) => ({
                                ...prev,
                                dormitoryGenderType: opt.value,
                              }))
                            }
                          >
                            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${active ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                              {active && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                            </div>
                            <span className="text-gray-800 font-medium">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {draft.roomType === "PRIVATE" && (
                    <div
                      className="flex items-center gap-3 cursor-pointer mt-4"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          femaleOnly: !prev.femaleOnly,
                        }))
                      }
                    >
                      <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 ${draft.femaleOnly ? "border-primary-orange bg-white" : "border-transparent bg-gray-200"}`}>
                        {draft.femaleOnly && <div className="w-3 h-3 rounded-full bg-primary-orange"></div>}
                      </div>
                      <span className="text-gray-800 font-medium">여성전용 객실</span>
                    </div>
                  )}
                  {!draft.roomType && (
                    <p className="text-sm text-gray-400 mt-2">
                      먼저 객실 유형을 선택해 주세요.
                    </p>
                  )}
                </div>

                {/* 가격 */}
                <div className="w-full min-w-[240px] md:flex-[1_1_300px]">
                  <p className="text-sm font-bold text-gray-800 mb-1">객실 가격</p>
                  <div className="flex min-w-0 items-center gap-2 mt-4">
                    <input
                      type="number"
                      className="form-input min-w-0"
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
                  <p className="text-sm text-primary-orange break-keep whitespace-normal">
                    최소 금액은 10,000원 이상입니다.
                  </p>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="rounded-full bg-white border border-gray-300 px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
                  onClick={resetDraft}
                >
                  취소
                </button>
                <button
                  type="button"
                  className={`rounded-full px-6 py-2.5 text-sm font-bold shadow-sm ${isSaveDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary-orange text-white hover:bg-orange-600"
                    }`}
                  disabled={isSaveDisabled}
                  onClick={handleSaveRoom}
                >
                  {isEditing ? "객실 수정하기" : "객실 추가하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
