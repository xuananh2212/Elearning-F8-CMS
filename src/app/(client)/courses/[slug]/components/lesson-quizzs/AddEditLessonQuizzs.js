import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Radio, Space } from "antd";

const AddEditLessonQuizzs = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Chuyển dữ liệu từ form sang format bạn cần
    const formatted = values.questions.map((q) => ({
      content: q.content,
      answers: q.answers.map((a, i) => ({
        content: a,
        isCorrect: i === q.correctAnswerIndex,
      })),
    }));
    onSubmit(formatted);
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{ questions: [] }}
      layout="vertical"
    >
      <Form.List name="questions" className="flex gap-3">
        {(fields, { add, remove }) => (
          <div className="flex flex-wrap gap-3 w-full">
            {fields.map(({ key, name, ...restField }, idx) => (
              <Card
                key={key}
                className="mb-4 w-[350px]" // Đảm bảo kích thước cố định để wrap được
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
          Tạo bộ đề
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddEditLessonQuizzs;
