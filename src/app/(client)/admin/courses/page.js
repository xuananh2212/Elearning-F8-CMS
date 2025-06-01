export const metadata = {
  title: "Khoá Học",
  description: "...",
};
import Courses from "@/pages/Courses";
import { Card } from "antd";
export default function page() {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý khoá học
      </h1>
      <Courses isTeacher />
    </Card>
  );
}
