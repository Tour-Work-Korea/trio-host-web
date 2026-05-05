export const publicFacilities = [
  { name: "공용 주방", id: 1 },
  { name: "세탁기/탈수기", id: 3 },
  { name: "공용 욕실", id: 4 },
  { name: "공용 화장실", id: 5 },
  { name: "엘리베이터", id: 6 },
  { name: "라운지", id: 7 },
  { name: "와이파이", id: 10 },
  { name: "에어컨", id: 13 },
  { name: "난방", id: 17 },
  { name: "파우더룸", id: 31 },
  { name: "고데기", id: 32 },
  { name: "드라이기", id: 15 },
  { name: "폼클렌징", id: 33 },
  { name: "옥상", id: 34 },
  { name: "발코니", id: 35 },
  { name: "마당", id: 36 },
  { name: "전용 주차장", id: 37 },
  { name: "공용 주차장", id: 8 },
  { name: "CCTV", id: 38 },
];

export const roomFacilities = [
  { name: "개별 샤워실", id: 9 },
  { name: "개인 콘센트", id: 11 },
  { name: "드라이기", id: 15 },
  { name: "책상", id: 19 },
  { name: "객실 잠금 장치", id: 40 },
  { name: "옷걸이", id: 41 },
];

export const services = [
  { name: "카드결제", id: 21 },
  { name: "애견 동반 가능", id: 22 },
  { name: "짐보관", id: 23 },
  { name: "무료 주차", id: 24 },
  { name: "조식운영", id: 26 },
  { name: "매일청소", id: 27 },
  { name: "금연", id: 29 },
  { name: "공항 셔틀", id: 30 },
  { name: "흡연 구역", id: 42 },
];

export const roomTypes = [
  "1인실",
  "2인실",
  "3인실",
  "4인실",
  "5인실",
  "6인실",
  "7인실",
  "8인실",
];

export const partyOptions = ["필참", "불참가능"];

export const genderOptions = ["혼숙", "여성전용", "남성전용"];

export const filterServices = [
  { name: "주차 가능", id: [8, 24] }, // 주차장 + 무료주차
  { name: "라운지", id: 7 }, // LOUNGE
  { name: "짐보관", id: 23 }, // BAGGAGE_STORAGE
  { name: "공항 셔틀", id: 30 }, // AIRPORT_SHUTTLE
  { name: "개별 샤워실", id: 9 }, // PRIVATE_SHOWER
  { name: "매일 청소", id: 27 }, // DAILY_CLEANING
  { name: "금연", id: 29 }, // NON_SMOKING
  { name: "자전거 대여", id: 28 }, // BICYCLE_RENTAL
  { name: "에어컨", id: 13 }, // AIR_CONDITIONER
];
