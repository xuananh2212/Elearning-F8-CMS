"use client";

import { axiosInstance } from "@/configs/axios.config";
import { Card, Col, Row, Spin } from "antd";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/v1/chart-data");
      return res.data;
    },
  });

  if (isLoading) return <Spin size="large" />;

  const { users_by_month, courses_by_category } = data;

  const lineData = {
    labels: users_by_month.map((d) => d.month),
    datasets: [
      {
        label: "Người dùng mới theo tháng",
        data: users_by_month.map((d) => d.count),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: courses_by_category.map((d) => d.category),
    datasets: [
      {
        label: "Khóa học theo danh mục",
        data: courses_by_category.map((d) => d.count),
        backgroundColor: [
          "#1890ff",
          "#52c41a",
          "#faad14",
          "#eb2f96",
          "#13c2c2",
          "#722ed1",
        ],
      },
    ],
  };

  return (
    <Row gutter={[16, 32]} className="p-6">
      <Col xs={24} md={12}>
        <Card title="Người dùng mới theo tháng">
          <Line data={lineData} />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Phân bố khóa học theo danh mục">
          <Pie data={pieData} />
        </Card>
      </Col>
    </Row>
  );
}
