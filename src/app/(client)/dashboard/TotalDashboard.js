"use client";

import { axiosInstance } from "@/configs/axios.config";
import {
  AppstoreAddOutlined,
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import { useQuery } from "react-query";

const TotalDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/v1/dashboard-total");
      return res.data;
    },
  });

  if (isLoading) {
    return <Spin size="large" />;
  }

  const {
    total_users,
    total_courses,
    total_lessons,
    total_questions,
    total_question_sets,
    total_videos,
    total_documents,
  } = data || {};

  const stats = [
    {
      title: "Người dùng",
      value: total_users,
      icon: <UserOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
    },
    {
      title: "Khóa học",
      value: total_courses,
      icon: <BookOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    },
    {
      title: "Bài học",
      value: total_lessons,
      icon: <ReadOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
    },
    {
      title: "Câu hỏi",
      value: total_questions,
      icon: (
        <QuestionCircleOutlined style={{ fontSize: 32, color: "#eb2f96" }} />
      ),
    },
    {
      title: "Bộ câu hỏi",
      value: total_question_sets,
      icon: <AppstoreAddOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
    },
    {
      title: "Video",
      value: total_videos,
      icon: <VideoCameraOutlined style={{ fontSize: 32, color: "#13c2c2" }} />,
    },
    {
      title: "Tài liệu",
      value: total_documents,
      icon: <FileTextOutlined style={{ fontSize: 32, color: "#2f54eb" }} />,
    },
  ];

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
    </div>
  );
};

export default TotalDashboard;
