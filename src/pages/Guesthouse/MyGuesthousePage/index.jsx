/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";
import EmptyIcon from "@assets/images/wa_blue_empty.svg";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";
import EditIcon from "@assets/images/edit_gray.svg";
import DeleteIcon from "@assets/images/delete_gray.svg";

export default function MyGuesthousePage() {
  const [guesthouses, setGuesthouses] = useState([]); // 실제 연동 시 []로 시작해도 ok
  const [applications, setApplications] = useState([]); // 입점신청서
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
  const [selectModal, setSelectModal] = useState({ visible: false }); // 게스트하우스 선택 모달

  const navigate = useNavigate();

  useEffect(() => {
    tryFetchGuesthouses();
    tryFetchApplications();
  }, []);

  const getGuesthouseId = (gh) => gh.guesthouseId ?? gh.id;

  const getGuesthouseThumb = (item) =>
    item.thumbnailImg ??
    item.thumbnailUrl ??
    item.rooms?.[0]?.thumbnailImg ??
    "";

  const getRoomId = (room) => room.roomId ?? room.id;

  const getRoomThumb = (room) => room.thumbnailImg ?? room.roomImageUrl ?? "";

  // 게스트하우스 목록 조회
  const tryFetchGuesthouses = async () => {
    try {
      const res = await guesthouseApi.getMyGuesthousesWithRooms();
      setGuesthouses(res.data || []);
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

  // 입점신청서 목록 조회
  const tryFetchApplications = async () => {
    try {
      const res = await guesthouseApi.getMyApplications();
      const filtered = (res.data || [])
        .filter((app) => app.status === "승인 완료" && app.registered === false)
        .map((a) => ({
          id: a.id,
          title: a.businessName,
          subtitle: a.address,
        }));

      setApplications(filtered);
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
    }
  };

  // 게스트하우스 삭제 API 호출
  const tryDeleteGuesthouse = async (id) => {
    try {
      await guesthouseApi.deleteGuesthouse(id);

      // 프론트 상태에서도 제거
      setGuesthouses((prev) => prev.filter((gh) => getGuesthouseId(gh) !== id));

      setErrorModal({
        visible: true,
        title: "성공적으로 게스트하우스를 삭제했습니다",
        message: null,
        buttonText: "확인",
        buttonText2: null,
        onPress: () =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
        onPress2: null,
        imgUrl: EmptyIcon,
      });

      // 필요하면 다시 조회
      tryFetchGuesthouses();
    } catch (error) {
      console.warn(
        "게스트하우스 삭제 요청 실패",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "삭제 요청 실패",
        message:
          error?.response?.data?.message || "삭제 요청 중 오류가 발생했습니다.",
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

  // 게스트하우스 삭제 확인 모달
  const handleDeleteGuesthouse = (id) => {
    setErrorModal({
      visible: true,
      title: `삭제 요청은 되돌릴 수 없는 작업이에요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "삭제할게요",
      buttonText2: "보류할게요",
      onPress: () => {
        tryDeleteGuesthouse(id);
      },
      onPress2: () =>
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        })),
      imgUrl: null,
    });
  };

  // 객실 삭제
  const handleDeleteRoom = async (guesthouseId, roomId) => {
    try {
      await guesthouseApi.deleteRoom(guesthouseId, roomId);
      //다시 조회하지 않고, 프로트만 변경
      setGuesthouses((prev) =>
        prev.map((gh) =>
          getGuesthouseId(gh) === guesthouseId
            ? {
                ...gh,
                rooms: (gh.rooms || []).filter((r) => getRoomId(r) !== roomId),
              }
            : gh
        )
      );
    } catch (error) {
      console.warn("객실 삭제 실패:", error?.response?.data?.message || error);
      setErrorModal({
        visible: true,
        title: "객실 삭제 실패",
        message:
          error?.response?.data?.message || "객실 삭제 중 오류가 발생했습니다.",
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
    // 더미 데이터 용
    // setGuesthouses((prev) =>
    //   prev.map((gh) =>
    //     getGuesthouseId(gh) === guesthouseId
    //       ? {
    //           ...gh,
    //           rooms: (gh.rooms || []).filter((r) => getRoomId(r) !== roomId),
    //         }
    //       : gh
    //   )
    // );
  };

  // 게스트하우스 수정
  const handleEditGuesthouse = (guesthouseId) => {
    navigate(`/guesthouse/form/${guesthouseId}`);
  };

  // 게스트하우스 등록 핸들러
  const handleCreateGuesthouse = () => {
    if (applications.length > 0) {
      // 입점신청서 고르지 않고 바로 폼으로 이동
      // setSelectModal({ visible: true });
      navigate(`/guesthouse/form/`);
    } else {
      setErrorModal({
        visible: true,
        title: "가능한 입점신청서가 없습니다",
        message: "입점신청서를 등록하러 가볼까요?",
        buttonText: "입점신청서 등록하기",
        buttonText2: "다음에 할게요",
        onPress: () => {
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          }));
          navigate("/guesthouse/store-register-form");
        },
        onPress2: () =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
        imgUrl: EmptyIcon,
      });
    }
  };

  const getRoomTypeLabel = (roomType) => {
    if (roomType === "FEMALE_ONLY") return "여자";
    if (roomType === "MALE_ONLY") return "남자";
    return "혼성";
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <div className="page-title">나의 게스트하우스</div>
        <div>
          <ButtonOrange
            title="새 게스트하우스 등록"
            onPress={handleCreateGuesthouse}
          />
        </div>
      </div>

      <div className="body-container scrollbar-hide">
        {guesthouses.length === 0 && (
          <div className="h-[500px]">
            <EmptyComponent
              title="등록한 게스트하우스가 없어요"
              subtitle="게스트하우스를 등록하러 갈까요?"
              buttonText="게스트하우스 등록하러 가기"
              onPress={handleCreateGuesthouse}
            />
          </div>
        )}

        {/* 게스트하우스가 존재하는 경우 */}
        {guesthouses.length > 0 && (
          <div className="flex flex-col gap-3">
            {guesthouses.map((item) => {
              const ghId = getGuesthouseId(item);
              const ghThumb = getGuesthouseThumb(item);

              return (
                <div
                  key={ghId}
                  className="flex flex-col rounded-lg border border-grayscale-200 p-4 duration-300 hover:shadow-md"
                >
                  <div className="flex gap-6">
                    <div className="flex w-64 min-w-64 flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-grayscale-900">
                          {item.guesthouseName}
                        </h1>
                        <div className="flex gap-2 items-center">
                          {/* 수정 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleEditGuesthouse(ghId)}
                          >
                            <img src={EditIcon} />
                          </button>
                          {/* 삭제 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGuesthouse(ghId)}
                          >
                            <img src={DeleteIcon} />
                          </button>
                        </div>
                      </div>
                      <img
                        src={ghThumb}
                        alt={item.guesthouseName}
                        className="h-64 w-64 rounded-lg bg-grayscale-100 object-cover"
                      />
                    </div>

                    {/* 오른쪽: 객실 정보 */}
                    <div className="flex flex-1 min-w-0 flex-col gap-3">
                      {/* 상단 제목 영역 */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-grayscale-800">
                          등록된 객실
                        </h3>
                      </div>

                      {/* 객실 영역: 두 줄 그리드 + 가로 스크롤 */}
                      <div className="w-full overflow-x-auto scrollbar-hide h-full">
                        <div className="grid grid-flow-col auto-cols-max grid-rows-2 gap-3 h-full">
                          {item.rooms?.map((room) => {
                            const roomId = getRoomId(room);
                            const roomThumb = getRoomThumb(room);

                            return (
                              <div
                                key={roomId}
                                className="flex w-80 flex-shrink-0 gap-3 rounded-lg border border-grayscale-200 bg-white p-2"
                              >
                                <img
                                  src={roomThumb}
                                  alt={room.roomName}
                                  className="h-full w-24 rounded-lg bg-grayscale-100 object-cover"
                                />
                                <div className="flex flex-1 flex-col justify-between">
                                  <div>
                                    <span className="text-md font-medium text-grayscale-900">
                                      {room.roomName}
                                    </span>
                                    <div className="text-sm text-grayscale-600">
                                      {room.roomMaxCapacity ??
                                        room.roomCapacity}
                                      인실 {getRoomTypeLabel(room.roomType)}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteRoom(ghId, roomId)
                                    }
                                    className="self-end"
                                  >
                                    <img src={DeleteIcon} width={20} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {(!item.rooms || item.rooms.length === 0) && (
                            <div className="text-sm text-grayscale-400">
                              등록된 객실이 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* 입점신청서 선택 모달(게하 등록 시) */}
      <SelectModal
        visible={selectModal.visible}
        title={"입점신청서를 선택해 주세요"}
        items={applications}
        onClose={() => setSelectModal({ visible: false })}
        onPress={(storeRegisterId) => {
          setSelectModal({ visible: false });
          navigate(`/guesthouse/form`);
        }}
      />
    </div>
  );
}
