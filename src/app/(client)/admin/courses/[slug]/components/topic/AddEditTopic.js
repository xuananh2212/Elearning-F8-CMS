import TopicService from "@/services/Topics";
import { Button, Form, Input, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const AddEditTopic = (props) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateAddAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await TopicService.addTopic(data);
      return response?.data;
    },
    onSuccess: async () => {
      props?.onCancel?.();
      toast.success(`Thêm  thành công`);
      await queryClient.invalidateQueries({
        queryKey: ["COURSE"],
      });
    },
  });
  return (
    <Modal centered {...props} footer={[]}>
      <Form
        form={form}
        onFinish={async (data) => {
          console.log(1);
          try {
            await mutateAddAsync({
              ...data,
              courseId: props.course?.id,
            });
          } catch (e) {}
        }}
        className="mt-2 p-5 rounded-lg"
        layout="vertical"
        name="create-update-category"
        initialValues={{
          status: 0,
        }}
      >
        <Form.Item
          className="mb-1"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên chương học!" }]}
          label={<h3 className="text-[16px]">Tên Chương</h3>}
        >
          <Input />
        </Form.Item>
        <div className="ml-auto">
          <Button key="back">Huỷ</Button>,
          <Button type="primary" className="bg-[#1473e6]" htmlType="submit">
            Tạo
          </Button>
        </div>
        ,
      </Form>
    </Modal>
  );
};

export default AddEditTopic;
