/* eslint-disable react/prop-types */
import React from "react";

import CheckBlue from "@assets/images/check_blue.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import DisabledRadioButton from "@assets/images/radio_button_disabled.svg";
import EnabledRadioButton from "@assets/images/radio_button_enabled.svg";

export default function PostRegisterSection({
  open,
  onToggle,
  valid,
  applications,
  selectedApplication,
  onSelectApplication,
}) {
  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">입점신청서 선택</span>
        {valid ? (
          <img src={CheckBlue} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          {applications.length === 0 && (
            <p className="text-sm text-gray-400">
              등록 가능한 입점 신청서가 없습니다.
            </p>
          )}
          <div className="flex flex-col gap-3 max-h-[300px] overflow-scroll scrollbar-hide">
            {applications.map((app) => {
              const selected = selectedApplication?.id === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm ${
                    selected
                      ? "border-primary-orange bg-orange-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => onSelectApplication(app)}
                >
                  <img
                    src={selected ? EnabledRadioButton : DisabledRadioButton}
                    className="w-7 h-7"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {app.businessName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.address} {app.detailAddress}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {app.businessPhone}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
