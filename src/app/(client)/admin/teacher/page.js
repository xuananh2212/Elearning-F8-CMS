import { Card } from "antd";
import Teachers from "./components/TeacherPage";
export default function page() {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý giáo viên
      </h1>
      <Teachers />
    </Card>
  );
}
