import React from "react";
import { useParams } from "react-router-dom";

export default function RecruitFormPage() {
  const { guesthouse_id } = useParams();
  console.log(guesthouse_id);
  return <div>RecruitFormPage</div>;
}
