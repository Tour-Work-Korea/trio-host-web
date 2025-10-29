/* eslint-disable react/prop-types */
import React from "react";
import EmptyIcon from "@assets/images/wa_blue_empty.svg";
import ButtonOrange from "@components/ButtonOrange";

/**
 * 등록한 공고, 채용 없을 경우 사용
 */
export default function EmptyComponent({
  title,
  subtitle,
  buttonText,
  onPress,
}) {
  return (
    <div className="flex-col flex h-full items-center justify-center bg-white w-full">
      <img src={EmptyIcon} className="w-48" />
      <div className="font-semibold text-lg mt-4">{title}</div>
      <div className="text-grayscale-500 mt-1">{subtitle}</div>
      <div className="mt-4">
        <ButtonOrange title={buttonText} onPress={onPress} />
      </div>
    </div>
  );
}
