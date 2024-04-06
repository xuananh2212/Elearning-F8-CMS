"use client"
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { IoMdAdd } from "react-icons/io";
import { Button } from "@nextui-org/react";
import {
     DndContext,
     useSensor,
     PointerSensor,
     useSensors,
     DragOverlay,
     defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import CustomAccordion from "@/components/CustomAccordion";
import Lesson from "@/components/Lesson";
import { topicSlices } from "@/store/slices/topicSlices";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { requestUpdateSortTopic } from "@/store/middlewares/topic.middeware";
const { setTopicDetail } = topicSlices.actions;
const ACTIVE_DRAG_TTEM_TYPE = {
     TOPIC: 'TYPE_TOPIC',
     LESSON: 'TYPE_LESSON'
}
export default function CourseDetails({ course }) {
     const router = useRouter();
     const dispatch = useDispatch();
     const topicDetail = useSelector((state) => state.topic.topicDetail);
     const [activeDragItemId, setActiveDragItemId] = useState(null);
     const [activeDragItemType, setActiveDragItemType] = useState(null);
     const [activeDragItemData, setActiveDragItemData] = useState(null);
     const pointerSensor = useSensor(PointerSensor,
          { activationConstraint: { distance: 10 } });
     const sensors = useSensors(pointerSensor);
     const handleGoBack = () => {
          router.back();
     };
     const handOnDragStart = async (result) => {
          console.log("handOnDragStart", result)
          setActiveDragItemId(result?.active?.id);
          setActiveDragItemType(result?.active?.data?.current?.topic_id ? ACTIVE_DRAG_TTEM_TYPE.LESSON : ACTIVE_DRAG_TTEM_TYPE.TOPIC);
          setActiveDragItemData(result?.active?.data?.current);


     }
     const handOnDragEnd = async (result) => {
          const { active, over } = result;
          console.log(' active', active);
          console.log(' over', over);
          if (!over) return;
          if (active?.id !== over?.id) {
               const oldIndex = topicDetail?.findIndex(({ id }) => id === active?.id);
               const newIndex = topicDetail?.findIndex(({ id }) => id === over?.id);
               let dndTopics = arrayMove(topicDetail, oldIndex, newIndex);
               console.log('oldIndex', oldIndex);
               console.log('newIndex', newIndex);
               console.log('dndTopics', dndTopics);
               dndTopics = dndTopics.map((dndTopic, index) => ({ ...dndTopic, sort: index + 1 }));
               await dispatch(setTopicDetail(dndTopics));
               await dispatch(
                    requestUpdateSortTopic
                         (
                              {
                                   topics:
                                        dndTopics
                              }
                         ));
          }
          setActiveDragItemId(null);
          setActiveDragItemType(null);
          setActiveDragItemData(null);

     }
     const handleSetTopicDetail = async () => {
          await dispatch(setTopicDetail(course?.Topics));
     }
     const dropAnimation = {
          sideEffects: defaultDropAnimationSideEffects({
               styles: {
                    active: {
                         opacity: '0.5',
                    },
               },
          }),
     };
     const handleFindSortTopic = (topicId) => {
          const topic = topicDetail?.find(({ id }) => id === topicId);
          if (topic) {
               return topic?.sort;
          }
          return null;
     }
     useEffect(() => {
          if (course) {
               handleSetTopicDetail();
          }
     }, []);
     return (
          <>
               <div className='p-3'>
                    <div
                         className="flex">
                         <div
                              className="min-h-[100vh] bg-cyan-500 shadow-lg shadow-cyan-500/50 p-5 rounded-lg"
                         >
                              <div
                                   className="flex items-center gap-3"

                              >
                                   <div>
                                        <Button
                                             color="primary"
                                             onClick={handleGoBack}
                                        >
                                             <MdOutlineArrowBack
                                                  className="text-[40px]" />
                                        </Button>
                                   </div>
                                   <div className="flex-grow">
                                        <h1 className='text-[18px] font-normal'>{course?.title}</h1>
                                   </div>
                                   <div>
                                        <Button
                                             className="p-0 h-[50px] w-[50px] flex items-center justify-center  rounded-lg"
                                             color="primary"
                                        >
                                             <IoMdAdd className="text-[#fff] text-[20px]" />
                                        </Button>
                                   </div>
                              </div>
                              <div className="mt-5">
                                   <DndContext
                                        id={course?.id}
                                        onDragEnd={handOnDragEnd}
                                        onDragStart={handOnDragStart}
                                        sensors={sensors}
                                   >
                                        <SortableContext
                                             items={topicDetail
                                                  ? topicDetail?.map(({ id }) => id)
                                                  : course.Topics?.map(({ id }) => id)
                                             }
                                             strategy={verticalListSortingStrategy}
                                        >
                                             <div>
                                                  {
                                                       topicDetail?.length && topicDetail?.map((topic) => (
                                                            <CustomAccordion
                                                                 key={topic.id}
                                                                 topic={topic}
                                                            />
                                                       ))
                                                  }
                                             </div>
                                        </SortableContext>
                                        <DragOverlay dropAnimation={dropAnimation}>
                                             {
                                                  activeDragItemId &&
                                                       activeDragItemType === ACTIVE_DRAG_TTEM_TYPE.TOPIC
                                                       ? <CustomAccordion topic={activeDragItemData} />
                                                       : <Lesson
                                                            lesson={activeDragItemData}
                                                            topicSort={handleFindSortTopic(activeDragItemData?.topic_id)}

                                                       />

                                             }
                                        </DragOverlay>
                                   </DndContext>


                              </div>
                         </div>
                         <div
                         >
                              <p >{course?.title}</p>
                         </div>
                    </div>

               </div>
          </>
     )
}

