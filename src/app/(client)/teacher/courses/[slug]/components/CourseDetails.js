"use client";
import BoardContent from "@/components/BoardContent";
import CourseService from "@/services/Course";
import { topicSlices } from "@/store/slices/topicSlices";
import { Button } from "@nextui-org/react";
import { Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineArrowBack } from "react-icons/md";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import RenderLessons from "./render-Lessons/RenderLessons";
import AddEditTopic from "./topic/AddEditTopic";
const { setTopicDetail } = topicSlices.actions;
const CourseDetails = ({ slug }) => {
  const [currentAction, setCurrentAction] = useState({});
  const router = useRouter();
  const { isFetching, data: course } = useQuery({
    queryKey: ["COURSE", slug],
    queryFn: async () => {
      const res = await CourseService.getCourseDetail(slug);
      await handleSetTopicDetail(res.data?.course);
      return res.data?.course;
    },
    refetchOnWindowFocus: false, // Disable tự động fetch lại khi focus
  });

  const dispatch = useDispatch();
  const handleSetTopicDetail = async (course) => {
    await dispatch(setTopicDetail(course?.Topics));
  };

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
  const handleGoBack = () => {
    router.back();
  };
  return isFetching ? (
    <Skeleton />
  ) : (
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
            <BoardContent course={course} setCurrentAction={setCurrentAction} />
          </div>
        </div>
        <div className="p-2 flex-1">
          {<RenderLessons currentAction={currentAction} />}
        </div>
        <AddEditTopic
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          course={course}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
