import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import employApi from "@api/employApi";
import ErrorModal from "@components/ErrorModal";
import ButtonWhite from "@components/ButtonWhite";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selected, setSelected] = useState(0);
  const [reviews, setReviews] = useState([]);
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
  const [selectModal, setSelectModal] = useState({ visible: false }); //게스트하우스 선택 모달
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 마운트 시: 게스트하우스 목록 + 전체 공고 조회
    tryFetchGuesthouse();
    tryFetchReviews(page);
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

  // 리뷰 조회
  const tryFetchReviews = async (guesthouseId) => {
    try {
      const response = await employApi.getGuesthouseReviews({
        guesthouseId,
        page,
        size: 10,
      });

      setReviews(response.data);
    } catch (error) {
      console.warn(
        "게스트하우스 리뷰 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "게스트하우스 리뷰 조회 실패",
        message:
          error?.response?.data?.message ||
          "게스트하우스 리뷰 조회 중 오류가 발생했습니다.",
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

  // 마감 요청 핸들러
  const handleEndRecruit = (id) => {
    setErrorModal({
      visible: true,
      title: `마감 요청은 되돌릴 수 없는 작업이에요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "마감할게요",
      buttonText2: "보류할게요",
      onPress: () => {
        setErrorModal({
          visible: true,
          title: null,
          message:
            "삭제 요청은 관리자의 검토 후 처리돼요.\n계속 진행하시겠어요?",
          buttonText: "네, 요청할래요",
          buttonText2: "보류할게요",
          onPress: () => {},
          onPress2: setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
          imgUrl: null,
        });
      },
      onPress2: () =>
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        })),
      imgUrl: null,
    });
  };

  // 게스트하우스 선택 변경 핸들러
  const handleChangeGuesthouse = (e) => {
    const id = Number(e.target.value);
    setSelected(id);
    tryFetchReviews(id);
  };

  return (
    <div className="container">
      <div className="flex items-center">
        <div className="page-title">리뷰 관리</div>
      </div>

      {/* body */}
      <div className="mb-4">
        {/* 게스트하우스 선택 */}
        <select
          id="guesthouse"
          value={selected}
          onChange={handleChangeGuesthouse}
          className="w-full rounded-xl border-2 border-primary-blue px-3 py-2 
                   outline-none"
        >
          {/* 전체 옵션 */}
          {guesthouses.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
      </div>

      {reviews.length === 0 ? (
        <div className="body-container scrollbar-hide h-[500px]">
          <EmptyComponent title="헤당 게스트하우스에 등록된 리뷰가 없어요" />
        </div>
      ) : (
        <div className="body-container scrollbar-hide">
          <div>
            {/* 공고 리스트 */}
            <div className="flex-col flex gap-2">
              {reviews.map((recruit) => (
                <div
                  key={recruit.recruitId}
                  className="flex flex-col p-4 hover:shadow-md duration-500 rounded-lg "
                >
                  <div className="flex gap-4">
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
                            <p className=" text-grayscale-400 w-20">최소근무</p>
                            <p className="truncate">{recruit.workDuration}</p>
                          </div>
                          <div className="flex gap-2">
                            <p className="text-grayscale-400 w-20">마감기한</p>
                            <p className="truncate">{recruit.deadline}</p>
                          </div>
                        </div>
                        <div>
                          <ButtonWhite
                            title="마감요청"
                            onPress={() => handleEndRecruit(recruit.recruitId)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* 게스트하우스 선택 모달(공고 등록 시) */}
      <SelectModal
        visible={selectModal.visible}
        title={"게스트하우스를 선택해 주세요"}
        items={guesthouses} // 여기에는 '전체' 안 들어감
        onClose={() => setSelectModal({ visible: false })}
        onPress={() => {
          setSelectModal({ visible: false });
          navigate(`/employ/recruit-form/`);
        }}
      />
    </div>
  );
}
