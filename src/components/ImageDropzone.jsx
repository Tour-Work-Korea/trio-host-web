/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { uploadSingleImageToS3Web } from "@utils/s3ImageWeb";

export default function ImageDropzone({
  label = "이미지 업로드",
  accept = "image/*",
  disabled = false,
  maxCount = Infinity, // 최대 업로드 개수
  currentCount = 0, // 이미 업로드된 개수 (부모에서 내려줌)
  onUploaded, // (urls: string[]) => void  업로드 완료 후 호출
  onError, // (message: string) => void  에러 시 부모에 알림(선택)
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleClick = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;

    const remaining = maxCount - currentCount;
    if (remaining <= 0) {
      const msg = `최대 ${maxCount}장까지 등록 가능합니다.`;
      setError(msg);
      onError && onError(msg);
      return;
    }

    const targetFiles = list.slice(0, remaining);
    const uploadedUrls = [];

    try {
      setUploading(true);
      setProgress(0);
      setError("");

      const total = targetFiles.length;

      for (let i = 0; i < total; i += 1) {
        const file = targetFiles[i];

        const url = await uploadSingleImageToS3Web(file, (p) => {
          // 여러 장 기준 전체 진행률 계산
          const overall = Math.round(((i + p / 100) / total) * 100);
          setProgress(overall);
        });

        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length) {
        onUploaded && onUploaded(uploadedUrls);
      }

      // 더 많이 선택했다가 잘린 경우
      if (list.length > remaining) {
        const msg = `최대 ${maxCount}장까지라서, 앞에서 ${remaining}장만 업로드되었습니다.`;
        setError(msg);
        onError && onError(msg);
      }
    } catch (e) {
      console.error(e);
      const msg = "이미지 업로드 중 오류가 발생했습니다.";
      setError(msg);
      onError && onError(msg);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 300);
    }
  };

  const handleInputChange = (e) => {
    if (disabled || uploading) return;
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled || uploading) return;
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <div
        className={[
          "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer",
          dragOver
            ? "border-primary-orange bg-orange-50/40"
            : "border-grayscale-300",
          disabled || uploading ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled || uploading) return;
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
      >
        <div className="text-sm text-grayscale-600">
          <div className="font-medium mb-1">{label}</div>
          <div>
            클릭 또는 드래그하여 선택
            <span className="ml-1 text-xs text-gray-400">
              (여러 장 선택 가능)
            </span>
          </div>
          <div className="text-xs mt-1">
            허용: JPG/PNG/WebP/GIF • 최대 5MB (권장)
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled || uploading}
          multiple
        />
      </div>

      {uploading && (
        <div className="w-full h-2 bg-grayscale-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-primary-orange transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
