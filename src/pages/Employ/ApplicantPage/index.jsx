import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import employApi from "@api/employApi";
import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";
import EmptyIcon from "@assets/images/wa_blue_empty.svg";
import { useNavigate } from "react-router-dom";
import ApplicantList from "./ApplicantList";

export default function ApplicantPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selectedGuesthouse, setSelectedGuesthouse] = useState(-1); // -1 = 전체
  const [selectedRecruit, setSelectedRecruit] = useState();
  const [applicants, setApplicants] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 마운트 시: 게스트하우스 목록 + 전체 공고 조회
    tryFetchGuesthouse();
    tryFetchMyRecruit(-1);
  }, []);

  // 게스트하우스 목록 조회
  const tryFetchGuesthouse = async () => {
    try {
      const res = await guesthouseApi.getMyGuesthouses();

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const options = list.map((g) => ({
        id: g.id,
        title: g.guesthouseName,
        subtitle: g.guesthouseAddress,
      }));

      setGuesthouses(options);
    } catch (error) {
      console.warn(
        "나의 게스트하우스 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "나의 게스트하우스 조회 실패",
        message:
          error?.response?.data?.message ||
          "나의 게스트하우스 조회 중 오류가 발생했습니다.",
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
    }
  };

  // 공고 조회 (id = -1 이면 전체)
  const tryFetchMyRecruit = async (id = -1) => {
    setLoading(true);
    try {
      let response;

      if (id === -1) {
        response = await employApi.getMyRecruits();
      } else {
        response = await employApi.getMyRecruitsByGuesthouse(id);
      }

      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      setApplicants(list);
    } catch (error) {
      console.warn(
        "나의 공고 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "나의 공고 조회 실패",
        message:
          error?.response?.data?.message ||
          "나의 공고 조회 중 오류가 발생했습니다.",
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
    } finally {
      setLoading(false);
    }
  };

  // 공고 등록 핸들러
  const handleCreateRecruit = () => {
    setErrorModal({
      visible: true,
      title: "입점된 게스트하우스가 없습니다",
      message: "게스트하우스를 등록하러 가볼까요?",
      buttonText: "게스트하우스 등록하기",
      buttonText2: "다음에 할게요",
      onPress: () => {
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        }));
        navigate(`/employ/recruit-form/`);
      },
      onPress2: () =>
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        })),
      imgUrl: EmptyIcon,
    });
  };

  // 게스트하우스 선택 변경 핸들러
  const handleChangeGuesthouse = (e) => {
    const id = Number(e.target.value);
    setSelectedGuesthouse(id);
    tryFetchMyRecruit(id);
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="page-title">지원자 조회</div>
      </div>

      {/* body */}
      <div className="mb-4">
        {/* 게스트하우스 선택 */}
        <select
          id="guesthouse"
          value={selectedGuesthouse}
          onChange={handleChangeGuesthouse}
          className="w-full rounded-xl border-2 border-primary-blue px-3 py-2 
                   outline-none"
        >
          {/* 전체 옵션 */}
          <option value={-1}>전체 게스트하우스</option>
          {guesthouses.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
      </div>

      <div className="body-container scrollbar-hide">
        {/* 공고가 없는 경우 empty page 띄움 */}
        {applicants.length === 0 && !loading ? (
          <div className="h-[500px]">
            <EmptyComponent
              title="등록한 알바 공고가 없어요"
              subtitle="알바 공고를 등록하러 갈까요?"
              buttonText="알바공고 등록하러 가기"
              onPress={handleCreateRecruit}
            />
          </div>
        ) : (
          <div>
            {/* 공고 리스트 */}
            <div className="flex-col flex gap-2">
              {applicants.map((recruit) => (
                <div
                  key={recruit.recruitId}
                  className="flex flex-col p-4 hover:shadow-md duration-500 rounded-lg "
                >
                  {/* 공고 */}
                  <div className="flex gap-4">
                    <img
                      src={recruit.thumbnailImage}
                      className="w-36 h-36 rounded-lg"
                    />
                    <div className="flex flex-col flex-1 w-full justify-between font-medium">
                      <div className="truncate text-grayscale-700">
                        {recruit.guesthouseName}
                      </div>
                      <div className="text-xl font-semibold truncate">
                        {recruit.recruitTitle}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex-col flex-1 text-grayscale-600">
                          <div className="flex gap-2 ">
                            <p className=" text-grayscale-400 w-20">주소</p>
                            <p className="truncate">{recruit.address}</p>
                          </div>
                          <div className="flex gap-2">
                            <p className=" text-grayscale-400 w-20">최소근무</p>
                            <p className="truncate">{recruit.workDuration}</p>
                          </div>
                          <div className="flex gap-2">
                            <p className="text-grayscale-400 w-20">마감기한</p>
                            <p className="truncate">{recruit.deadline}</p>
                          </div>
                        </div>
                        <div>
                          <ButtonOrange
                            title="지원자 보기"
                            onPress={() => {
                              if (recruit.recruitId == selectedRecruit) {
                                setSelectedRecruit(-1);
                              } else setSelectedRecruit(recruit.recruitId);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 지원서 리스트 */}
                  {selectedRecruit == recruit.recruitId ? (
                    <ApplicantList recruitId={recruit.recruitId} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
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
  );
}
