import TextEdit from "@/components/TextEdit";
import LessonService from "@/services/Lessons";
import UploadService from "@/services/Upload";
import { Button, Form, Input } from "antd";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import UploadFile from "../upload-file/UploadFile";

const AddEditVideos = ({ currentAction, isHiddenVideos }) => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  const isEditMode =
    !!currentAction?.lessonType?.LessonVideo ||
    !!currentAction?.lessonType?.LessonDocument;
  const lessonId = currentAction?.lessonType?.id;

  const { mutateAsync: mutateAddLessonAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLesson(data);
      return response?.data;
    },
  });

  const { mutateAsync: mutateAddLessonVideoAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonVideo(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Thêm bài học video thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  const { mutateAsync: mutateUpdateLessonVideoAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.updateLessonVideo(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Cập nhật bài học video thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  const { mutateAsync: mutateAddLessonDocumentAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonDocument(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Thêm bài học tài liệu thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  const { mutateAsync: mutateUpdateLessonDocumentAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.updateLessonDocument(data);
      return response?.data;
    },
    onSuccess: async () => {
      toast.success(`Cập nhật bài học tài liệu thành công`);
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
  });

  const { mutateAsync: mutateUploadAsync } = useMutation({
    mutationFn: async (file) => {
      const response = await UploadService.uploadFileVideo(file);
      return response?.data;
    },
  });

  const onFinish = async (data) => {
    try {
      let finalLessonId = lessonId;

      if (!isEditMode) {
        const lessonData = await mutateAddLessonAsync({
          topicId: currentAction?.id,
          title: data?.title,
        });
        finalLessonId = lessonData?.lesson?.id;
      }

      const fileVideoFile = data?.fileVideoFile?.file;

      if (!isHiddenVideos) {
        if (fileVideoFile) {
          const file = new FormData();
          file.append("file", fileVideoFile);
          const uploadRes = await mutateUploadAsync(file);
          const payload = {
            url: uploadRes?.data,
            lessonId: finalLessonId,
          };

          if (isEditMode) {
            await mutateUpdateLessonVideoAsync(payload);
          } else {
            await mutateAddLessonVideoAsync(payload);
          }
        }
      } else {
        const content = editorRef.current?.getContent();
        const payload = {
          document: content,
          lessonId: finalLessonId,
        };

        if (isEditMode) {
          await mutateUpdateLessonDocumentAsync(payload);
        } else {
          await mutateAddLessonDocumentAsync(payload);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi xử lý bài học");
    }
  };

  useEffect(() => {
    console.log("1", currentAction);
    form.setFieldsValue({
      title: currentAction?.lessonType?.title,
      videoUrl: currentAction?.lessonType?.LessonVideo?.url || "",
    });

    if (currentAction?.lessonType?.LessonDocument) {
      editorRef.current?.setContent(
        currentAction.lessonType.LessonDocument.document
      );
    }
  }, [currentAction, form]);

  return (
    <div>
      <h1 className="mb-3 font-semibold">
        {isHiddenVideos ? "Dạng bài học tài liệu" : "Dạng bài học Video"}
      </h1>
      <Form
        className="mt-2 p-4 rounded-lg"
        layout="vertical"
        name="videos"
        form={form}
        onFinish={onFinish}
        initialValues={{
          title: currentAction?.lessonType?.title,
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
            rules={[
              {
                required: !isEditMode,
                message: "Vui lòng chọn video tải lên!",
              },
            ]}
            type={"add"}
            form={form}
            nameUrl="videoUrl"
            nameFile="fileVideoFile"
            label="Tải video"
            fileType="video"
          />
        )}
        {isHiddenVideos && (
          <Form.Item
            name="desc"
            className="p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl"
            label={<h3 className="text-[16px] font-medium">Nội dung:</h3>}
          >
            <TextEdit editorRef={editorRef} />
          </Form.Item>
        )}
        <div className="ml-auto">
          <Button type="primary" className="bg-[#1473e6]" htmlType="submit">
            {isEditMode ? "Cập nhật" : "Tạo"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEditVideos;
