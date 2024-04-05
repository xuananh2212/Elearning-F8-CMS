"use client"
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { Button, Modal, Form, Input, Select, Table, Row, Col, Tag, Space, Popconfirm, Tooltip, notification, TreeSelect, Dropdown, Panel } from 'antd';
import { IoCaretForwardCircle } from "react-icons/io5";
import { Collapse } from 'antd';
import { IoMdAdd } from "react-icons/io";
import { covertItemCollapse } from '@/helper/covertItemCollapse';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrashCan } from "react-icons/fa6";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
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
export default function CourseDetails({ course }) {
     const router = useRouter();
     const handleGoBack = () => {
          router.back();
     };
     const onChange = (key) => {
          console.log(key);
     };
     const handOnDragEnd = (result) => {
          console.log(result);
          // console.log(result);
          // const { destination, source, draggableId, type } = result;
          // if (!destination) {
          //      return;
          // }
          // dispatch(
          //      dragHanppened({
          //           droppableIdStart: source.droppableId,
          //           droppableIdEnd: destination.droppableId,
          //           droppableIndexStart: source.index,
          //           droppableIndexEnd: destination.index,
          //           draggableId: draggableId,
          //           type,
          //      })
          // )
          // if (source.droppableId !== destination.droppableId) {
          //      const columnFind = listColumn.find(column => column._id === destination.droppableId);
          //      const totalTasks = JSON.parse(JSON.stringify(listTasks));
          //      const taskFind = totalTasks.find(task => task._id === draggableId);
          //      taskFind.column = columnFind.column;
          //      taskFind.columnName = columnFind.columnName;
          //      const newTotalTask = totalTasks.map(({ column, columnName, content }) => ({ column, columnName, content }))
          //      dispatch(fetchPostTasks(localStorage.getItem("apiKey"), newTotalTask, "switchTask"));
          // }


     }
     return (
          <>
               <div className='p-3'>
                    <Row
                         gutter={[25, 25]}
                    >
                         <Col
                              className="min-h-[100vh] bg-cyan-500 shadow-lg shadow-cyan-500/50 p-5 bg-[#fd8623] rounded-lg text-[#fff]"
                              xl={8}
                              md={8}
                              xs={24}
                         >
                              <Row
                                   gutter={[16, 16]}
                                   align="middle"
                              >
                                   <Col xl={5}
                                        md={5}
                                        xs={5}>
                                        <button
                                             onClick={handleGoBack}
                                        >
                                             <MdOutlineArrowBack
                                                  className="text-[40px] hover:text-[#387adf]" />
                                        </button>
                                   </Col>
                                   <Col xl={14}
                                        md={14}
                                        xs={14}>
                                        <div>
                                             <h1 className='text-[18px] font-normal'>{course?.title}</h1>
                                        </div>
                                   </Col>
                                   <Col xl={5}
                                        md={5}
                                        xs={5}>
                                        <Button
                                             className=" w-[50px] h-[50px] flex items-center justify-center bg-[#1473e6] rounded-[50%]"
                                             type="primary"
                                        >
                                             <IoMdAdd className="text-[#fff] text-[20px]" />
                                        </Button>
                                   </Col>
                              </Row>
                              <Row className="mt-2">
                                   <DragDropContext
                                        onDragEnd={handOnDragEnd}
                                   >
                                        <Droppable
                                             droppableId="allTopic"
                                             direction="vertical"
                                             type='list'
                                        >
                                             {
                                                  (provided) => (
                                                       <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                       >

                                                            <Collapse
                                                                 // accordion
                                                                 style={{ width: '100%' }}
                                                                 onChange={onChange}
                                                                 expandIcon={({ isActive }) =>
                                                                      <IoCaretForwardCircle
                                                                           className={`${isActive ? "rotate-90" : "rotate-0"}`}
                                                                           style={{
                                                                                color: "#fff",
                                                                                fontSize: "25px",
                                                                                alignItems: "center",
                                                                           }}
                                                                      />
                                                                 }
                                                            // collapsible="icon"
                                                            // items={covertItemCollapse(course.Topics)}
                                                            >
                                                                 {course.Topics.length && course.Topics.map((topic, index) => {
                                                                      { console.log(topic.id) }
                                                                      return (
                                                                           <Collapse.Panel
                                                                                key={topic?.id}
                                                                                header={
                                                                                     <Draggable
                                                                                          //  key={topic?.id}
                                                                                          draggableId={topic?.id}
                                                                                          index={index}
                                                                                     >
                                                                                          {
                                                                                               (provided) => (
                                                                                                    <div
                                                                                                         ref={provided.innerRef}
                                                                                                         {...provided.draggableProps}
                                                                                                         {...provided.dragHandleProps}
                                                                                                    >
                                                                                                         <div
                                                                                                              // index={index}
                                                                                                              // id={topic?.id}
                                                                                                              // key={topic?.id}
                                                                                                              className="flex gap-3 text-[#2b2929]"
                                                                                                         >


                                                                                                              <span>
                                                                                                                   {

                                                                                                                        topic?.title
                                                                                                                   }
                                                                                                              </span>

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
                                                                                                                   // onConfirm={confirm}
                                                                                                                   // onCancel={cancel}
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

                                                                                                    </div>
                                                                                               )
                                                                                          }


                                                                                     </Draggable>
                                                                                }
                                                                           >
                                                                                <DragDropContext
                                                                                     onDragEnd={handOnDragEnd}
                                                                                >
                                                                                     <Droppable droppableId="listLesson">
                                                                                          {
                                                                                               (provided) => (
                                                                                                    <div
                                                                                                         ref={provided.innerRef}
                                                                                                         {...provided.droppableProps}
                                                                                                    >
                                                                                                         {topic.Lessons.length && topic.Lessons.map((lesson, index) => (
                                                                                                              <div key={lesson?.id}>
                                                                                                                   <Draggable
                                                                                                                        draggableId={lesson?.id}
                                                                                                                        index={index}
                                                                                                                   >
                                                                                                                        {
                                                                                                                             (provided) => (
                                                                                                                                  <div
                                                                                                                                       ref={provided.innerRef}
                                                                                                                                       {...provided.draggableProps}
                                                                                                                                       {...provided.dragHandleProps}
                                                                                                                                  >
                                                                                                                                       <div className="mt-2 p-5 border-solid rounded-md border-2 border-[#333]">  {lesson.title}</div>
                                                                                                                                  </div>
                                                                                                                             )
                                                                                                                        }
                                                                                                                   </Draggable>
                                                                                                              </div>
                                                                                                         ))}

                                                                                                    </div>
                                                                                               )
                                                                                          }

                                                                                     </Droppable>

                                                                                </DragDropContext>

                                                                           </Collapse.Panel>








                                                                      )
                                                                 })}

                                                            </Collapse>
                                                       </div>
                                                  )
                                             }
                                        </Droppable>
                                   </DragDropContext>

                              </Row>
                         </Col>
                         <Col
                              xl={16}
                              md={16}
                              xs={24}
                         >
                              <p >{course?.title}</p>
                         </Col>
                    </Row>

               </div>
          </>
     )
}
