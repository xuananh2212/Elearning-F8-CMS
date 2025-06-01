"use client";

import { useSelector } from "react-redux";
import TotalTeacher from "./components/TotalTeacher";

const DashBoardTeacher = () => {
  const user = useSelector((state) => state.user.userInfo);
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Thống Kê của giáo viên {user?.email || ""}
        <TotalTeacher />
      </h1>
    </div>
  );
};

export default DashBoardTeacher;
