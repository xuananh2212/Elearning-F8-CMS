import { convertToRoman } from "@/helper/convertRoman";
import TopicService from "@/services/Topics";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Popconfirm } from "antd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoCaretForward } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Lesson from "./Lesson";
export default function CustomAccordion({ topic, setCurrentAction }) {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (id) => {
      return await TopicService.deleteTopic(id);
    },
    onSuccess: () => {
      toast.success("Xóa Chương học thành công");
      setCurrentAction(null);
      queryClient.invalidateQueries({
        queryKey: ["COURSE"],
      });
    },
  });
  const [isSelected, setIsSelected] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id, data: topic });
  const dndkitTopicStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    // khi kéo opacity sẽ bị mờ 0.5
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #3498db" : undefined,
  };
  const handleClickAccordion = () => {
    setIsOpenAccordion(!isOpenAccordion);
  };
  const handleCreateLesson = async (type) => {
    try {
      setCurrentAction({
        key: type,
        id: topic.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={dndkitTopicStyle}
      key={topic?.id}
      {...attributes}
      {...listeners}
      className={`mt-2 flex items-center ${
        isOpenAccordion && "gap-2"
      } justify-center p-6 flex-col border-1 rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border-solid border-[#fff] transition-all ${
        isSelected && "border-primary"
      }`}
    >
      <div
        onClick={handleClickAccordion}
        className={`flex w-[100%] flex-shrink-0 gap-4 items-center`}
      >
        <div>
          <IoCaretForward
            className={`text-[20x] transition duration-200  ease-out ${
              isOpenAccordion ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>
        <p className="w-full">
          {`${convertToRoman(topic?.sort)}. ${topic?.title}`}
        </p>

        <div className="flex items-center justify-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button className="max-w-10" color="primary" variant="bordered">
                <IoMdAdd className="text-[20px]" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(key) => handleCreateLesson(key)}
            >
              <DropdownItem key="1">Tạo bài học Dạng Video</DropdownItem>
              <DropdownItem key="2">Tạo bài học dạng tài liệu</DropdownItem>
              <DropdownItem key="3">Tạo bài học dạng trắc nghiệm</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chương học này không?"
            description="Hành động này sẽ không thể hoàn tác."
            onConfirm={async () => {
              try {
                await mutateAsync(topic?.id);
              } catch (e) {}
            }}
            onCancel={() => console.log("cancel")}
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
      <div
        className={`transition duration-300 w-[80%] ease-in-out text-slate-600 text-sm ${
          isOpenAccordion ? "block" : "hidden"
        }`}
      >
        <SortableContext
          items={topic.Lessons?.map(({ id }) => id)}
          strategy={verticalListSortingStrategy}
        >
          {topic.Lessons.map((lesson, index) => (
            <Lesson
              setCurrentAction={setCurrentAction}
              topicSort={topic.sort}
              key={lesson.id}
              index={index}
              lesson={lesson}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
