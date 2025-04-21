import TextEdit from "@/components/TextEdit";
import LessonService from "@/services/Lessons";
import UploadService from "@/services/Upload";
import { Button, Form, Input } from "antd";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import UploadFile from "../upload-file/UploadFile";

const AddEditVideos = ({ currentAction, isHiddenVideos }) => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const queryClient = useQueryClient();
  const { mutateAsync: mutateAddAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLesson(data);
      return response?.data;
    },
    onSuccess: async () => {},
  });
  const { mutateAsync: mutateAddALessonDocumentAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonDocument(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Thêm bài học tài liệu thành công`);
      await queryClient.invalidateQueries({
        queryKey: ["COURSE"],
      });
    },
  });
  const { mutateAsync: mutateAddLessonVideoAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonVideo(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Thêm bài học video thành công`);
      await queryClient.invalidateQueries({
        queryKey: ["COURSE"],
      });
    },
  });
  const { isPending: isUploadPending, mutateAsync: mutateUploadAsync } =
    useMutation({
      mutationFn: async (file) => {
        const response = await UploadService.uploadFileVideo(file);
        return response?.data;
      },
    });
  const onFinish = async (data) => {
    try {
      const dataLesson = await mutateAddAsync({
        topicId: currentAction?.id,
        title: data?.title,
      });
      const fileVideoFile = data?.fileVideoFile?.file;
      if (fileVideoFile && !isHiddenVideos) {
        const file = new FormData();
        file.append("file", fileVideoFile);
        const response = await mutateUploadAsync(file);

        await mutateAddLessonVideoAsync({
          url: response?.data,
          lessonId: dataLesson?.lesson?.id,
        });
        return;
      }
      await mutateAddALessonDocumentAsync({
        document: editorRef.current?.getContent(),
        lessonId: dataLesson?.lesson?.id,
      });
      return;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Form
      className="mt-2 p-4 rounded-lg"
      layout="vertical"
      name="videos"
      form={form}
      onFinish={onFinish}
      initialValues={{
        title: currentAction?.title,
      }}
    >
      <Form.Item
        rules={[{ required: true, message: "Vui lòng nhập tên bài học!" }]}
        name="title"
        className="p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl"
        label={<h3 className="text-[16px] font-medium">Tên bài học:</h3>}
      >
        <Input />
      </Form.Item>
      {!isHiddenVideos && (
        <UploadFile
          rules={[{ required: true, message: "Vui lòng chọn video tải lên!" }]}
          type={"add"}
          form={form}
          nameUrl="videoUrl"
          nameFile="fileVideoFile"
          label="Tải video"
          fileType="video"
        />
      )}
      <Form.Item
        name="desc"
        className="p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl"
        label={<h3 className="text-[16px] font-medium">Nội dung:</h3>}
      >
        <TextEdit editorRef={editorRef} />
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
