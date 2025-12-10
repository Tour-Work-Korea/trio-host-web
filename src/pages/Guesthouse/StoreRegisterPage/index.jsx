import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";
import { useNavigate } from "react-router-dom";

export default function StoreRegisterPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    onPress: () =>
      setErrorModal((prev) => ({
        ...prev,
        visible: false,
      })),
  });

  useEffect(() => {
    tryFetchApplications();
  }, []);

  const tryFetchApplications = async () => {
    try {
      setLoading(true);
      const response = await guesthouseApi.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      setErrorModal({
        ...errorModal,
        visible: true,
        title: "입점신청서 조회 실패",
        message:
          error?.response?.data?.message ||
          "입점신청서 조회 중 오류가 발생했습니다.",
        buttonText: "확인",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApplication = () => {
    navigate("/guesthouse/store-register-form");
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="page-title">입점신청서 조회</div>
        <div>
          <ButtonOrange
            title="입점신청하기"
            onPress={() => handleCreateApplication()}
          />
        </div>
      </div>

      <div className="body-container scrollbar-hide">
        {/* 공고가 없는 경우 empty page 띄움 */}

        {applications.length === 0 && !loading ? (
          <div className="h-[500x]">
            <EmptyComponent
              title="등록한 입점신청서가 없어요"
              subtitle="입점신청서를 등록하러 갈까요?"
              buttonText="입점신청하러 가기"
              onPress={handleCreateApplication}
            />
          </div>
        ) : (
          <div>
            {/* 공고 리스트 */}
            <div className="flex-col flex gap-2">
              {applications.map((el) => (
                <div
                  key={el.recruitId}
                  className="flex flex-col border-1 border-grayscale-200 p-4 hover:shadow-md duration-500 rounded-lg "
                >
                  <div className="flex flex-col flex-1 w-full justify-between">
                    <div className="text-lg font-semibold mb-2">
                      {el.businessName}
                    </div>
                    <p className="text-grayscale-500">{el.address}</p>

                    <p
                      className={`${
                        el.status == "승인 완료"
                          ? "text-semantic-green"
                          : "text-semantic-red"
                      }`}
                    >
                      {el.status == "승인 완료" ? "입점 완료" : "승인 대기중"}
                    </p>
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
    </div>
  );
}
