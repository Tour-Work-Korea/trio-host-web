import commonApi from "@api/commonApi";

const getPresignedUrl = async (filename) => {
  const response = await commonApi.getPresignedUrl(filename);
  return response.data;
};

export const generateUniqueFilename = (extension = "jpg") => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `image_${timestamp}_${random}.${extension}`;
};

const compressToJPEGWeb = async (file, options = {}) => {
  const { maxWidth = 1280, maxHeight = 1280, quality = 0.8 } = options;

  const img = new Image();
  img.decoding = "async";

  const objectUrl = URL.createObjectURL(file);

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = objectUrl;
  });

  const width = img.width;
  const height = img.height;

  let targetWidth = width;
  let targetHeight = height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    targetWidth = Math.round(width * ratio);
    targetHeight = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Canvas 2D context를 가져올 수 없습니다.");
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const q = Math.max(0.1, Math.min(1, quality));

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) {
          reject(new Error("JPEG 인코딩 실패"));
        } else {
          resolve(b);
        }
      },
      "image/jpeg",
      q
    );
  });

  URL.revokeObjectURL(objectUrl);
  return blob;
};

const uploadBlobToS3Web = (presignedUrl, blob, onProgress) => {
  const uploadedUrl = presignedUrl.split("?")[0];

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", "image/*");

    if (typeof onProgress === "function" && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(uploadedUrl);
      } else {
        reject(
          new Error(
            `Upload failed: ${xhr.status} ${xhr.statusText || ""}`.trim()
          )
        );
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error while uploading to S3"));
    xhr.send(blob);
  });
};

// 실제 코드 - CORS 오류 해결 후 사용 가능
export const uploadSingleImageToS3Web = async (file, onProgress) => {
  if (!file) return null;

  const jpegBlob = await compressToJPEGWeb(file, {
    maxWidth: 1280,
    maxHeight: 1280,
    quality: 0.8,
  });

  const filename = generateUniqueFilename("jpg");
  const presignedUrl = await getPresignedUrl(filename);

  const uploadedUrl = await uploadBlobToS3Web(
    presignedUrl,
    jpegBlob,
    onProgress
  );

  return uploadedUrl;
};
