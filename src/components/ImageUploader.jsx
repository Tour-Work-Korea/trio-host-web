/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";

export default function ImageUploaderWeb({
  preview,
  error,
  uploading,
  progress,
  onInputChange,
  onRemove,
  label = "이미지 업로드",
  accept = "image/*",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className={[
          "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer",
          dragOver
            ? "border-primary-orange bg-orange-50/40"
            : "border-grayscale-300",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (!f) return;
          // 외부에서 제공한 onInputChange를 흉내
          const dt = new DataTransfer();
          dt.items.add(f);
          const fakeEvent = { target: { files: dt.files } };
          onInputChange(fakeEvent);
        }}
        role="button"
        tabIndex={0}
      >
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="preview"
              className="h-40 w-40 object-cover rounded-xl shadow-sm"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -right-2 -top-2 rounded-full bg-rose-500 text-white text-xs px-2 py-1 shadow"
            >
              제거
            </button>
          </div>
        ) : (
          <div className="text-sm text-grayscale-600">
            <div className="font-medium mb-1">{label}</div>
            <div>클릭 또는 드래그하여 선택</div>
            <div className="text-xs mt-1">
              허용: JPG/PNG/WebP/GIF • 최대 5MB
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
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

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
