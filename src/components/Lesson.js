import LessonService from "@/services/Lessons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@nextui-org/react";
import { Popconfirm } from "antd";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
function getLessonType(lesson) {
  if (lesson.LessonDocument) {
    return "2";
  } else if (lesson.LessonVideo) {
    return "1";
  } else if (lesson.LessonQuiz) {
    return "3";
  } else {
    return "0"; // nếu không có loại nào
  }
}

export default function Lesson({ lesson, topicSort, setCurrentAction }) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteLessonMutation } = useMutation({
    mutationFn: async (lesson) => {
      // Xoá theo loại
      if (lesson.LessonVideo) {
        await LessonService.deleteLessonVideo(lesson.LessonVideo.id);
      } else if (lesson.LessonDocument) {
        await LessonService.deleteLessonDocument(lesson.LessonDocument.id);
      } else if (lesson.LessonQuiz) {
        await LessonService.deleteLessonQuiz(lesson.LessonQuiz.id);
      }
      // Sau đó xoá lesson
      await LessonService.deleteLesson(lesson.id);
    },
    onSuccess: async () => {
      setCurrentAction(null);
      toast.success("Xoá bài học thành công");
      await queryClient.invalidateQueries({ queryKey: ["COURSE"] });
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi khi xoá bài học");
    },
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id, data: lesson });
  const dndkitLessonStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #3498db" : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={dndkitLessonStyle}
      key={lesson?.id}
      {...attributes}
      className="p-4 mt-2 border-1 border-solid rounded-xl border-[#c2bebe]"
    >
      <div
        {...listeners}
        className="flex gap-2 items-center"
        onClick={() => {
          console.log("lesson", lesson);
          setCurrentAction((pre) => ({
            ...pre,
            key: getLessonType(lesson),
            lessonType: lesson,
          }));
        }}
      >
        <p className="w-full">
          {`${topicSort}. ${lesson.sort}. ${lesson.title}`}
        </p>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bài học này không?"
          description="Hành động này sẽ không thể hoàn tác."
          onConfirm={() => deleteLessonMutation(lesson)}
          okText="Có"
          cancelText="Không"
        >
          <Button>
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <MdDelete className="text-[20px]" />
            </span>
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}
