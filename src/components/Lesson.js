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
          opacity: isDragging ? 0.5 : undefined,
          border: isDragging ? '1px solid #3498db' : undefined,
     };
     return (
          <div
               ref={setNodeRef}
               style={dndkitLessonStyle}
               key={lesson?.id}
               {...attributes}
               className='p-4 mt-2 border-1 border-solid rounded-xl border-[#c2bebe]'
          >
               <div
                    {...listeners}
                    className='flex gap-2 items-center'
               >
                    <Checkbox
                         isSelected={isSelected}
                         onValueChange={setIsSelected}
                    />
                    <p className='w-full'>
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
