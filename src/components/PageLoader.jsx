/* eslint-disable react/prop-types */
import React from "react";

export default function PageLoader({ message = "로딩중..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-white/60 z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-grayscale-600">{message}</p>
      </div>
    </div>
  );
}
