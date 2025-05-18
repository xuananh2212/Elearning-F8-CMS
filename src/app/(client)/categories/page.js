export const metadata = {
  title: "Danh Mục",
  description: "Danh Mục",
};
import Categories from "@/pages/Categories";
import { Card } from "antd";
export default function page() {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý danh mục
      </h1>
      <Categories />
    </Card>
  );
}
