export const metadata = {
  title: "Khoá Học",
  description: "...",
};
import CoursesTeacher from "@/pages/CoursesTeacher";
import { Card } from "antd";
export default function page() {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý khoá học
      </h1>
      <CoursesTeacher />
    </Card>
  );
}
