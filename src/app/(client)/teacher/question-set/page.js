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
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const { TextArea } = Input;

export default function QuestionSetsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const categories = useSelector((state) => state.category.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
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
    queryKey: ["questionSets", user],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/question-set/v1/question-sets-with-questions/teacher/${user?.id}`
      );
      return res.data;
    },
    enabled: !!user?.id,
  });
  const { data: teachers, isFetching } = useQuery({
    queryKey: "teachers",
    queryFn: async () => {
      const res = await axiosInstance.get("/teachers/v1");
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
      toast.success("Thêm bộ đề thành công");
    },
  });
  const { mutateAsync } = useMutation({
    mutationFn: async (id) => {
      return await axiosInstance.delete(`/question-set/v1/${id}`);
    },
    onSuccess: () => {
      toast.success("Xóa bộ đề thành công");
      queryClient.invalidateQueries(["questionSets"]);
      resetForm();
    },
  });
  const { mutate: updateMutate } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/question-set/v1/edit", data); // gọi API update
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSets"]);
      toast.success("Cập nhật bộ đề thành công");
      resetForm();
      setModalOpen(false);
    },
  });
  const resetForm = () => {
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
    setEditId(null);
  };

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
      ...(editId ? { id: editId } : {}),
      title: values.title,
      description: values.description,
      thumb: urlAvatar,
      duration: Number(values.duration),
      totalQuestions: Number(values.totalQuestions),
      categoryId: values.categoryId,
      teacherId: user?.id,
      questions: questionInputs.map((q) => ({
        ...(q.id ? { id: q.id } : {}),
        question: q.question,
        explain: q.explain,
        correctAnswer: q.correctAnswer,
        answers: q.answers,
      })),
    };

    if (editId) {
      updateMutate({
        id: editId,
        ...payload,
      });
    } else {
      mutate(payload);
    }
  };
  const handleEditQuestionSet = (record) => {
    setEditId(record.id); // 👈 set ID vào state

    form.setFieldsValue({
      title: record.title,
      description: record.description,
      duration: record.duration,
      totalQuestions: record.total_questions,
      categoryId: record.category_id,
      teacherId: record.teacher_id,
    });

    setUrlAvatar(record.thumb);

    const questions =
      record.Questions?.map((q) => {
        const correctIndex = q.Answers?.findIndex((a) => a.result) ?? 0;

        return {
          id: q.id, // 👈 cần truyền id câu hỏi để phân biệt edit/add
          question: q.question,
          explain: q.explain,
          correctAnswer: ["A", "B", "C", "D"][correctIndex] || "A",
          answers: q.Answers?.map((a) => a.name) ?? ["", "", "", ""],
        };
      }) ?? [];

    setQuestionInputs(questions);
    setModalOpen(true);
  };

  const columns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Mô tả", dataIndex: "description" },
    { title: "Thể loại", dataIndex: "category_name" },
    { title: "Giáo viên", dataIndex: "teacher_name" },
    { title: "Thời lượng (phút)", dataIndex: "duration" },
    { title: "Tổng số câu hỏi", dataIndex: "total_questions" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh Sửa">
            <Button onClick={() => handleEditQuestionSet(record)}>
              <MdEdit className="text-[20px]" />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc bạn muốn xóa bộ đề này không?"
            description="Hành động này sẽ không thể hoàn tác."
            onConfirm={async () => {
              try {
                await mutateAsync(record?.id);
              } catch (e) {}
            }}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip placement="top" title="Xóa">
              <Button type="primary" danger>
                <MdDelete className="text-[20px]" />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  console.log("1");
  return (
    <div className="p-4 max-w-8xl mx-auto">
      <Card
        title="Danh sách bộ đề"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalOpen(true);
              resetForm();
            }}
          >
            Thêm bộ đề
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={
            data?.map((item) => ({
              ...item,
              category_name: item?.Category?.name,
              teacher_name: item?.User?.name,
            })) || []
          }
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
