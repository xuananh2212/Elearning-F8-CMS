import React from 'react'
import { Card, CardHeader, Tooltip, Button, CardBody, CardFooter, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { MdDelete } from "react-icons/md";
import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
export default function Lesson({ lesson, topicSort }) {
     const [isSelected, setIsSelected] = useState(false);
     const {
          attributes,
          listeners,
          setNodeRef,
          transform,
          transition,
          isDragging
     } = useSortable({ id: lesson.id, data: lesson });
     const dndkitLessonStyle = {
          transform: CSS.Translate.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : undefined
     };
     return (
          <div
               ref={setNodeRef}
               style={dndkitLessonStyle}
               key={lesson?.id}
               {...attributes}
          >
               <div
                    {...listeners}
                    className='flex gap-2 items-center justify-between p-4 mt-2 border-1 border-solid rounded-xl border-[#c2bebe]'>
                    <Checkbox
                         isSelected={isSelected}
                         onValueChange={setIsSelected}
                    />
                    <p>
                         {`${topicSort}. ${lesson.sort}. ${lesson.title}`}
                    </p>

                    <Tooltip
                         color="danger"
                         content="Xoá bài học"
                    >
                         <Button>
                              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                   <MdDelete className='text-[20px]' />
                              </span>
                         </Button>
                    </Tooltip>
               </div>
          </div>
     )
}
