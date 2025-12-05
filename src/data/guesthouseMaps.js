import {
  publicFacilities,
  roomFacilities,
  services,
} from "@data/guesthouseOptions";
import { guesthouseTags } from "@data/guesthouseTags";

// 편의시설 전체 옵션(flat)
const ALL_AMENITY_OPTIONS = [
  ...publicFacilities,
  ...roomFacilities,
  ...services,
];

// "주방/식당" -> 1, "카드결제" -> 21 이런 식 매핑
export const AMENITY_NAME_TO_ID = ALL_AMENITY_OPTIONS.reduce((acc, cur) => {
  acc[cur.name] = cur.id;
  return acc;
}, {});

// "파티" -> 1, "바다전망" -> 4 이런 식 매핑
export const HASHTAG_TEXT_TO_ID = guesthouseTags.reduce((acc, cur) => {
  acc[cur.hashtag] = cur.id;
  return acc;
}, {});
