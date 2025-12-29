/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";

import guesthouseApi from "@api/guesthouseApi";
import {
  publicFacilities,
  roomFacilities,
  services,
} from "@data/guesthouseOptions";
import { guesthouseTags } from "@data/guesthouseTags";
import { AMENITY_NAME_TO_ID, HASHTAG_TEXT_TO_ID } from "@data/guesthouseMaps";

// 섹션 컴포넌트
import PostRegisterSection from "./PostRegisterSection";
import InfoSection from "./InfoSection";
import IntroSummarySection from "./IntroSummarySection";
import DetailInfoSection from "./DetailInfoSection";
import RulesSection from "./RulesSection";
import AmenitiesSection from "./AmenitiesSection";
import RoomsSection from "./RoomsSection";

// 임시저장 import
import { createDraftStore } from "@utils/draftStorage";

// ===== 유틸 =====
const isNonEmpty = (v) =>
  (typeof v === "string" && v.trim().length > 0) ||
  (typeof v === "number" && !Number.isNaN(v));

const hasThumb = (arr = []) =>
  Array.isArray(arr) && arr.some((i) => i?.isThumbnail === true);

const normalizeTimeToHHMMSS = (value) => {
  if (!value) return "";
  if (value.length === 5) return `${value}:00`;
  return value;
};

const displayTimeHHMM = (value) => {
  if (!value) return "";
  return value.slice(0, 5);
};

// 수정: isEditMode에 따라 postRegister validation 다르게
const computeValidSections = (formData, { isEditMode = false } = {}) => {
  const {
    applicationId,
    guesthouseName,
    guesthouseAddress,
    guesthousePhone,
    checkIn,
    checkOut,
    hashtagIds,
    guesthouseShortIntro,
    guesthouseImages,
    guesthouseLongDesc,
    rules,
    amenities,
    roomInfos,
  } = formData;

  const postRegister = isEditMode ? true : Boolean(applicationId);

  const info =
    isNonEmpty(guesthouseName) &&
    isNonEmpty(guesthouseAddress) &&
    isNonEmpty(guesthousePhone) &&
    isNonEmpty(checkIn) &&
    isNonEmpty(checkOut) &&
    Array.isArray(hashtagIds) &&
    hashtagIds.length > 0;

  const introSummary =
    isNonEmpty(guesthouseShortIntro) &&
    Array.isArray(guesthouseImages) &&
    guesthouseImages.length > 0 &&
    hasThumb(guesthouseImages);

  const detailInfo = isNonEmpty(guesthouseLongDesc);
  const rulesValid = isNonEmpty(rules);
  const amenitiesValid = Array.isArray(amenities) && amenities.length > 0;
  const roomsValid = Array.isArray(roomInfos) && roomInfos.length > 0;

  return {
    postRegister,
    info,
    introSummary,
    detailInfo,
    rules: rulesValid,
    amenities: amenitiesValid,
    rooms: roomsValid,
  };
};

