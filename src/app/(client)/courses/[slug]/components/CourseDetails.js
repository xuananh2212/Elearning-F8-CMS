"use client";
import BoardContent from "@/components/BoardContent";
import { topicSlices } from "@/store/slices/topicSlices";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineArrowBack } from "react-icons/md";
import { useDispatch } from "react-redux";
import AddEditTopic from "./topic/AddEditTopic";
const { setTopicDetail } = topicSlices.actions;
export default function CourseDetails({ course }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const dispatch = useDispatch();
  const handleGoBack = () => {
    router.back();
  };
  const handleSetTopicDetail = async () => {
    await dispatch(setTopicDetail(course?.Topics));
  };
  useEffect(() => {
    if (course) {
      handleSetTopicDetail();
    }
  }, []);

  return (
    <div className="p-3">
      <div className="flex">
        <div className="min-h-[100vh] bg-cyan-500 shadow-lg shadow-cyan-500/50 p-5 rounded-lg">
          <div className="flex items-center gap-3">
            <div>
              <Button color="primary" onClick={handleGoBack}>
                <MdOutlineArrowBack className="text-[40px]" />
              </Button>
            </div>
            <div className="flex-grow">
              <h1 className="text-[18px] font-normal">{course?.title}</h1>
            </div>
            <div>
              <Button
                className="p-0 h-[50px] w-[50px] flex items-center justify-center  rounded-lg"
                color="primary"
                onClick={showModal}
              >
                <IoMdAdd className="text-[#fff] text-[20px]" />
              </Button>
            </div>
          </div>
          <div className="mt-5">
            <BoardContent course={course} />
          </div>
        </div>
        <div>
          <p>{course?.title}</p>
        </div>
        <AddEditTopic open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />
      </div>
    </div>
  );
}
