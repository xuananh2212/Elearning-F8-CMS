"use client";

import UploadImage from "@/components/UploadImage";
import { axiosInstance } from "@/configs/axios.config";
import { requestGetCategories } from "@/store/middlewares/category.middewares";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

const { TextArea } = Input;

export default function QuestionSetsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [questionInputs, setQuestionInputs] = useState([
    {
      question: "",
      explain: "",
      correctAnswer: "A",
      answers: ["", "", "", ""],
    },
  ]);
  const [urlAvatar, setUrlAvatar] = useState("");
  const [validateCourse, setValidateCourse] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["questionSets"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/question-set/v1/question-sets-with-questions"
      );
      return res.data;
    },
  });
  const requestLoadCategories = async () => {
    try {
      const response = await dispatch(requestGetCategories());
      unwrapResult(response);
    } catch (e) {}
  };
  useEffect(() => {
    if (!categories.length) {
      requestLoadCategories();
    }
  }, []);

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/question-set/v1", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSets"]);
      form.resetFields();
      setQuestionInputs([
        {
          question: "",
          explain: "",
          correctAnswer: "A",
          answers: ["", "", "", ""],
        },
      ]);
      setUrlAvatar("");
      setModalOpen(false);
    },
  });

  const handleAddQuestionInput = () => {
    setQuestionInputs([
      ...questionInputs,
      {
        question: "",
        explain: "",
        correctAnswer: "A",
        answers: ["", "", "", ""],
      },
    ]);
  };

  const handleRemoveQuestionInput = (index) => {
    const newQuestions = [...questionInputs];
    newQuestions.splice(index, 1);
    setQuestionInputs(newQuestions);
  };

  const handleSubmit = (values) => {
    if (!urlAvatar) {
      setValidateCourse({ thumb: "Vui lòng tải lên ảnh bộ đề" });
      return;
    }

    const payload = {
      title: values.title,
      description: values.description,
      thumb: urlAvatar,
      duration: Number(values.duration),
      totalQuestions: Number(values.totalQuestions),
      categoryId: values.categoryId,
      questions: questionInputs.map((q) => ({
        question: q.question,
        explain: q.explain,
        correctAnswer: q.correctAnswer,
        answers: q.answers,
      })),
    };

    mutate(payload);
  };

  const columns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Mô tả", dataIndex: "description" },
    { title: "Thời lượng (phút)", dataIndex: "duration" },
    { title: "Tổng số câu hỏi", dataIndex: "total_questions" },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card
        title="Danh sách bộ đề"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Thêm bộ đề
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data || []}
          rowKey="id"
          loading={isLoading}
        />
      </Card>

      <Modal
        title="Thêm bộ đề"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={1200}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            {/* Left column: form info */}
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <TextArea />
              </Form.Item>
              <Form.Item name="duration" label="Thời lượng (phút)">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="totalQuestions" label="Tổng số câu hỏi">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="categoryId" label="Danh mục">
                <Select
                  options={categories.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  }))}
                />
              </Form.Item>
              <Form.Item name="thumb" label="Ảnh Bộ đề">
                <UploadImage
                  styleImage={1}
                  defaultImage={urlAvatar}
                  onChangeUrl={(value) => setUrlAvatar(value)}
                />
              </Form.Item>
              {validateCourse?.thumb && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateCourse?.thumb}</span>
                </Form.Item>
              )}
            </Col>

            {/* Right column: questions */}
            <Col span={12}>
              <div
                style={{ maxHeight: 500, overflowY: "auto", paddingRight: 8 }}
              >
                {questionInputs.map((q, index) => (
                  <Card
                    key={index}
                    title={`Câu hỏi ${index + 1}`}
                    extra={
                      <Button
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => handleRemoveQuestionInput(index)}
                      />
                    }
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      placeholder="Nội dung câu hỏi"
                      value={q.question}
                      onChange={(e) =>
                        setQuestionInputs((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, question: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <Input
                      placeholder="Giải thích"
                      value={q.explain}
                      onChange={(e) =>
                        setQuestionInputs((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, explain: e.target.value }
                              : item
                          )
                        )
                      }
                      style={{ marginTop: 8 }}
                    />
                    <Radio.Group
                      onChange={(e) =>
                        setQuestionInputs((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, correctAnswer: e.target.value }
                              : item
                          )
                        )
                      }
                      value={q.correctAnswer}
                      style={{ marginTop: 8 }}
                    >
                      {["A", "B", "C", "D"].map((opt) => (
                        <Radio key={opt} value={opt}>
                          {opt}
                        </Radio>
                      ))}
                    </Radio.Group>
                    {["A", "B", "C", "D"].map((opt, i) => (
                      <Input
                        key={opt}
                        placeholder={`Đáp án ${opt}`}
                        value={q.answers[i]}
                        onChange={(e) =>
                          setQuestionInputs((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? {
                                    ...item,
                                    answers: item.answers.map((ans, ai) =>
                                      ai === i ? e.target.value : ans
                                    ),
                                  }
                                : item
                            )
                          )
                        }
                        style={{ marginTop: 8 }}
                      />
                    ))}
                  </Card>
                ))}
              </div>
            </Col>
          </Row>

          <div className="flex justify-between mt-4">
            <Button icon={<PlusOutlined />} onClick={handleAddQuestionInput}>
              Thêm câu hỏi
            </Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Lưu bộ đề
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