export default function GuesthouseForm() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams();
  const numericGuesthouseId = guesthouseId ? Number(guesthouseId) : null;
  const isEditMode = !!numericGuesthouseId;

  const [formData, setFormData] = useState({
    applicationId: null,
    guesthouseName: "",
    guesthouseAddress: "",
    guesthouseDetailAddress: "",
    guesthousePhone: "",
    checkIn: "15:00:00",
    checkOut: "11:00:00",
    guesthouseShortIntro: "",
    guesthouseLongDesc: "",
    guesthouseImages: [], // { serverUrl, previewUrl, isThumbnail }
    hashtagIds: [],
    rules: "",
    amenities: [], // [{ amenityId, count }]
    roomInfos: [], //
  });

  // 🔹 수정 모드에서 "초기 객실 목록" 저장용
  const originalRoomsRef = useRef([]);

  // 입점 신청서
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // 섹션 토글
  const [visible, setVisible] = useState({
    postRegister: false,
    info: false,
    introSummary: false,
    rooms: false,
    detailInfo: false,
    rules: false,
    amenities: false,
  });

  // 섹션별 유효성
  const [valid, setValid] = useState({
    postRegister: false,
    info: false,
    introSummary: false,
    rooms: false,
    detailInfo: false,
    rules: false,
    amenities: false,
  });

  const isAllValid = useMemo(
    () => Object.values(valid).every(Boolean),
    [valid]
  );

  // 에러/알림 모달
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    buttonText2: null,
    onPress: () =>
      setErrorModal((prev) => ({
        ...prev,
        visible: false,
      })),
    onPress2: null,
    imgUrl: null,
  });

  const toggleSection = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // formData 변경 시 섹션 유효성 갱신 (모드에 따라 다르게)
  useEffect(() => {
    setValid(computeValidSections(formData, { isEditMode }));
  }, [formData, isEditMode]);

  //임시저장 namespace 정의
  const draftStore = createDraftStore(
    isEditMode ? "guesthouse:edit" : "guesthouse:new"
  );
  useEffect(() => {
    const loaded = draftStore.load();
    if (loaded.exists) {
      setFormData(loaded.data);
    }
  }, []);

  // 수정 모드일 때: 기존 게스트하우스 상세 조회해서 formData 초기화
  useEffect(() => {
    if (!isEditMode) return;

    const fetchDetail = async () => {
      try {
        const res = await guesthouseApi.getGuesthouseDetail(
          numericGuesthouseId
        );
        const data = res.data;

        const mappedAmenities =
          data.amenities
            ?.map((a) => {
              const baseId =
                AMENITY_NAME_TO_ID[a.amenityType] ||
                AMENITY_NAME_TO_ID[a.amenityName];

              if (!baseId) {
                console.warn("알 수 없는 편의시설 매핑 실패:", a);
                return null;
              }

              return {
                amenityId: baseId,
                count: a.count ?? 1,
              };
            })
            .filter(Boolean) ?? [];

        const mappedHashtagIds =
          data.hashtags
            ?.map((h) => {
              const baseId = HASHTAG_TEXT_TO_ID[h.hashtag];
              if (!baseId) {
                console.warn("알 수 없는 해시태그 매핑 실패:", h);
              }
              return baseId;
            })
            .filter(Boolean) ?? [];

        const mappedRooms =
          data.roomInfos?.map((room) => ({
            id: room.id ?? room.roomId,
            roomName: room.roomName,
            roomDesc: room.roomDesc ?? room.roomDescription ?? "",
            roomCapacity: room.roomCapacity,
            roomMaxCapacity: room.roomMaxCapacity ?? room.roomCapacity,
            roomType: room.roomType,
            roomPrice: room.roomPrice,
            roomExtraFees: room.roomExtraFees ?? [],
            roomImages:
              room.roomImages?.map((img) => ({
                roomImageUrl: img.roomImageUrl,
                isThumbnail: img.isThumbnail,
              })) ?? [],
          })) ??
          data.rooms?.map((room) => ({
            id: room.roomId,
            roomName: room.roomName,
            roomDesc: "",
            roomCapacity: room.roomCapacity ?? room.roomMaxCapacity,
            roomMaxCapacity: room.roomMaxCapacity ?? room.roomCapacity,
            roomType: room.roomType,
            roomPrice: room.roomPrice ?? 0,
            roomExtraFees: [],
            roomImages:
              room.roomImages?.map((img) => ({
                roomImageUrl: img.roomImageUrl,
                isThumbnail: img.isThumbnail,
              })) ??
              (room.thumbnailImg
                ? [
                    {
                      roomImageUrl: room.thumbnailImg,
                      isThumbnail: true,
                    },
                  ]
                : []),
          })) ??
          [];

        const mapped = {
          applicationId: data.applicationId ?? null,
          guesthouseName: data.guesthouseName ?? "",
          guesthouseAddress: data.guesthouseAddress ?? "",
          guesthouseDetailAddress: data.guesthouseDetailAddress ?? "",
          guesthousePhone: data.guesthousePhone ?? "",
          checkIn: data.checkIn ?? "15:00:00",
          checkOut: data.checkOut ?? "11:00:00",
          guesthouseShortIntro: data.guesthouseShortIntro ?? "",
          guesthouseLongDesc:
            data.guesthouseLongDesc ?? data.guesthouseLongDescription ?? "",
          guesthouseImages:
            data.guesthouseImages?.map((img) => ({
              serverUrl: img.guesthouseImageUrl,
              previewUrl: img.guesthouseImageUrl,
              isThumbnail: img.isThumbnail,
            })) ?? [],
          hashtagIds: mappedHashtagIds,
          rules: data.rules ?? "",
          amenities: mappedAmenities,
          roomInfos: mappedRooms,
        };

        setFormData(mapped);
        originalRoomsRef.current = mappedRooms; // 🔹 초기 객실 목록 저장
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          "게스트하우스 정보를 불러오지 못했어요.";
        setErrorModal((prev) => ({
          ...prev,
          visible: true,
          title: serverMessage,
        }));
      }
    };

    fetchDetail();
  }, [isEditMode, numericGuesthouseId]);

  // 입점 신청서 목록 조회 (등록 모드에서만 의미 있음)
  useEffect(() => {
    if (isEditMode) return;

    const fetchApplications = async () => {
      try {
        const res = await guesthouseApi.getHostApplications();
        const filtered =
          (res?.data || [])
            .filter(
              (app) => app.status === "승인 완료" && app.registered === false
            )
            .map((app) => ({
              id: app.id,
              businessName: app.businessName,
              address: app.address,
              detailAddress: app.detailAddress,
              businessPhone: app.businessPhone,
              imgUrl: app.imgUrl,
            })) ?? [];

        setApplications(filtered);
      } catch (error) {
        setApplications([]);
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          "입점 신청서 목록을 불러오지 못했어요.";
        setErrorModal((prev) => ({
          ...prev,
          visible: true,
          title: serverMessage,
        }));
      }
    };

    fetchApplications();
  }, [isEditMode]);

  //자동 임시저장
  const handleInputChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    draftStore.save(next);
  };

  const handleTimeChange = (field, value) => {
    const normalized = normalizeTimeToHHMMSS(value);
    setFormData((prev) => ({
      ...prev,
      [field]: normalized,
    }));
  };

  // 입점 신청서 선택 (등록 모드 전용)
  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
    setFormData((prev) => ({
      ...prev,
      applicationId: app.id,
      guesthouseName: app.businessName ?? prev.guesthouseName,
      guesthouseAddress: app.address ?? prev.guesthouseAddress,
      guesthouseDetailAddress:
        app.detailAddress ?? prev.guesthouseDetailAddress,
      guesthousePhone: app.businessPhone ?? prev.guesthousePhone,
    }));
  };

  // 배너 이미지 업로드
  const handleImagesUploaded = (urls) => {
    setFormData((prev) => {
      const existing = prev.guesthouseImages || [];
      const mapped = urls.map((url, index) => ({
        serverUrl: url,
        previewUrl: url,
        isThumbnail: existing.length === 0 && index === 0,
      }));
      const merged = [...existing, ...mapped];

      const safe = hasThumb(merged)
        ? merged
        : merged.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));

      return { ...prev, guesthouseImages: safe };
    });
  };

  const setThumbnail = (index) => {
    setFormData((prev) => ({
      ...prev,
      guesthouseImages: prev.guesthouseImages.map((img, idx) => ({
        ...img,
        isThumbnail: idx === index,
      })),
    }));
  };

  const deleteImage = (index) => {
    setFormData((prev) => {
      const next = prev.guesthouseImages.filter((_, i) => i !== index);
      const normalized = hasThumb(next)
        ? next
        : next.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));
      return {
        ...prev,
        guesthouseImages: normalized,
      };
    });
  };

  const handleImageUploadError = (message) => {
    if (!message) return;
    setErrorModal((prev) => ({
      ...prev,
      visible: true,
      title: message,
    }));
  };

  // 태그 토글 (최대 3개)
  const toggleTag = (id) => {
    setFormData((prev) => {
      const already = prev.hashtagIds.includes(id);
      if (already) {
        return {
          ...prev,
          hashtagIds: prev.hashtagIds.filter((tagId) => tagId !== id),
        };
      }
      if (prev.hashtagIds.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        hashtagIds: [...prev.hashtagIds, id],
      };
    });
  };

  // 편의시설 토글
  const toggleAmenity = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities.some((a) => a.amenityId === id);
      if (exists) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a.amenityId !== id),
        };
      }
      return {
        ...prev,
        amenities: [...prev.amenities, { amenityId: id, count: 1 }],
      };
    });
  };

  // 객실 리스트 변경 (RoomsSection에서 내려줌)
  const handleRoomsChange = (rooms) => {
    setFormData((prev) => ({
      ...prev,
      roomInfos: rooms,
    }));
  };

  // 🔹 등록 / 수정 공통 처리
  const handleSubmit = async () => {
    if (!isAllValid) return;

    try {
      // 공통 payload들
      const guesthouseImagesPayload =
        formData.guesthouseImages?.map((img) => ({
          guesthouseImageUrl: img.serverUrl || img.previewUrl,
          isThumbnail: !!img.isThumbnail,
        })) ?? [];

      const amenitiesPayload = formData.amenities ?? [];
      const hashtagIdsPayload = formData.hashtagIds ?? [];

      if (!isEditMode) {
        // =========================
        // 🚩 등록 모드
        // =========================
        const roomInfosPayload =
          formData.roomInfos?.map((room) => ({
            roomName: room.roomName,
            roomType: room.roomType,
            roomCapacity: Number(room.roomCapacity),
            roomMaxCapacity: Number(room.roomMaxCapacity ?? room.roomCapacity),
            roomDesc: room.roomDesc,
            roomPrice: Number(room.roomPrice),
            roomExtraFees: room.roomExtraFees ?? [],
            roomImages:
              room.roomImages?.map((img) => ({
                roomImageUrl: img.roomImageUrl,
                isThumbnail: !!img.isThumbnail,
              })) ?? [],
          })) ?? [];

        const payload = {
          applicationId: formData.applicationId,
          guesthouseName: formData.guesthouseName,
          guesthouseAddress: formData.guesthouseAddress,
          guesthouseDetailAddress: formData.guesthouseDetailAddress,
          guesthousePhone: formData.guesthousePhone,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guesthouseShortIntro: formData.guesthouseShortIntro,
          guesthouseLongDesc: formData.guesthouseLongDesc,
          rules: formData.rules,
          hashtagIds: hashtagIdsPayload,
          amenities: amenitiesPayload,
          guesthouseImages: guesthouseImagesPayload,
          roomInfos: roomInfosPayload,
        };

        await guesthouseApi.registerGuesthouse(payload);

        setErrorModal({
          visible: true,
          title: "게스트하우스를 등록했어요",
          message: null,
          buttonText: "확인",
          buttonText2: null,
          onPress: () => {
            setErrorModal((prev) => ({ ...prev, visible: false }));
            navigate("/guesthouse/my");
          },
          onPress2: null,
          imgUrl: null,
        });
      } else {
        // =========================
        // ✏️ 수정 모드
        // =========================
        const basicPayload = {
          guesthouseName: formData.guesthouseName,
          guesthouseAddress: formData.guesthouseAddress,
          guesthouseDetailAddress: formData.guesthouseDetailAddress,
          guesthousePhone: formData.guesthousePhone,
          guesthouseShortIntro: formData.guesthouseShortIntro,
          guesthouseLongDescription: formData.guesthouseLongDesc,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          rules: formData.rules,
        };

        await guesthouseApi.updateGuesthouseBasic(
          numericGuesthouseId,
          basicPayload
        );
        await guesthouseApi.updateGuesthouseImages(
          numericGuesthouseId,
          guesthouseImagesPayload
        );
        await guesthouseApi.updateGuesthouseHashtags(
          numericGuesthouseId,
          hashtagIdsPayload
        );
        await guesthouseApi.updateGuesthouseAmenities(
          numericGuesthouseId,
          amenitiesPayload
        );

        // 🔹 객실 처리
        const currentRooms = formData.roomInfos || [];
        const originalRooms = originalRoomsRef.current || [];

        // 1) upsert (create / update)
        for (const room of currentRooms) {
          const basic = {
            roomName: room.roomName,
            roomType: room.roomType,
            roomCapacity: Number(room.roomCapacity),
            roomMaxCapacity: Number(room.roomMaxCapacity ?? room.roomCapacity),
            roomDescription: room.roomDesc,
            roomPrice: Number(room.roomPrice),
          };

          const images =
            room.roomImages?.map((img) => ({
              roomImageUrl: img.roomImageUrl,
              isThumbnail: !!img.isThumbnail,
            })) ?? [];

          if (room.id) {
            // 기존 방 → update
            await guesthouseApi.updateRoomBasic(
              numericGuesthouseId,
              room.id,
              basic
            );
            await guesthouseApi.updateRoomImages(
              numericGuesthouseId,
              room.id,
              images
            );
          } else {
            // 새 방 → create
            const createPayload = {
              ...basic,
              roomExtraFees: room.roomExtraFees ?? [],
              roomImages: images,
            };
            await guesthouseApi.createRoom(numericGuesthouseId, createPayload);
          }
        }

        // 2) 삭제된 방 처리
        const currentIds = new Set(
          currentRooms.filter((r) => r.id).map((r) => r.id)
        );
        for (const r of originalRooms) {
          if (r.id && !currentIds.has(r.id)) {
            await guesthouseApi.deleteRoom(numericGuesthouseId, r.id);
          }
        }

        setErrorModal({
          visible: true,
          title: "게스트하우스를 수정했어요",
          message: null,
          buttonText: "확인",
          buttonText2: null,
          onPress: () => {
            setErrorModal((prev) => ({ ...prev, visible: false }));
            navigate("/guesthouse/my");
          },
          onPress2: null,
          imgUrl: null,
        });
      }

      draftStore.clear(); //임시저장 삭제
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        (isEditMode
          ? "게스트하우스 수정 중 오류가 발생했습니다."
          : "게스트하우스 등록 중 오류가 발생했습니다.");
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: serverMessage,
      }));
    }
  };

  return (
    <div className="container">
      <div className="page-title">
        {isEditMode ? "게스트하우스 수정" : "나의 게스트하우스"}
      </div>
      <div className="flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {!isEditMode && (
              <PostRegisterSection
                open={visible.postRegister}
                onToggle={() => toggleSection("postRegister")}
                valid={valid.postRegister}
                applications={applications}
                selectedApplication={selectedApplication}
                onSelectApplication={handleSelectApplication}
              />
            )}

            <InfoSection
              open={visible.info}
              onToggle={() => toggleSection("info")}
              valid={valid.info}
              formData={formData}
              handleInputChange={handleInputChange}
              handleTimeChange={handleTimeChange}
              displayTimeHHMM={displayTimeHHMM}
              guesthouseTags={guesthouseTags}
              toggleTag={toggleTag}
            />

            <IntroSummarySection
              open={visible.introSummary}
              onToggle={() => toggleSection("introSummary")}
              valid={valid.introSummary}
              formData={formData}
              handleImagesUploaded={handleImagesUploaded}
              handleImageUploadError={handleImageUploadError}
              setThumbnail={setThumbnail}
              deleteImage={deleteImage}
              handleInputChange={handleInputChange}
            />

            <RoomsSection
              open={visible.rooms}
              onToggle={() => toggleSection("rooms")}
              valid={valid.rooms}
              rooms={formData.roomInfos}
              onChangeRooms={handleRoomsChange}
              onImageUploadError={handleImageUploadError}
            />

            <DetailInfoSection
              open={visible.detailInfo}
              onToggle={() => toggleSection("detailInfo")}
              valid={valid.detailInfo}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <RulesSection
              open={visible.rules}
              onToggle={() => toggleSection("rules")}
              valid={valid.rules}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <AmenitiesSection
              open={visible.amenities}
              onToggle={() => toggleSection("amenities")}
              valid={valid.amenities}
              selectedAmenityIds={formData.amenities.map((a) => a.amenityId)}
              toggleAmenity={toggleAmenity}
              publicFacilities={publicFacilities}
              roomFacilities={roomFacilities}
              services={services}
            />

            <p className="text-sm text-primary-blue mt-2 text-right">
              모든 항목을 입력하셔야{" "}
              {isEditMode ? "수정이 완료됩니다" : "등록이 완료됩니다"}
            </p>

            <div className="mt-4 flex justify-center">
              <ButtonOrange
                title={isEditMode ? "수정하기" : "등록하기"}
                onPress={handleSubmit}
                disabled={!isAllValid}
              />
            </div>
          </div>
        </div>

        <ErrorModal
          visible={errorModal.visible}
          title={errorModal.title}
          message={errorModal.message}
          buttonText={errorModal.buttonText}
          buttonText2={errorModal.buttonText2 ?? null}
          onPress={errorModal.onPress}
          onPress2={errorModal.onPress2 ?? null}
          imgUrl={errorModal.imgUrl ?? null}
        />
      </div>
    </div>
  );
}
