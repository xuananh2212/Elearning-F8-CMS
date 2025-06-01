import LoadingOverLay from "@/components/loading-overlay/LoadingOverlay";
import TextEdit from "@/components/TextEdit";
import LessonService from "@/services/Lessons";
import UploadService from "@/services/Upload";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import UploadFile from "../upload-file/UploadFile";
export const URL_IMAGE = "http://localhost:3000";
const AddEditVideos = ({ currentAction, setCurrentAction, isHiddenVideos }) => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // ✅ Thêm loading

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
  const { mutateAsync: mutateUpdateLessonAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.updateLesson(data);
      return response?.data;
    },
  });

  const { mutateAsync: mutateAddLessonVideoAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await LessonService.addLessonVideo(data);
      return response?.data;
    },
    onSuccess: async () => {
      setCurrentAction(null);
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
      setCurrentAction(null);
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
      setCurrentAction(null);
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
      setCurrentAction(null);
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
  const { mutateAsync: mutateUploadFileVideoAsync } = useMutation({
    mutationFn: async (file) => {
      const response = await UploadService.uploadFileVideoV2(file);
      return response?.data;
    },
  });

  const onFinish = async (data) => {
    try {
      setLoading(true);

      let finalLessonId = lessonId;
      if (!isEditMode) {
        const lessonData = await mutateAddLessonAsync({
          topicId: currentAction?.id,
          title: data?.title,
        });
        finalLessonId = lessonData?.lesson?.id;
      } else {
        const lessonData = await mutateUpdateLessonAsync({
          id: currentAction?.lessonType?.id,
          title: data?.title,
        });
        finalLessonId = lessonData?.lesson?.id;
      }
      const fileVideoFile = data?.fileVideoFile?.file;

      if (!isHiddenVideos) {
        const payload = {
          url: data?.videoUrl,
          lessonId: finalLessonId,
        };
        if (fileVideoFile) {
          const file = new FormData();
          file.append("file", fileVideoFile);
          const response = await mutateUploadFileVideoAsync(file);
          payload.url = `${URL_IMAGE}${response?.playlistUrl}`;
        }
        if (isEditMode) {
          await mutateUpdateLessonVideoAsync({
            ...payload,
            id: currentAction?.lessonType?.LessonVideo?.id,
          });
        } else {
          await mutateAddLessonVideoAsync(payload);
        }
      } else {
        const content = editorRef.current?.getContent();
        const payload = {
          document: content,
          lessonId: finalLessonId,
        };

        if (isEditMode) {
          await mutateUpdateLessonDocumentAsync({
            ...payload,
            id: currentAction?.lessonType?.LessonDocument?.id,
          });
        } else {
          await mutateAddLessonDocumentAsync(payload);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi xử lý bài học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      {loading && <LoadingOverLay />}
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
            className="h-[500px]"
            rules={[
              {
                required: !isEditMode,
                message: "Vui lòng chọn video tải lên!",
              },
            ]}
            form={form}
            type={isEditMode ? "edit" : "add"}
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
          <Button
            type="primary"
            className="bg-[#1473e6]"
            htmlType="submit"
            loading={loading} // ✅ Hiển thị trạng thái loading
          >
            {isEditMode ? "Cập nhật" : "Tạo"}
          </Button>
        </div>
        <FormItem name="videoUrl" />
      </Form>
    </div>
  );
};

export default AddEditVideos;
