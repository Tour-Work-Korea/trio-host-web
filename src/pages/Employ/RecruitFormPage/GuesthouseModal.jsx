/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import guesthouseApi from "@api/guesthouseApi";
import ButtonOrange from "@components/ButtonOrange";
import ErrorModal from "@components/ErrorModal";

import XBtn from "@assets/images/x_gray.svg";
import DisabledRadioButton from "@assets/images/radio_button_disabled.svg";
import EnabledRadioButton from "@assets/images/radio_button_enabled.svg";
import EmployLogo from "@assets/images/wa_blue_empty.svg";

export default function GuesthouseModal({
  handleInputChange,
  formData,
  visible,
}) {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selectedId, setSelectedId] = useState(formData?.guesthouseId ?? 0);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGuestHouse = async () => {
      setLoading(true);
      try {
        const res = await guesthouseApi.getMyGuesthouses();
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setGuesthouses(list);
      } catch (error) {
        setErrorModal({
          visible: true,
          title:
            error?.response?.data?.message ||
            "나의 게스트하우스 조회에 실패했습니다.",
          message: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyGuestHouse();
  }, []);

  useEffect(() => {
    handleInputChange("guesthouseId", selectedId);
  }, [selectedId]);

  // 모달 열릴 때마다 선택값을 formData 기준으로 맞춰줌
  useEffect(() => {
    if (!visible) return;
    setSelectedId(formData?.guesthouseId ?? 0);
  }, [visible, formData?.guesthouseId]);

  if (!visible) return null;
  if (loading) return null;

  // 게스트하우스가 하나도 없을 때: 안내 모달 형태로 노출
  if (guesthouses.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-white px-6 py-6 text-center flex flex-col items-center gap-4">
        <img src={EmployLogo} alt="게스트하우스" className="w-16 h-16 mb-2" />
        <h2 className="text-lg font-semibold">게스트하우스</h2>
        <p className="text-md text-grayscale-500">
          입점된 게스트하우스가 없어요
        </p>
        <p className="text-sm text-grayscale-400">
          게스트하우스를 등록하러 가볼까요?
        </p>

        <div className="mt-2 w-full">
          <ButtonOrange
            title="게스트하우스 등록하기"
            onPress={() => {
              // 실제 등록 페이지 경로에 맞게 수정
              navigate("/host/guesthouse/register");
            }}
          />
        </div>

        <ErrorModal
          visible={errorModal.visible}
          title={errorModal.title}
          message={errorModal.message}
          buttonText="확인"
          buttonText2={null}
          onPress={() => setErrorModal((prev) => ({ ...prev, visible: false }))}
          onPress2={null}
          imgUrl={null}
        />
      </div>
    );
  }

  // 개별 게스트하우스 렌더
  const renderGuesthouse = (gh) => {
    const checked = selectedId === gh.id;
    return (
      <button
        key={gh.id}
        type="button"
        className="w-full flex items-center gap-3 rounded-2xl bg-grayscale-50 px-3 py-3 hover:bg-grayscale-100 transition duration-300"
        onClick={() => setSelectedId(gh.id)}
      >
        <div className="flex items-center justify-center">
          <img
            src={checked ? EnabledRadioButton : DisabledRadioButton}
            alt={checked ? "선택됨" : "선택"}
            className="w-6 h-6"
          />
        </div>

        <div className="w-[80px] h-[80px] rounded-md overflow-hidden bg-grayscale-100 shrink-0">
          {gh.thumbnailImg && (
            <img
              src={gh.thumbnailImg}
              alt={gh.guesthouseName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-md font-semibold text-grayscale-900 truncate">
            {gh.guesthouseName}
          </p>
          <p className="mt-1 text-sm text-grayscale-500">
            {gh.guesthouseAddress}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-h-[90vh] px-5 pt-5 pb-6 flex flex-col">
      <p className="text-md text-grayscale-400 text-center mb-4">
        알바 공고에 등록할 게스트하우스를 선택해주세요
      </p>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {guesthouses.map(renderGuesthouse)}
      </div>

      {/* 에러 모달 */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        buttonText="확인"
        buttonText2={null}
        onPress={() => setErrorModal((prev) => ({ ...prev, visible: false }))}
        onPress2={null}
        imgUrl={null}
      />
    </div>
  );
}
