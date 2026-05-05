import React, { useState } from "react";

import { X } from "lucide-react";

export default function RefundPolicyModal({ isOpen, onClose, onAdd }) {
  const [days, setDays] = useState("");
  const [percentage, setPercentage] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!days || !percentage) return;
    onAdd({ daysBefore: Number(days), refundPercentage: Number(percentage) });
    setDays("");
    setPercentage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl relative">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-8">환불기준 추가</h2>
          
          <div className="flex items-center justify-center gap-3 mb-8 text-lg font-bold text-gray-800">
            <span className="whitespace-nowrap">방문</span>
            <input
              type="number"
              min="0"
              className="w-20 border border-gray-200 rounded-xl px-2 py-3 text-center text-gray-900 focus:border-primary-blue focus:outline-none"
              value={days}
              onChange={(e) => {
                let val = e.target.value;
                if (val !== "" && Number(val) < 0) val = "0";
                setDays(val);
              }}
              onKeyDown={(e) => {
                if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <span className="whitespace-nowrap pr-4">일전</span>
            <span className="whitespace-nowrap">총금액의</span>
            <input
              type="number"
              min="0"
              max="100"
              className="w-20 border border-gray-200 rounded-xl px-2 py-3 text-center text-gray-900 focus:border-primary-blue focus:outline-none"
              value={percentage}
              onChange={(e) => {
                let val = e.target.value;
                if (val !== "" && Number(val) < 0) val = "0";
                if (val !== "" && Number(val) > 100) val = "100";
                setPercentage(val);
              }}
              onKeyDown={(e) => {
                if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <span className="whitespace-nowrap">% 환불</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-center text-gray-800 font-bold hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={`flex-1 rounded-2xl py-3.5 text-center font-bold transition-colors ${
              days && percentage
                ? "bg-primary-blue text-white hover:bg-blue-600 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAdd}
            disabled={!days || !percentage}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
