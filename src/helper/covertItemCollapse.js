import { FaTrashCan } from "react-icons/fa6";
import { Button, message, Popconfirm, Dropdown, Space } from 'antd';
import { IoMdAdd } from "react-icons/io";
import { convertToRoman } from "./convertRoman";
import Drag from "@/components/Drag";
import { Droppable, Draggable } from "react-beautiful-dnd";
const items = [
     {
          label: <div onClick={(e) => { e.stopPropagation() }} >1st menu item</div>,
          key: '0',

     },
     {
          label: <a href="#">2nd menu item</a>,
          key: '1',
     },
     {
          type: 'divider',
     },
     {
          label: '3rd menu item',
          key: '3',
     },
];
// export const childrenCollapse = (lessons, topicSort) => (
//      lessons.map(({ title, sort }, index) => (
//           <div className="mt-1 p-4 flex items-center justify-between border border-solid border-[#7a797985] rounded cursor-pointer" key={index}>
//                {`${topicSort}.${sort}. ${title}`}
//                <Popconfirm
//                     title="Delete the task"
//                     description="Are you sure to delete this task?"
//                     onConfirm={confirm}
//                     onCancel={cancel}
//                     okText="Yes"
//                     cancelText="No"
//                >
//                     <FaTrashCan
//                          className="text-[red]"
//                          onClick={(event) => {
//                               event.stopPropagation();
//                          }}
//                     />
//                </Popconfirm>
//           </div>
//      ))
// );
const cancel = (e) => {
     e.stopPropagation();
     message.error('Click on No');
};

const genExtra = (id) => (
     <div className="flex items-center justify-between gap-3">
          <Dropdown
               menu={{ items }}
               trigger={['click']}
               onClick={(e) => e.stopPropagation()}
          >
               <Button
                    className="w-[30px] h-[30px] p-0 flex items-center justify-center bg-[#1473e6] rounded-md"
                    type="primary"
               >
                    <IoMdAdd className="text-[#fff] text-[10px]" />
               </Button>
          </Dropdown>

          <Popconfirm
               title="Delete the task"
               description="Are you sure to delete this task?"
               onConfirm={confirm}
               onCancel={cancel}
               okText="Yes"
               cancelText="No"
          >
               <div className="w-[30px] h-[30px] flex bg-[#fff] items-center justify-center rounded-md"
                    onClick={(event) => {
                         event.stopPropagation();
                    }}
               >
                    <FaTrashCan
                         className="text-[red]"

                    />
               </div>
          </Popconfirm>
     </div>

);

export const covertItemCollapse = (topics) => {
     return topics.map((topic, index) => ({
          key: topic?.id,
          label: (
               <Draggable draggableId={topic?.id} index={index}>
                    {
                         provided => (
                              <div
                                   ref={provided.innerRef}
                                   {...provided.draggableProps}
                                   {...provided.dragHandleProps}
                              >
                                   <Droppable droppableId={topic?.id}>
                                        {
                                             provided =>
                                             (
                                                  <div
                                                       ref={provided.innerRef}
                                                       {...provided.droppableProps}

                                                  >
                                                       {convertToRoman(topic?.sort)}. {topic?.title}

                                                       {provided.placeholder}

                                                  </div>
                                             )
                                        }
                                   </Droppable>
                              </div>
                         )
                    }
               </Draggable>


          ),
          children: topic.Lessons?.length > 0 ? <Drag topic={topic} lessons={topic.Lessons} topicSort={topic.sort} /> : undefined,
          extra: genExtra(topic?.id),
     }));
}
