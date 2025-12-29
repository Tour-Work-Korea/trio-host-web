import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";
import StarIcon from "@assets/images/star_filled.svg";
import SendIcon from "@assets/images/send_filled.svg";
import ReviewDeleteModal from "./ReviewDeleteModal";

export default function ReviewPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selected, setSelected] = useState();
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
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });
  const [replyState, setReplyState] = useState({});
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // 마운트 시: 게스트하우스 목록 + 전체 공고 조회
    tryFetchGuesthouse();
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
      if (options.length > 0) {
        setSelected(options[0].id);
        tryFetchReviews(options[0].id);
      } else {
        setLoading(false);
      }
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
  const tryFetchReviews = async (guesthouseId, pageParam = 0) => {
    setLoading(true);
    try {
      const response = await guesthouseApi.getGuesthouseReviews({
        guesthouseId,
        page: pageParam,
        size: 10,
      });

      const data = response.data;

      setReviews(data?.content || []);
      setPage(data?.number ?? pageParam);
      setPageInfo({
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        first: data?.first ?? true,
        last: data?.last ?? true,
      });
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
    } finally {
      setLoading(false);
    }
  };

  // 삭제 요청 핸들러
  const handleDeleteReview = (id) => {
    setErrorModal({
      visible: true,
      title: `삭제 요청은 관리자의 검토 후 처리돼요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "네, 요청할래요",
      buttonText2: "보류할게요",
      onPress: () => {
        setDeleteModal({ visible: true, id });
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        }));
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
    setPage(0);
    tryFetchReviews(id, 0);
  };

  //페이징 함수
  const handleChangePage = (newPage) => {
    if (newPage === page) return;
    const targetId = selected || guesthouses[0]?.id;
    if (!targetId) return;

    setPage(newPage);
    tryFetchReviews(targetId, newPage);
  };

  // 답글 입력 열기/닫기
  const toggleReply = (id) => {
    setReplyState((prev) => {
      const current = prev[id] || { open: false, text: "" };
      return {
        ...prev,
        [id]: { ...current, open: !current.open },
      };
    });
  };

  // textarea 내용 변경
  const updateReplyText = (id, text) => {
    setReplyState((prev) => {
      const current = prev[id] || { open: true, text: "" };
      return {
        ...prev,
        [id]: { ...current, text },
      };
    });
  };

  // 답장 전송
  const sendReply = async (id, content) => {
    if (!content.trim()) return;

    try {
      await guesthouseApi.postReviewReply(id, content);

      // 더미/프론트에서만: 로컬 상태에 답글 추가
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? {
                ...review,
                replies: [...(review.replies || []), content],
              }
            : review
        )
      );

      // 전송 후 textarea 닫고 내용 초기화
      setReplyState((prev) => ({
        ...prev,
        [id]: { open: false, text: "" },
      }));
    } catch (error) {
      console.warn("답글 전송 실패:", error?.response?.data?.message || error);
      setErrorModal({
        visible: true,
        title: "답글 전송 실패",
        message:
          error?.response?.data?.message || "답글 전송 중 오류가 발생했습니다.",
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
          {guesthouses.length == 0 && (
            <option>등록된 게스트하우스가 없습니다</option>
          )}
          {/* 전체 옵션 */}
          {guesthouses.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
      </div>

      {reviews.length === 0 && !loading ? (
        <div className="body-container scrollbar-hide h-[500px]">
          <EmptyComponent title="해당 게스트하우스에 등록된 리뷰가 없어요" />
        </div>
      ) : (
        <div className="body-container scrollbar-hide">
          <div>
            <div className="flex-col flex gap-2">
              {reviews.map((review) => {
                const state = replyState[review.id] || {
                  open: false,
                  text: "",
                };

                return (
                  <div
                    key={review.id}
                    className="flex flex-col p-4 hover:shadow-md duration-500 rounded-lg gap-2"
                  >
                    {/* 평점 */}
                    <div className="flex gap-2 items-center">
                      <img src={StarIcon} width={18} />
                      <div className="text-lg font-semibold">
                        {review.reviewRating}
                      </div>
                    </div>

                    {/* 이미지들 */}
                    <div className="flex gap-2">
                      {review?.imgUrls.map((el, id) => (
                        <img
                          key={id}
                          src={el}
                          className="w-30 h-30 rounded-lg"
                        />
                      ))}
                    </div>

                    {/* 유저 + 삭제요청 */}
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        {review?.userImgUrl == null ||
                        review.userImgUrl == "사진을 추가해주세요" ? (
                          <div className="w-10 h-10 rounded-full bg-grayscale-200" />
                        ) : (
                          <img
                            src={review?.userImgUrl}
                            className="w-10 h-10 rounded-full bg-grayscale-200"
                          />
                        )}

                        <div className="font-medium">{review.nickname}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="bg-grayscale-200 px-4 h-8 text-sm rounded-lg font-medium"
                      >
                        삭제 요청
                      </button>
                    </div>

                    {/* 리뷰 내용 */}
                    <div className="border-1 border-grayscale-200 p-4 rounded-lg bg-primary-blue">
                      <p className="bg-primary-orange font-semibold text-white">
                        {review.reviewDetail}
                      </p>
                    </div>

                    <div className="border-1 w-full border-grayscale-200" />

                    {/* 답글 영역 */}
                    <div className="font-medium">답글</div>

                    {/* 기존 답글 리스트 */}
                    <div className="flex-col gap-2 flex">
                      {review?.replies?.map((reply, id) => (
                        <p
                          className="w-full border-grayscale-200 border-1 p-4 rounded-lg bg-grayscale-50"
                          key={id}
                        >
                          {reply}
                        </p>
                      ))}
                    </div>

                    {/* 답글 입력창 (해당 리뷰만) */}
                    {state.open && (
                      <div className="w-full flex gap-2 items-center mt-2">
                        <textarea
                          className="form-input-textarea flex-1"
                          value={state.text}
                          onChange={(e) =>
                            updateReplyText(review.id, e.target.value)
                          }
                        />
                        <button
                          onClick={() => sendReply(review.id, state.text)}
                          className="px-2 py-2 rounded-full bg-primary-orange items-center justify-center flex"
                        >
                          <img src={SendIcon} width={20} />
                        </button>
                      </div>
                    )}

                    {/* 버튼 텍스트는 상황에 따라 변경해도 됨 */}
                    <button
                      onClick={() => toggleReply(review.id)}
                      className="w-full bg-grayscale-200 text-grayscale-800 py-2 rounded-lg font-medium mt-2"
                    >
                      {state.open ? "답글 닫기" : "답글 달기"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {pageInfo.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* 이전 버튼 */}
                <button
                  type="button"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={pageInfo.first}
                  className={`px-3 py-1 rounded-lg border ${
                    pageInfo.first
                      ? "text-grayscale-300 border-grayscale-200 cursor-default"
                      : "text-grayscale-700 border-grayscale-300 hover:bg-grayscale-100"
                  }`}
                >
                  이전
                </button>

                {/* 페이지 번호들 */}
                {Array.from({ length: pageInfo.totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChangePage(idx)}
                    className={`px-3 py-1 rounded-lg border ${
                      idx === page
                        ? "bg-primary-blue text-white border-primary-blue"
                        : "bg-white text-grayscale-700 border-grayscale-300 hover:bg-grayscale-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  type="button"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={pageInfo.last}
                  className={`px-3 py-1 rounded-lg border ${
                    pageInfo.last
                      ? "text-grayscale-300 border-grayscale-200 cursor-default"
                      : "text-grayscale-700 border-grayscale-300 hover:bg-grayscale-100"
                  }`}
                >
                  다음
                </button>
              </div>
            )}
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

      {/* 삭제 요청 모달 */}
      <ReviewDeleteModal
        id={deleteModal.id}
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: null })}
        setErrorModal={setErrorModal}
      />
    </div>
  );
}
