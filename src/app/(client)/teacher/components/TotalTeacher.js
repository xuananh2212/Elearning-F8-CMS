import { axiosInstance } from "@/configs/axios.config";
import {
  AppstoreAddOutlined,
  BookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const TotalTeacher = () => {
  const user = useSelector((state) => state.user.userInfo);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview", user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get(
        `/dashboard/v1/dashboard-total/teacher/${user?.id}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <Spin size="large" />;
  }

  const { totalCourses, totalQuestionSets, totalQuestions } = data || {};

  const stats = [
    {
      title: "Tổng số khóa học của giáo viên",
      value: totalCourses,
      icon: <BookOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    },
    {
      title: "Tổng số bộ đề",
      value: totalQuestionSets,
      icon: (
        <QuestionCircleOutlined style={{ fontSize: 32, color: "#eb2f96" }} />
      ),
    },
    {
      title: "Tổng số câu hỏi trong các bộ đề của giáo viên",
      value: totalQuestions,
      icon: <AppstoreAddOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
    },
  ];
  const chartData = {
    labels: ["Khóa học", "Bộ đề", "Câu hỏi"],
    datasets: [
      {
        label: "Số lượng",
        data: [totalCourses, totalQuestionSets, totalQuestions],
        backgroundColor: ["#1890ff", "#52c41a", "#faad14"],
      },
    ],
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col key={item.title} xs={24} sm={12} md={8} lg={6}>
            <Card>
              <div className="flex items-center gap-4">
                {item.icon}
                <div>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-4">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default TotalTeacher;
