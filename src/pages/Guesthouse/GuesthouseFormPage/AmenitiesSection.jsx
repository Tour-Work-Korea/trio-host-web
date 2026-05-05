/* eslint-disable react/prop-types */
import React from "react";

import CheckBlue from "@assets/images/check_blue.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";

export default function AmenitiesSection({
  open,
  onToggle,
  valid,
  selectedAmenityIds,
  toggleAmenity,
  publicFacilities,
  roomFacilities,
  services,
}) {
  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">편의시설 및 서비스</span>
        {valid ? (
          <img src={CheckBlue} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          <p className="text-sm text-primary-orange mb-3">
            제공하는 편의시설과 서비스를 모두 선택해 주세요
          </p>

          <AmenityGroup
            title="숙소 공용시설"
            options={publicFacilities}
            selectedIds={selectedAmenityIds}
            toggleAmenity={toggleAmenity}
          />
          <AmenityGroup
            title="객실 내 시설"
            options={roomFacilities}
            selectedIds={selectedAmenityIds}
            toggleAmenity={toggleAmenity}
          />
          <AmenityGroup
            title="기타시설 및 서비스"
            options={services}
            selectedIds={selectedAmenityIds}
            toggleAmenity={toggleAmenity}
          />
        </div>
      )}
    </div>
  );
}

function AmenityGroup({ title, options, selectedIds, toggleAmenity }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="rounded-2xl bg-[#F7F7F7] py-8 px-4 grid grid-cols-3 gap-y-8">
        {options?.map((opt) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleAmenity(opt.id)}
              className={`text-center text-[15px] transition-colors ${
                active
                  ? "text-primary-blue font-bold"
                  : "text-[#A3A3A3] font-medium hover:text-gray-600"
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
