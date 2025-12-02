// src/pages/Review/dummyReviews.js

// 한 페이지 분량 더미 리뷰들 (size = 10 기준 예시)
export const DUMMY_REVIEW_PAGES = [
  {
    content: [
      {
        id: 1,
        nickname: "테스트 유저1",
        reviewDetail: "객실이 깔끔하고, 사장님이 정말 친절하셨어요!",
        reviewRating: 5.0,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User1",
        imgUrls: [
          "https://via.placeholder.com/300x200.png?text=Room1",
          "https://via.placeholder.com/300x200.png?text=View1",
        ],
        replies: ["감사합니다!", "정말 좋아요"],
      },
      {
        id: 2,
        nickname: "주말여행러",
        reviewDetail: "위치가 좋아서 주변 관광지 다니기 편했어요.",
        reviewRating: 4.5,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User2",
        imgUrls: [],
        replies: [],
      },
      {
        id: 3,
        nickname: "알바생A",
        reviewDetail:
          "단기 알바로 일했는데 근무 강도 적당하고 스태프분들 분위기가 좋았어요.",
        reviewRating: 4.0,
        isJobReview: true,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User3",
        imgUrls: [],
        replies: [],
      },
      {
        id: 4,
        nickname: "1인여행자",
        reviewDetail:
          "도미토리였는데 침대마다 커튼이 있어서 프라이버시가 잘 지켜졌어요.",
        reviewRating: 4.8,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 5,
        nickname: "히치하이커",
        reviewDetail:
          "공용 라운지에서 다른 여행자들이랑 이야기 나누는 게 제일 재밌었어요.",
        reviewRating: 4.2,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User5",
        imgUrls: ["https://via.placeholder.com/300x200.png?text=Lounge"],
        replies: [],
      },
      {
        id: 6,
        nickname: "직원B",
        reviewDetail:
          "시즌 알바로 한 달 근무했는데, 숙소가 제공돼서 생활비 아끼기 좋았어요.",
        reviewRating: 4.3,
        isJobReview: true,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 7,
        nickname: "커플여행",
        reviewDetail:
          "사진보다 실제가 더 예뻐요. 특히 루프탑 뷰가 정말 좋았습니다.",
        reviewRating: 4.9,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User7",
        imgUrls: [
          "https://via.placeholder.com/300x200.png?text=Rooftop",
          "https://via.placeholder.com/300x200.png?text=NightView",
        ],
        replies: [],
      },
      {
        id: 8,
        nickname: "디지털노마드",
        reviewDetail:
          "와이파이 속도 빠르고, 공용 테이블에서 작업하기 좋아서 재방문 의사 있어요.",
        reviewRating: 4.7,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User8",
        imgUrls: [],
        replies: [],
      },
      {
        id: 9,
        nickname: "장기거주자",
        reviewDetail:
          "한 달 지냈는데, 청소 주기랑 세탁 서비스가 잘 되어 있어서 편안했어요.",
        reviewRating: 4.6,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 10,
        nickname: "스태프C",
        reviewDetail:
          "피크 시즌에는 조금 바쁘지만, 사장님이 스케줄 조정 잘 해주셔서 무리 없이 일했어요.",
        reviewRating: 4.1,
        isJobReview: true,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User10",
        imgUrls: [],
        replies: [],
      },
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        sorted: true,
        empty: false,
        unsorted: false,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: false,
    totalElements: 23,
    totalPages: 3,
    size: 10,
    number: 0,
    sort: {
      sorted: true,
      empty: false,
      unsorted: false,
    },
    first: true,
    numberOfElements: 10,
    empty: false,
  },

  // 두 번째 페이지 (pageNumber: 1)
  {
    content: [
      {
        id: 11,
        nickname: "백패커",
        reviewDetail: "체크인 안내가 친절해서 처음 온 곳인데도 편했어요.",
        reviewRating: 4.0,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 12,
        nickname: "워킹홀리데이",
        reviewDetail:
          "스태프들이 외국인 손님도 많아서 영어 쓸 기회가 많았어요.",
        reviewRating: 4.4,
        isJobReview: true,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User12",
        imgUrls: [],
        replies: [],
      },
      {
        id: 13,
        nickname: "새벽러",
        reviewDetail:
          "공용 주방이 24시간이라 늦게 들어와도 요리할 수 있어서 좋았어요.",
        reviewRating: 4.3,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 14,
        nickname: "캠퍼스커플",
        reviewDetail:
          "공용 샤워실이 생각보다 넓고 깨끗했어요. 수건도 매일 제공됩니다.",
        reviewRating: 4.5,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User14",
        imgUrls: [],
        replies: [],
      },
      {
        id: 15,
        nickname: "스태프D",
        reviewDetail:
          "동료 스태프들이랑 함께 지내는 게 즐거웠고, 쉬는 날에는 같이 여행도 다녔어요.",
        reviewRating: 4.7,
        isJobReview: true,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 16,
        nickname: "주중여행자",
        reviewDetail: "주중이라 조용해서 휴식하기 좋았습니다. 조식도 깔끔해요.",
        reviewRating: 4.2,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User16",
        imgUrls: [],
        replies: [],
      },
      {
        id: 17,
        nickname: "혼자왔어요",
        reviewDetail:
          "스태프분이 주변 맛집 지도도 직접 그려주셔서 도움 많이 받았어요.",
        reviewRating: 4.8,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 18,
        nickname: "파티러버",
        reviewDetail:
          "주말에 파티 열어줘서 다른 여행자들이랑 친해지기 좋았어요.",
        reviewRating: 4.9,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User18",
        imgUrls: [],
        replies: [],
      },
      {
        id: 19,
        nickname: "스태프E",
        reviewDetail:
          "업무 난이도는 적당한데, 성수기에는 체력 필요합니다. 그래도 보람 있어요.",
        reviewRating: 3.9,
        isJobReview: true,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 20,
        nickname: "짧은호캉스",
        reviewDetail:
          "게스트하우스지만 호텔 느낌도 나서 만족했어요. 침구가 포근합니다.",
        reviewRating: 4.6,
        isJobReview: false,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User20",
        imgUrls: [],
        replies: [],
      },
    ],
    pageable: {
      pageNumber: 1,
      pageSize: 10,
      sort: {
        sorted: true,
        empty: false,
        unsorted: false,
      },
      offset: 10,
      paged: true,
      unpaged: false,
    },
    last: false,
    totalElements: 23,
    totalPages: 3,
    size: 10,
    number: 1,
    sort: {
      sorted: true,
      empty: false,
      unsorted: false,
    },
    first: false,
    numberOfElements: 10,
    empty: false,
  },

  // 세 번째 페이지 (pageNumber: 2)
  {
    content: [
      {
        id: 21,
        nickname: "마지막리뷰",
        reviewDetail:
          "체크아웃할 때까지 친절하게 응대해 주셔서 기분 좋게 떠났어요.",
        reviewRating: 4.8,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
      {
        id: 22,
        nickname: "알바마지막날",
        reviewDetail:
          "마지막 날에 작게 송별 파티도 열어주셔서 잊지 못할 경험이었어요.",
        reviewRating: 4.9,
        isJobReview: true,
        userImgUrl: "https://via.placeholder.com/80x80.png?text=User22",
        imgUrls: [],
        replies: [],
      },
      {
        id: 23,
        nickname: "늦게온손님",
        reviewDetail: "늦게 도착했는데도 친절하게 맞이해 주셔서 감사했습니다.",
        reviewRating: 4.3,
        isJobReview: false,
        userImgUrl: "사진을 추가해주세요",
        imgUrls: [],
        replies: [],
      },
    ],
    pageable: {
      pageNumber: 2,
      pageSize: 10,
      sort: {
        sorted: true,
        empty: false,
        unsorted: false,
      },
      offset: 20,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalElements: 23,
    totalPages: 3,
    size: 10,
    number: 2,
    sort: {
      sorted: true,
      empty: false,
      unsorted: false,
    },
    first: false,
    numberOfElements: 3,
    empty: false,
  },
];

// 간단하게 페이지/사이즈로 뽑아 쓰고 싶으면 이런 helper도 추가 가능
export const getDummyReviews = (page = 0) => {
  return DUMMY_REVIEW_PAGES[page] ?? DUMMY_REVIEW_PAGES[0];
};
