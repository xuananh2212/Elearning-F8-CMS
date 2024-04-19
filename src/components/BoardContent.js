import React from 'react'
import {
     DndContext,
     useSensor,
     PointerSensor,
     useSensors,
     DragOverlay,
     defaultDropAnimationSideEffects,
     closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import CustomAccordion from './CustomAccordion';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { topicSlices } from "@/store/slices/topicSlices";
import { cloneDeep } from "lodash";
import { requestUpdateSortTopic } from "@/store/middlewares/topic.middlewares";
import { requestUpdateSortLesson, requestUpdateSortLessonDifferentTopic } from "@/store/middlewares/lesson.middlewares";
import { unwrapResult } from "@reduxjs/toolkit";
import Lesson from './Lesson';
const ACTIVE_DRAG_TTEM_TYPE = {
     TOPIC: 'TYPE_TOPIC',
     LESSON: 'TYPE_LESSON'
}
const { setTopicDetail } = topicSlices.actions;
export default function BoardContent({ course }) {
     const dispatch = useDispatch();
     const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
     const sensors = useSensors(pointerSensor);
     const topicDetail = useSelector((state) => state.topic.topicDetail);
     const [activeDragItemId, setActiveDragItemId] = useState(null);
     const [activeDragItemType, setActiveDragItemType] = useState(null);
     const [activeDragItemData, setActiveDragItemData] = useState(null);
     const [oldTopicWhenDraggingLesson, setOldTopicWhenDraggingLesson] = useState(null);

     const handleMoveLessonBetweenDifferentTopics = (
          overTopic,
          overLessonId,
          active,
          over,
          activeTopic,
          activeDraggingLessonId,
          activeDraggingLessonData


     ) => {
          const overLessonIndex = overTopic?.Lessons?.findIndex((lesson) => lesson.id === overLessonId);
          console.log('overLessonIndex:', overLessonIndex);
          let newLessonIndex;
          const isBelowOverItem = active.rect.current.translated &&
               active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newLessonIndex = overLessonIndex >= 0 ? overLessonIndex + modifier : overTopic?.Lessons?.length + 1;
          console.log('isBelowOverItem:', isBelowOverItem);
          console.log('modifier:', modifier);
          console.log('newLessonIndex:', newLessonIndex)
          // clone mảng mới
          const nextTopics = cloneDeep(topicDetail);
          const nextActiveTopic = nextTopics.find(topic => topic.id === activeTopic.id);
          const nextOverTopic = nextTopics.find(topic => topic.id === overTopic.id);
          if (nextActiveTopic) {
               nextActiveTopic.Lessons = nextActiveTopic.Lessons.filter((lesson) => lesson.id !== activeDraggingLessonId);
               nextActiveTopic.Lessons = nextActiveTopic.Lessons.map((lesson, index) => ({ ...lesson, sort: index + 1 }));
               console.log('nextActiveTopic:', nextActiveTopic);
          }
          if (nextOverTopic) {
               // kiểm tra xem card đang kéo nó tồn tại chưa , nếu tồn tại thì xoá nó trước;
               nextOverTopic.Lessons = nextOverTopic.Lessons.filter((lesson) => lesson.id !== activeDraggingLessonId);
               //  thêm cái lesson đang kéo vào overColumn theo vị trí đang index mới;
               nextOverTopic.Lessons = nextOverTopic.Lessons.toSpliced(newLessonIndex, 0, {
                    ...activeDraggingLessonData,
                    topic_id: nextOverTopic.id
               });
               nextOverTopic.Lessons = nextOverTopic.Lessons.map((lesson, index) => ({ ...lesson, sort: index + 1 }));
               console.log('nextOverTopic:', nextOverTopic);
          }
          return { nextTopics, newLessonIndex, nextOverTopicId: nextOverTopic.id };
     }
     const handleFindSortTopic = (topicId) => {
          const topic = topicDetail?.find(({ id }) => id === topicId);
          if (topic) {
               return topic?.sort;
          }
          return null;
     }
     const findTopicByLessonId = (lessonId) => {
          return topicDetail.find((topic) => topic?.Lessons?.map(lesson => lesson.id).includes(lessonId));
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
     const handOnDragStart = async (result) => {
          console.log("handOnDragStart", result)
          setActiveDragItemId(result?.active?.id);
          setActiveDragItemType(result?.active?.data?.current?.topic_id ? ACTIVE_DRAG_TTEM_TYPE.LESSON : ACTIVE_DRAG_TTEM_TYPE.TOPIC);
          setActiveDragItemData(result?.active?.data?.current);
          // khi kéo lesson
          if (result?.active?.data?.current?.topic_id) {
               setOldTopicWhenDraggingLesson(findTopicByLessonId(result?.active?.id));
          }
     }
     // Tringger trong quá trình kéo (drag) một pt
     const handOnDragOver = (result) => {
          if (activeDragItemType === ACTIVE_DRAG_TTEM_TYPE.TOPIC) return;
          const { active, over } = result;
          if (!over || !active) return;
          const { id: activeDraggingLessonId, data: { current: activeDraggingLessonData } } = active;
          const { id: overLessonId } = over;
          // tìm topic
          const activeTopic = findTopicByLessonId(activeDraggingLessonId);
          const overTopic = findTopicByLessonId(overLessonId);
          if (!activeTopic || !overTopic) return;

          if (activeTopic?.id !== overTopic?.id) {
               const { nextTopics } = handleMoveLessonBetweenDifferentTopics(
                    overTopic,
                    overLessonId,
                    active,
                    over,
                    activeTopic,
                    activeDraggingLessonId,
                    activeDraggingLessonData)
               dispatch(setTopicDetail(nextTopics));
          }
          // console.log('activeTopic:', activeTopic);
          // console.log('overTopic:', overTopic);
          // console.log('handOnDragOver:', result);
     }
     const handOnDragEnd = async (result) => {
          const { active, over } = result;
          if (!over || !active) return;
          // nếu kéo trả bài học thì return;
          // xử lý kéo thả bài học
          if (activeDragItemType === ACTIVE_DRAG_TTEM_TYPE.LESSON) {
               const { id: activeDraggingLessonId, data: { current: activeDraggingLessonData } } = active;
               const { id: overLessonId } = over;
               // tìm topic
               const activeTopic = findTopicByLessonId(activeDraggingLessonId);
               const overTopic = findTopicByLessonId(overLessonId);
               if (!activeTopic || !overTopic) return;
               if (oldTopicWhenDraggingLesson?.id !== overTopic?.id) {
                    try {
                         const { nextTopics, newLessonIndex, nextOverTopicId } =
                              handleMoveLessonBetweenDifferentTopics
                                   (
                                        overTopic,
                                        overLessonId,
                                        active,
                                        over,
                                        activeTopic,
                                        activeDraggingLessonId,
                                        activeDraggingLessonData
                                   )
                         dispatch(setTopicDetail(nextTopics));
                         const response = await dispatch(requestUpdateSortLessonDifferentTopic(
                              {
                                   lessonId: activeDraggingLessonId,
                                   topicId: nextOverTopicId,
                                   index: newLessonIndex
                              }))
                         unwrapResult(response);
                    } catch (e) {

                    }


                    console.log('hành động kéo thả lesson giữa 2 topic khác nhau');
               } else {
                    try {
                         const oldLessonIndex = oldTopicWhenDraggingLesson?.Lessons?.findIndex(({ id }) => id === activeDragItemId);
                         const newLessonIndex = oldTopicWhenDraggingLesson?.Lessons?.findIndex(({ id }) => id === overLessonId);
                         console.log('oldLessonIndex:', oldLessonIndex);
                         console.log('newLessonIndex:', newLessonIndex);
                         console.log("activeDraggingLessonId:", activeDraggingLessonId);
                         console.log("overLessonId:", overLessonId);

                         const nextTopics = cloneDeep(topicDetail);
                         let dndLessons = arrayMove(oldTopicWhenDraggingLesson?.Lessons, oldLessonIndex, newLessonIndex);
                         dndLessons = dndLessons.map((dndLesson, index) => ({ ...dndLesson, sort: index + 1 }));
                         console.log('dndLessons:', dndLessons);
                         const topic = nextTopics.find(({ id }) => id === oldTopicWhenDraggingLesson?.id);
                         topic.Lessons = dndLessons;
                         await dispatch(setTopicDetail(nextTopics));
                         console.log('hành động kéo thả lesson giữa 2 topic giống nhau');
                         const response = await dispatch(requestUpdateSortLesson({ lessons: dndLessons }));
                         unwrapResult(response);

                    } catch (e) {
                         console.log(e.message);
                    }
               }

          }
          // xử lý kéo thả chương học
          if (activeDragItemType === ACTIVE_DRAG_TTEM_TYPE.TOPIC) {
               if (active?.id !== over?.id) {
                    const oldTopicIndex = topicDetail?.findIndex(({ id }) => id === active?.id);
                    const newTopicIndex = topicDetail?.findIndex(({ id }) => id === over?.id);
                    let dndTopics = arrayMove(topicDetail, oldTopicIndex, newTopicIndex);
                    console.log('oldTopicIndex', oldTopicIndex);
                    console.log('newTopicIndex', newTopicIndex);
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

          }
          setActiveDragItemId(null);
          setActiveDragItemType(null);
          setActiveDragItemData(null);
          setOldTopicWhenDraggingLesson(null);
     }
     return (
          <DndContext
               id={course?.id}
               //  collisionDetection={closestCorners}
               onDragStart={handOnDragStart}
               onDragOver={handOnDragOver}
               onDragEnd={handOnDragEnd}
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

     )
}
