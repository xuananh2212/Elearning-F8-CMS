"use client";
import { Card } from "antd";
import PayMentList from "./components/payment/PayMentList";

const page = () => {
  return (
    <Card>
      <h1 className="text-[#242424] text-[28px] font-black">
        Quản lý Thanh Toán
      </h1>
      <PayMentList />
    </Card>
  );
};

export default page;
