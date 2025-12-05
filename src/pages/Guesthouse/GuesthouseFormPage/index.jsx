/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";

import guesthouseApi from "@api/guesthouseApi";
import {
  publicFacilities,
  roomFacilities,
  services,
} from "@data/guesthouseOptions";
import { guesthouseTags } from "@data/guesthouseTags";

// 섹션 컴포넌트
import PostRegisterSection from "./PostRegisterSection";
import InfoSection from "./InfoSection";
import IntroSummarySection from "./IntroSummarySection";
import DetailInfoSection from "./DetailInfoSection";
import RulesSection from "./RulesSection";
import AmenitiesSection from "./AmenitiesSection";
import RoomsSection from "./RoomsSection";

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

const computeValidSections = (formData) => {
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

  const postRegister = Boolean(applicationId);
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
    roomInfos: [], // ✅ 객실 정보
  });

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

  // formData 변경 시 섹션 유효성 갱신
  useEffect(() => {
    setValid(computeValidSections(formData));
  }, [formData]);

  // 입점 신청서 목록 조회
  useEffect(() => {
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
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (field, value) => {
    const normalized = normalizeTimeToHHMMSS(value);
    setFormData((prev) => ({
      ...prev,
      [field]: normalized,
    }));
  };

  // 입점 신청서 선택
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
        isThumbnail: existing.length === 0 && index === 0, // 첫 장만 대표
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

  // 등록
  const handleSubmit = async () => {
    if (!isAllValid) return;

    try {
      const guesthouseImagesPayload = (formData.guesthouseImages || []).map(
        (img) => ({
          guesthouseImageUrl: img.previewUrl,
          isThumbnail: !!img.isThumbnail,
        })
      );

      const roomInfosPayload = (formData.roomInfos || []).map((room) => ({
        roomName: room.roomName,
        roomDesc: room.roomDesc,
        roomCapacity: Number(room.roomCapacity),
        roomMaxCapacity: Number(room.roomMaxCapacity ?? room.roomCapacity),
        roomType: room.roomType,
        roomPrice: Number(room.roomPrice),
        roomImages:
          room.roomImages?.map((img) => ({
            roomImageUrl: img.roomImageUrl,
            isThumbnail: !!img.isThumbnail,
          })) ?? [],
      }));

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
        hashtagIds: formData.hashtagIds,
        amenities: formData.amenities,
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
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "게스트하우스 등록 중 오류가 발생했습니다.";
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: serverMessage,
      }));
    }
  };

  return (
    <div className="container">
      <div className="page-title">나의 게스트하우스</div>
      <div className="flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <PostRegisterSection
              open={visible.postRegister}
              onToggle={() => toggleSection("postRegister")}
              valid={valid.postRegister}
              applications={applications}
              selectedApplication={selectedApplication}
              onSelectApplication={handleSelectApplication}
            />

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
              모든 항목을 입력하셔야 등록이 완료됩니다
            </p>

            <div className="mt-4 flex justify-center">
              <ButtonOrange
                title="등록하기"
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
