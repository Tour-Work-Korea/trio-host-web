import React, { useEffect, useState } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import { useNavigate } from "react-router-dom";
import StarIcon from "@assets/images/star_filled.svg";
import SendIcon from "@assets/images/send_filled.svg";
import ReviewDeleteModal from "./ReviewDeleteModal";
import { ChevronRight } from "lucide-react";

export default function ReviewPage() {
  const { activeGuesthouseId, guesthouses } = useGuesthouseStore();
  const [reviews, setReviews] = useState([]);
  const [errorModal, setErrorModal] = useState({ visible: false, title: "", message: null, buttonText: "확인" });
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0, first: true, last: true });
  const [replyState, setReplyState] = useState({});
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const activeGh = guesthouses.find((g) => (g.guesthouseId || g.id) === activeGuesthouseId);

  useEffect(() => {
    if (activeGuesthouseId) {
      setPage(0);
      tryFetchReviews(activeGuesthouseId, 0);
    }
  }, [activeGuesthouseId]);

  const tryFetchReviews = async (gId, pageParam = 0) => {
    setLoading(true);
    try {
      const response = await guesthouseApi.getGuesthouseReviews({ guesthouseId: gId, page: pageParam, size: 10 });
      const data = response.data;
      setReviews(data?.content || []);
      setPage(data?.number ?? pageParam);
      setPageInfo({ totalPages: data?.totalPages ?? 0, totalElements: data?.totalElements ?? 0, first: data?.first ?? true, last: data?.last ?? true });
    } catch (error) {
      if (error?.response?.status !== 404) {
        console.warn("리뷰 조회 실패:", error);
      }
      setReviews([]); // 에러나면 빈 배열 표출
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    if (newPage === page || !activeGuesthouseId) return;
    setPage(newPage);
    tryFetchReviews(activeGuesthouseId, newPage);
  };

  const toggleReply = (id) => {
    setReplyState((prev) => {
      const current = prev[id] || { open: false, text: "" };
      return { ...prev, [id]: { ...current, open: !current.open } };
    });
  };

  const updateReplyText = (id, text) => {
    setReplyState((prev) => {
      const current = prev[id] || { open: true, text: "" };
      return { ...prev, [id]: { ...current, text } };
    });
  };

  const sendReply = async (id, content) => {
    if (!content.trim()) return;
    try {
      await guesthouseApi.postReviewReply(id, content);
      setReviews((prev) => prev.map((review) => review.id === id ? { ...review, replies: [...(review.replies || []), content] } : review));
      setReplyState((prev) => ({ ...prev, [id]: { open: false, text: "" } }));
    } catch (error) {
      setErrorModal({ visible: true, title: "답글 전송 실패", message: "오류가 발생했습니다.", buttonText: "확인", onPress: () => setErrorModal((prev) => ({ ...prev, visible: false })) });
    }
  };

  if (!activeGuesthouseId || !activeGh) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] animate-in fade-in">
        <EmptyComponent title="업체가 선택되지 않았습니다" subtitle="좌측 메뉴 상단에서 업체를 선택해주세요." buttonText="홈으로" onPress={() => navigate("/guesthouse/home")} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full text-grayscale-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-grayscale-500 mb-6 font-semibold">
        <span>리뷰 현황</span> <ChevronRight className="w-4 h-4" /> <span className="text-primary-blue">{activeGh.guesthouseName}</span>
      </div>

      <div className="mb-8 border-b-2 border-primary-blue pb-4">
        <h1 className="text-2xl font-bold">작성된 리뷰 <span className="text-primary-blue">{pageInfo.totalElements}</span>개</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-grayscale-500 font-semibold text-lg animate-pulse">로딩 중...</div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-grayscale-100 shadow-sm py-32">
          {/* 캐릭터가 들어갈 곳의 여백 이미지 (귀여운 엠티 스테이트) */}
          <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl text-gray-300">📝</span>
          </div>
          <h2 className="text-xl font-bold text-grayscale-800">아직 작성된 리뷰가 없어요</h2>
          <p className="text-grayscale-500 mt-2">여행자의 첫 리뷰를 기다려봐요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const state = replyState[review.id] || { open: false, text: "" };
            return (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-grayscale-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <img src={review?.userImgUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-12 h-12 rounded-full object-cover bg-grayscale-100" />
                    <div>
                      <div className="font-bold text-lg">{review.nickname}</div>
                      <div className="flex items-center gap-1">
                        <img src={StarIcon} className="w-4 h-4 opacity-80" />
                        <span className="font-bold text-primary-orange">{review.reviewRating}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDeleteModal({ visible: true, id: review.id })} className="text-sm font-semibold text-grayscale-400 hover:text-red-500 transition-colors">삭제 요청</button>
                </div>

                {review?.imgUrls?.length > 0 && (
                  <div className="flex gap-2 p-2 overflow-x-auto mb-4 scrollbar-hide">
                    {review.imgUrls.map((url, idx) => (
                      <img key={idx} src={url} className="w-32 h-32 rounded-xl object-cover flex-shrink-0 border border-grayscale-200" />
                    ))}
                  </div>
                )}

                <div className="text-grayscale-800 leading-relaxed bg-grayscale-50 p-4 rounded-xl border border-grayscale-100">
                  {review.reviewDetail}
                </div>

                {review?.replies?.length > 0 && (
                  <div className="mt-4 pl-4 border-l-4 border-primary-blue/30 space-y-3">
                    <div className="text-sm font-bold text-primary-blue flex items-center gap-2">사장님 답글 ✍️</div>
                    {review.replies.map((reply, idx) => (
                      <div key={idx} className="bg-blue-50/50 p-4 rounded-xl text-grayscale-800 text-sm">{reply}</div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-grayscale-100">
                  <button onClick={() => toggleReply(review.id)} className="text-sm font-bold text-primary-blue hover:text-primary-blue/80 transition-colors">
                    {state.open ? "답글 취소하기" : "+ 새 답글 달기"}
                  </button>
                  {state.open && (
                    <div className="mt-3 flex gap-2">
                      <textarea className="flex-1 p-3 text-sm rounded-xl border border-grayscale-200 focus:border-primary-blue outline-none resize-none bg-grayscale-50 h-24" placeholder="감사한 마음을 담아 답글을 남겨주세요." value={state.text} onChange={(e) => updateReplyText(review.id, e.target.value)} />
                      <button onClick={() => sendReply(review.id, state.text)} className="w-12 rounded-xl bg-primary-blue text-white flex items-center justify-center active:scale-95 transition-transform">
                        <img src={SendIcon} className="w-5 h-5 invert" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {pageInfo.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button disabled={pageInfo.first} onClick={() => handleChangePage(page - 1)} className="px-4 py-2 font-semibold text-sm rounded-lg hover:bg-grayscale-100 disabled:opacity-30">이전</button>
              {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
                <button key={idx} onClick={() => handleChangePage(idx)} className={`w-10 h-10 rounded-lg font-bold text-sm ${idx === page ? "bg-primary-blue text-white" : "hover:bg-grayscale-100"}`}>{idx + 1}</button>
              ))}
              <button disabled={pageInfo.last} onClick={() => handleChangePage(page + 1)} className="px-4 py-2 font-semibold text-sm rounded-lg hover:bg-grayscale-100 disabled:opacity-30">다음</button>
            </div>
          )}
        </div>
      )}

      <ErrorModal visible={errorModal.visible} title={errorModal.title} message={errorModal.message} buttonText={errorModal.buttonText} onPress={() => setErrorModal((p) => ({ ...p, visible: false }))} />
      <ReviewDeleteModal id={deleteModal.id} visible={deleteModal.visible} onClose={() => setDeleteModal({ visible: false, id: null })} setErrorModal={setErrorModal} />
    </div>
  );
}
