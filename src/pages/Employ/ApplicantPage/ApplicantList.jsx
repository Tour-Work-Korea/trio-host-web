/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import employApi from "@api/employApi";
import ErrorModal from "@components/ErrorModal";
import { formatDateToDot } from "@utils/formatDate";

export default function ApplicantList({ recruitId }) {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setLoading(true);
    tryFetchApplicantsByRecruit();
  }, [recruitId]);

  const tryFetchApplicantsByRecruit = async () => {
    try {
      setLoading(true);
      const response = await employApi.getApplicantsByRecruit(recruitId);
      setApplicants(response.data);
    } catch (error) {
      console.warn(
        "공고별 지원자 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "지원자 조회 실패",
        message:
          error?.response?.data?.message ||
          "지원자 조회 중 오류가 발생했습니다.",
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

  const renderApplicantList = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {applicants.map((el) => (
          <div
            key={el.id}
            className="bg-gray-50 flex-col p-4 rounded-lg gap-2 flex hover:shadow-md hover:cursor-pointer duration-300"
          >
            <p className="text-grayscale-500">
              지원날짜 <span>{formatDateToDot(el.applyDate)}</span>
            </p>
            <div className="flex gap-4 items-center">
              <img
                src={el.photoUrl}
                className="size-32 object-cover object-center rounded-md"
              />
              <div className="flex-col flex justify-between h-full">
                <p className="text-lg font-semibold text-primary-blue">
                  {el.resumeTitle}
                </p>
                <div>
                  <div className="flex gap-2">
                    <div className="w-16 text-grayscale-500">연락처</div>
                    <div>{el.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 text-grayscale-500">MBTI</div>
                    <div>{el.mbti}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 text-grayscale-500">insta</div>
                    <div>{el.instagram}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {el?.userHashtag?.map((el) => (
                <div
                  key={el.id}
                  className="text-primary-blue bg-grayscale-0 px-3 py-1 rounded-full"
                >
                  {el.hashtag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="flex-col flex mt-8">
      {/* 헤더 */}
      <div className="text-lg font-semibold text-gray-600">
        지원서 ({applicants.length})
      </div>
      <div className="border-1 w-full my-2 border-grayscale-200"></div>

      {loading ? null : applicants.length == 0 ? (
        <div className="flex w-full h-30 bg-gray-50 rounded-lg justify-center items-center text-gray-600">
          해당 공고에 지원한 지원자가 없습니다
        </div>
      ) : (
        renderApplicantList()
      )}

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
