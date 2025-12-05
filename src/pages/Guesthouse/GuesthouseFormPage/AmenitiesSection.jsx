/* eslint-disable react/prop-types */
import React from "react";

import CheckOrange from "@assets/images/check_orange.svg";
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
          <img src={CheckOrange} width={24} height={24} alt="완료" />
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
    <div className="mb-3">
      <p className="form-body-label mb-1">{title}</p>
      <div className="flex flex-wrap rounded-xl bg-gray-50 p-2">
        {options?.map((opt) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleAmenity(opt.id)}
              className={`m-1 truncate rounded-lg px-4 py-2 text-md font-medium ${
                active
                  ? "bg-primary-orange text-white"
                  : "bg-white text-gray-500 border border-gray-200"
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
