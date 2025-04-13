import { Button, Form, Input, Modal, Select } from "antd";

const AddEditTopic = (props) => {
  return (
    <Modal
      centered
      {...props}
      footer={[
        <Button key="back">Huỷ</Button>,
        <Button type="primary" className="bg-[#1473e6]" key="submit">
          Tạo
        </Button>,
      ]}
    >
      <Form
        className="mt-2 p-5 rounded-lg"
        layout="vertical"
        name="create-update-category"
        initialValues={{
          status: 0,
        }}
      >
        <Form.Item
          className="mb-1"
          name="name"
          label={<h3 className="text-[16px]">Tên Chương</h3>}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label={<h3 className="text-[16px]">Trạng thái:</h3>}
        >
          <Select
            options={[
              { value: 0, label: "Công khai" },
              { value: 1, label: "Riêng tư" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditTopic;
