// src/services/webImageUpload.js
// - 비민감 단일:  uploadSingleImage()
// - 비민감 복수:  uploadMultiImage(limit)
// - 민감 단일:    uploadSensitiveImage({ adaptive? })
// 모두: 파일 선택 → (압축) → 업로드 → URL 반환
// ※ 클릭 같은 사용자 제스처 핸들러 안에서 호출하세요.

import commonApi from "@api/commonApi";

// ---------------- 공통 유틸 ----------------

const DEFAULT_ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const generateUniqueFilename = (ext = "jpg") => {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1e6);
  return `image_${ts}_${rand}.${ext}`;
};

const validateImage = (
  file,
  { maxSizeMB = 10, accept = DEFAULT_ACCEPT } = {}
) => {
  if (!file) return { ok: false, reason: "NO_FILE" };
  if (accept.length && !accept.includes(file.type)) {
    return {
      ok: false,
      reason: "INVALID_TYPE",
      message: `허용 타입: ${accept.join(", ")}`,
    };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      ok: false,
      reason: "TOO_LARGE",
      message: `${maxSizeMB}MB 이하 이미지만 업로드 가능`,
    };
  }
  return { ok: true };
};

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Canvas로 JPEG 압축 → Blob
async function compressToJPEGBlob(
  file,
  { maxWidth = 1280, maxHeight = 1280, quality = 0.8 } = {}
) {
  const dataURL = await readFileAsDataURL(file);
  const img = await loadImage(dataURL);

  let { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(
      (b) => resolve(b),
      "image/jpeg",
      Math.max(0.1, Math.min(1, quality))
    )
  );

  return blob; // image/jpeg
}

// 목표 용량까지 품질/해상도 조절
async function adaptiveCompressToJPEG(
  file,
  {
    targetBytes = 1.8 * 1024 * 1024,
    startMax = 1600,
    minMax = 800,
    startQuality = 0.8,
    minQuality = 0.55,
    stepQuality = 0.1,
  } = {}
) {
  let maxEdge = startMax;
  let quality = startQuality;

  while (true) {
    const blob = await compressToJPEGBlob(file, {
      maxWidth: maxEdge,
      maxHeight: maxEdge,
      quality,
    });
    if (blob.size <= targetBytes) return blob;

    if (quality > minQuality) {
      quality = Math.max(minQuality, +(quality - stepQuality).toFixed(2));
    } else if (maxEdge > minMax) {
      maxEdge = Math.max(minMax, maxEdge - 200);
      quality = Math.min(startQuality, quality + stepQuality);
    } else {
      return blob; // 더 줄일 수 없음
    }
  }
}

// 프로그램적 파일 선택
function pickFiles({ multiple = false, accept = "image/*" } = {}) {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    if (multiple) input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = () => {
      const files = Array.from(input.files || []);
      document.body.removeChild(input);
      resolve(files);
    };

    input.click();
  });
}

// ---------------- API 래퍼 (axios: commonApi만 사용) ----------------

async function getPresignedUrl(filename) {
  const { data } = await commonApi.getPresignedUrl(filename);
  return data; // presigned URL
}

async function putToPresigned(
  presignedUrl,
  blob,
  contentType = "image/*",
  onUploadProgress
) {
  // 절대 URL이면 axios baseURL 무시하고 해당 URL로 요청됨.
  await commonApi.request({
    method: "PUT",
    url: presignedUrl,
    data: blob,
    headers: { "Content-Type": contentType },
    withCredentials: false, // 외부(S3)로 쿠키 전송 방지
    onUploadProgress, // 필요시 진행률 사용 가능(선택)
    transformRequest: (d) => d, // Blob 그대로 전송
  });
  return presignedUrl.split("?")[0];
}

async function postSensitive(formData) {
  const { data } = await commonApi.postImage(formData); // { url }
  return data;
}

// ---------------- 공개 함수 ----------------

/** 비민감 단일 업로드 */
export async function uploadSingleImage() {
  const files = await pickFiles({ multiple: false, accept: "image/*" });
  if (!files.length) return null;

  const file = files[0];
  const v = validateImage(file, { maxSizeMB: 10 });
  if (!v.ok) {
    console.warn("[uploadSingleImage] invalid:", v);
    return null;
  }

  let blob;
  try {
    blob = await compressToJPEGBlob(file, {
      maxWidth: 1280,
      maxHeight: 1280,
      quality: 0.8,
    });
  } catch (e) {
    console.warn("[uploadSingleImage] compress failed → original used:", e);
    blob = file;
  }

  const filename = generateUniqueFilename("jpg");
  const presignedUrl = await getPresignedUrl(filename);
  const url = await putToPresigned(presignedUrl, blob, "image/*");
  return url;
}

/** 비민감 복수 업로드 (최대 limit장) */
export async function uploadMultiImage(limit = 10) {
  const files = await pickFiles({ multiple: true, accept: "image/*" });
  if (!files.length) return [];

  const targets = files.slice(0, Math.max(1, limit));
  const urls = [];

  for (const file of targets) {
    const v = validateImage(file, { maxSizeMB: 10 });
    if (!v.ok) {
      console.warn("[uploadMultiImage] skip invalid:", v);
      continue;
    }

    let blob;
    try {
      blob = await compressToJPEGBlob(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.8,
      });
    } catch (e) {
      console.warn("[uploadMultiImage] compress failed → original used:", e);
      blob = file;
    }

    const filename = generateUniqueFilename("jpg");
    const presignedUrl = await getPresignedUrl(filename);
    const url = await putToPresigned(presignedUrl, blob, "image/*");
    urls.push(url);
  }

  return urls;
}

/** 민감 단일 업로드 (사업자등록증 등) */
export async function uploadSensitiveImage({ adaptive = false } = {}) {
  const files = await pickFiles({ multiple: false, accept: "image/*" });
  if (!files.length) return null;

  const file = files[0];
  const v = validateImage(file, { maxSizeMB: 15 });
  if (!v.ok) {
    console.warn("[uploadSensitiveImage] invalid:", v);
    return null;
  }

  let payloadFile = file;

  if (adaptive) {
    try {
      const blob = await adaptiveCompressToJPEG(file, {
        targetBytes: 1.8 * 1024 * 1024,
        startMax: 1600,
        minMax: 800,
        startQuality: 0.8,
        minQuality: 0.55,
        stepQuality: 0.1,
      });
      payloadFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
    } catch (e) {
      console.warn(
        "[uploadSensitiveImage] adaptive compress failed → original used:",
        e
      );
    }
  }

  const fd = new FormData();
  fd.append("image", payloadFile, payloadFile.name);

  try {
    const { url } = await postSensitive(fd); // 서버가 저장 후 URL/ID 반환
    return url;
  } catch (err) {
    console.error("민감 이미지 업로드 실패:", err);
    return null;
  }
}
