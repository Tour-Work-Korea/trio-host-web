import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import employApi from "../../../api/employApi";
import ErrorModal from "@components/ErrorModal";
import ButtonWhite from "@components/ButtonWhite";

export default function MyRecruitPage() {
  const [recruits, setRecruits] = useState([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    buttonText2: null,
    onPress: () => setErrorModal({ ...errorModal, visible: false }),
    onPress2: null,
  });

  useEffect(() => {
    tryFetchMyRecruit();
  }, []);

  //공고 조회
  const tryFetchMyRecruit = async () => {
    try {
      const response = await employApi.getMyRecruits();
      setRecruits(response.data);
      console.log(response.data);
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
      });
    }
  };

  //공고 등록 핸들러
  const handleCreateRecruit = () => {};
  return (
    <div className="container">
      <div className="page-title">나의 공고</div>
      {/* body */}
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
                    <div className="">{recruit.guesthouseName}</div>
                    <div className="text-2xl font-semibold">
                      {recruit.recruitTitle}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex-col">
                        <div className="flex gap-2">
                          <p className=" text-grayscale-400 w-20">주소</p>
                          <p className="">{recruit.address}</p>
                        </div>
                        <div className="flex gap-2">
                          <p className=" text-grayscale-400 w-20">최소근무</p>
                          <p className="">{recruit.workDuration}</p>
                        </div>
                        <div className="flex gap-2">
                          <p className="text-grayscale-400 w-20">마감기한</p>
                          <p>{recruit.deadline}</p>
                        </div>
                      </div>
                      <div>
                        <ButtonWhite title="마감요청" onPress={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
        onPress={errorModal.onPress}
      />
    </div>
  );
}
