import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import employApi from "@api/employApi";
import ErrorModal from "@components/ErrorModal";
import ButtonWhite from "@components/ButtonWhite";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";
import EmptyIcon from "@assets/images/wa_blue_empty.svg";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";

export default function MyRecruitPage() {
  const [guesthouses, setGuestHouses] = useState([]);
  const [selected, setSelected] = useState(-1); //선택한 게스트하우스 default:전체
  const [recruits, setRecruits] = useState([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    buttonText2: null,
    onPress: () => setErrorModal({ ...errorModal, visible: false }),
    onPress2: null,
    imgUrl: null,
  });
  const [selectModal, setSelectModal] = useState({ visible: false }); //게스트하우스 선택 모달

  const navigate = useNavigate();

  useEffect(() => {
    tryFetchGuestHouse();
    tryFetchMyRecruit();
  }, []);

  useEffect(() => {
    if (guesthouses.length && !guesthouses.some((g) => g.id === selected)) {
      setSelected(guesthouses[0].id);
    }
    tryFetchMyRecruit(selected);
  }, [guesthouses, selected]);

  //게스트하우스 목록 조회
  const tryFetchGuestHouse = async () => {
    try {
      const res = await guesthouseApi.getMyGuesthouses();

      // 응답이 res.data(배열) 혹은 res(배열) 둘 다 대비
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const options = [
        ...list.map((g) => ({
          id: g.id,
          title: g.guesthouseName,
          subtitle: g.guesthouseAddress,
        })),
      ];

      setGuestHouses(options);
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
        onPress: () => setErrorModal({ ...errorModal, visible: false }),
        onPress2: null,
        imgUrl: null,
      });
    }
  };

  //공고 조회
  const tryFetchMyRecruit = async (id) => {
    try {
      // let response;
      // if (id == -1) response = await employApi.getMyRecruits();
      // else response = await employApi.getApplicantsByGuesthouse(id);
      const response = await employApi.getMyRecruits();
      setRecruits(response.data);
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
        onPress: () => setErrorModal({ ...errorModal, visible: false }),
        onPress2: null,
        imgUrl: null,
      });
    }
  };

  //마감 요청
  const tryEndRecruit = async (id) => {
    try {
      await employApi.requestDeleteRecruit(id, "마감요청");
      setErrorModal({
        visible: true,
        title: "성공적으로 공고를 마감했습니다",
        message: null,
        buttonText: "확인",
        onPress: () => setErrorModal({ ...errorModal, visible: false }),
        imgUrl: EmptyIcon,
      });
    } catch (error) {
      console.warn("마감 요청 실패", error?.response?.data?.message || error);
      setErrorModal({
        visible: true,
        title: "마감 요청 실패",
        message:
          error?.response?.data?.message || "마감 요청 중 오류가 발생했습니다.",
        buttonText: "확인",
        onPress: () => setErrorModal({ ...errorModal, visible: false }),
        imgUrl: null,
      });
    }
  };

  //마감 요청 핸들러
  const handleEndRecruit = (id) => {
    setErrorModal({
      visible: true,
      title: `마감 요청은 되돌릴 수 없는 작업이에요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "마감할게요",
      buttonText2: "보류할게요",
      onPress: () => {
        tryEndRecruit(id);
      },
      onPress2: () => setErrorModal({ ...errorModal, visible: false }),
      imgUrl: null,
    });
  };

  //공고 등록 핸들러
  const handleCreateRecruit = () => {
    if (guesthouses.length > 0) setSelectModal({ visible: true });
    else {
      setErrorModal({
        visible: true,
        title: "입점된 게스트하우스가 없습니다",
        message: "게스트하우스를 등록하러 가볼까요?",
        buttonText: "게스트하우스 등록하기",
        buttonText2: "다음에 할게요",
        onPress: () => {
          setErrorModal({ ...errorModal, visible: false });
          alert("게스트하우스 등록으로 이동");
        },
        onPress2: () => setErrorModal({ ...errorModal, visible: false }),
        imgUrl: EmptyIcon,
      });
    }
  };
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="page-title">나의 공고</div>
        <div>
          <ButtonOrange title="새 공고 등록" onPress={handleCreateRecruit} />
        </div>
      </div>
      {/* body */}
      <div className="mb-4">
        {/* 게스트하우스 선택 */}
        <select
          id="guesthouse"
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="w-full rounded-xl border-2 border-primary-blue px-3 py-2 
                   outline-none"
        >
          {guesthouses.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
      </div>
      <div className="body-container scrollbar-hide">
        {/* 공고가 없는 경우 empty page 띄움 */}
        {recruits.length == 0 && (
          <EmptyComponent
            title="등록한 알바 공고가 없어요"
            subtitle="알바 공고를 등록하러 갈까요?"
            buttonText="알바공고 등록하러 가기"
            onPress={handleCreateRecruit}
          />
        )}

        {/* 공고가 존재하는 경우 */}
        {recruits.length > 0 && (
          <div>
            {/* 공고 리스트 */}
            <div className="flex-col flex gap-2">
              {recruits.length > 0 &&
                recruits.map((recruit) => (
                  <div
                    key={recruit.recruitId}
                    className="flex flex-col p-4 hover:shadow-md duration-500 rounded-lg "
                  >
                    <div className="flex gap-4 text-gray-800">
                      <img
                        src={recruit.thumbnailImage}
                        className="w-36 h-36 rounded-lg"
                      />
                      <div className="flex flex-col flex-1 w-full justify-between">
                        <div className="truncate">{recruit.guesthouseName}</div>
                        <div className="text-2xl font-semibold truncate">
                          {recruit.recruitTitle}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex-col flex-1">
                            <div className="flex gap-2 ">
                              <p className=" text-grayscale-400 w-20">주소</p>
                              <p className="truncate">{recruit.address}</p>
                            </div>
                            <div className="flex gap-2">
                              <p className=" text-grayscale-400 w-20">
                                최소근무
                              </p>
                              <p className="truncate">{recruit.workDuration}</p>
                            </div>
                            <div className="flex gap-2">
                              <p className="text-grayscale-400 w-20">
                                마감기한
                              </p>
                              <p className="truncate">{recruit.deadline}</p>
                            </div>
                          </div>
                          <div className="">
                            <ButtonWhite
                              title="마감요청"
                              onPress={() =>
                                handleEndRecruit(recruit.recruitId)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
      {/* 게스트하우스 선택 모달(공고 등록 시) */}
      <SelectModal
        visible={selectModal.visible}
        title={"게스트하우스를 선택해 주세요"}
        items={guesthouses}
        onClose={() => setSelectModal({ visible: false })}
        onPress={(id) => {
          setSelectModal({ visible: false });
          navigate(`/employ/recruit-form/${id}`);
        }}
      />
    </div>
  );
}
