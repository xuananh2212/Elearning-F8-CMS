import Users from "@/pages/Users";
import { Card } from "antd";
export default function page() {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý người dùng
      </h1>
      <Users />
    </Card>
  );
}
