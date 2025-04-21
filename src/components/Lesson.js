import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
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
  const [isSelected, setIsSelected] = useState(false);
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
        <Checkbox isSelected={isSelected} onValueChange={setIsSelected} />
        <p className="w-full">
          {`${topicSort}. ${lesson.sort}. ${lesson.title}`}
        </p>

        <Tooltip color="danger" content="Xoá bài học">
          <Button>
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <MdDelete className="text-[20px]" />
            </span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
