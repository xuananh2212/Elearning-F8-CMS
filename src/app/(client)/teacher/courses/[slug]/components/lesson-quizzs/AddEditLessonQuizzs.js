import LessonService from "@/services/Lessons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Radio, Space } from "antd";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const AddEditLessonQuizzs = ({ currentAction }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isEditMode = !!currentAction?.lessonType?.LessonQuiz?.Questions?.length;

  const { mutateAsync: mutateAddLessonAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLesson(data);
      return response?.data;
    },
  });

  const { mutateAsync: mutateAddLessonQuizAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonQuiz(data);
      return response?.data;
    },
  });

  const { mutateAsync: mutateAddQuestionsBatchAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addQuestionsBatch(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Thêm bộ đề trắc nghiệm thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  const { mutateAsync: mutateUpdateQuestionsBatchAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.updateQuestionsBatch(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Cập nhật bộ đề trắc nghiệm thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const initialQuestions =
        currentAction.lessonType.LessonQuiz.Questions.map((q) => ({
          content: q.question,
          explain: q.explain,
          correctAnswerIndex: q.Answers.findIndex((a) => a.result),
          answers: q.Answers.map((a) => a.name),
        }));

      form.setFieldsValue({
        lessonTitle: currentAction.lessonType.title,
        questions: initialQuestions,
      });
    } else {
      form.setFieldsValue({
        lessonTitle: [],
        questions: [],
      });
    }
  }, [currentAction, isEditMode, form]);

  const handleFinish = async (values) => {
    try {
      if (isEditMode) {
        const lessonQuizId = currentAction.lessonType.LessonQuiz.id;

        const formattedQuestions = values.questions.map((q, index) => ({
          id: currentAction.lessonType.LessonQuiz.Questions[index]?.id,
          question: q.content,
          explain: q.explain || "",
          answers: q.answers.map((a, i) => ({
            id: currentAction.lessonType.LessonQuiz.Questions[index]?.Answers[i]
              ?.id,
            name: a,
            result: i === q.correctAnswerIndex,
          })),
        }));

        await mutateUpdateQuestionsBatchAsync({
          lessonQuizId,
          questions: formattedQuestions,
        });
      } else {
        const lessonData = await mutateAddLessonAsync({
          topicId: currentAction?.id,
          title: values.lessonTitle || "Bài học Quiz",
        });

        const lessonId = lessonData?.lesson?.id;

        const lessonQuizData = await mutateAddLessonQuizAsync({ lessonId });

        const lessonQuizId = lessonQuizData?.lessonQuiz?.id;

        const formattedQuestions = values.questions.map((q) => ({
          question: q.content,
          explain: q.explain || "",
          answers: q.answers.map((a, i) => ({
            name: a,
            result: i === q.correctAnswerIndex,
          })),
        }));

        await mutateAddQuestionsBatchAsync({
          lessonQuizId,
          questions: formattedQuestions,
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi xử lý bộ đề");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{ questions: [] }}
      layout="vertical"
    >
      <Form.Item
        name="lessonTitle"
        label="Tên bài học Quiz"
        rules={[{ required: true, message: "Nhập tên bài học" }]}
      >
        <Input placeholder="Nhập tên bài học..." />
      </Form.Item>

      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <div className="flex flex-wrap gap-3 w-full">
            {fields.map(({ key, name, ...restField }, idx) => (
              <Card
                key={key}
                className="mb-4 w-[350px]"
                title={`Câu hỏi ${idx + 1}`}
                extra={
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ color: "red" }}
                  />
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, "content"]}
                  label="Nội dung câu hỏi"
                  rules={[{ required: true, message: "Nhập nội dung câu hỏi" }]}
                >
                  <Input.TextArea placeholder="Nhập câu hỏi..." />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "explain"]}
                  label="Giải thích câu hỏi"
                >
                  <Input.TextArea placeholder="Nhập giải thích (nếu có)..." />
                </Form.Item>

                <Form.Item
                  name={[name, "correctAnswerIndex"]}
                  label="Chọn đáp án đúng"
                  rules={[{ required: true, message: "Chọn đáp án đúng" }]}
                >
                  <Radio.Group>
                    {["A", "B", "C", "D"].map((label, i) => (
                      <Radio key={label} value={i}>
                        {label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Đáp án">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {["A", "B", "C", "D"].map((label, i) => (
                      <Form.Item
                        key={label}
                        name={[name, "answers", i]}
                        rules={[
                          { required: true, message: `Nhập đáp án ${label}` },
                        ]}
                      >
                        <Input placeholder={`Đáp án ${label}`} />
                      </Form.Item>
                    ))}
                  </Space>
                </Form.Item>
              </Card>
            ))}
            <Form.Item className="w-[350px]">
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    content: "",
                    explain: "",
                    answers: ["", "", "", ""],
                    correctAnswerIndex: 0,
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Thêm câu hỏi
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEditMode ? "Cập nhật bộ đề" : "Tạo bộ đề"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddEditLessonQuizzs;
