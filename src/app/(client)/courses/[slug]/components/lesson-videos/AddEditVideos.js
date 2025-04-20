import TextEdit from "@/components/TextEdit";
import { Button, Form, Input } from "antd";
import { useRef } from "react";
import UploadFile from "../upload-file/UploadFile";

const AddEditVideos = ({ currentAction }) => {
  console.log("currentAction", currentAction);
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  return (
    <Form
      className="mt-2 p-4 rounded-lg"
      layout="vertical"
      name="videos"
      form={form}
      initialValues={{}}
    >
      <UploadFile
        type={"add"}
        form={form}
        nameUrl="videoUrl"
        nameFile="fileVideoFile"
        label="Tải video"
        fileType="video"
      />
      <Form.Item
        name="desc"
        className="p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl"
        label={<h3 className="text-[16px] font-medium">Nội dung:</h3>}
      >
        <TextEdit editorRef={editorRef} />
        <Input />
      </Form.Item>
      <div className="ml-auto">
        <Button type="primary" className="bg-[#1473e6]" htmlType="submit">
          Tạo
        </Button>
      </div>
    </Form>
  );
};

export default AddEditVideos;
