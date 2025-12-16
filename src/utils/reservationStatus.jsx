export const STATUS_LABELS = {
  PENDING: "예약 대기",
  CONFIRMED: "예약 확정",
  CANCELLED: "예약 취소",
  COMPLETED: "사용 완료",
};

export const STATUS_ORDER = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export const renderStatusBadge = ({ isFull = true, status }) => {
  const label = STATUS_LABELS[status] || status;
  let bg = "bg-gray-100 text-gray-700";

  if (status === "PENDING") bg = "bg-yellow-50 text-yellow-700";
  if (status === "CONFIRMED") bg = "bg-orange-50 text-primary-orange";
  if (status === "CANCELLED") bg = "bg-red-50 text-red-600";
  if (status === "COMPLETED") bg = "bg-blue-50 text-blue-700";

  return (
    <span className={`rounded-full px-1 py-1 text-sm font-semibold ${bg}`}>
      {isFull ? label : label[3]}
    </span>
  );
};
