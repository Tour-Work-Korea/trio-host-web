import WaLogo from "@assets/images/wa_logo.svg";

export default function Footer() {
  return (
    <div className="sm:flex sm:justify-between sm:items-end bg-gray-100  py-8 w-full sm:px-[40px] px-4">
      <div>
        <img src={WaLogo} className="h-10 w-auto mb-4" />
        <div className="flex text-sm font-semibold">
          <p className="w-30 text-gray-400">office mail</p>
          <p>tourworkkorea.biz@gmail.com</p>
        </div>
        <div className="flex text-sm font-semibold">
          <p className="w-30 text-gray-400">office phone</p>
          <p>+82 10 6627 2653</p>
        </div>
        <div className="flex text-sm font-semibold">
          <p className="w-30 text-gray-400">instagram</p>
          <p>wa_korea_official</p>
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-400 pt-4">
        @copyright 2025 workaway
      </div>
    </div>
  );
}
