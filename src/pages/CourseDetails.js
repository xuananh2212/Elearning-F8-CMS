"use client"
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { Button, Modal, Form, Input, Select, Table, Row, Col, Tag, Space, Popconfirm, Tooltip, notification, TreeSelect } from 'antd';
import { IoCaretForwardCircle } from "react-icons/io5";
import { Collapse } from 'antd';
import { IoMdAdd } from "react-icons/io";
import { covertItemCollapse } from '@/helper/covertItemCollapse';
import { FaTrashCan } from "react-icons/fa6";
export default function CourseDetails({ course }) {
     const router = useRouter();
     const handleGoBack = () => {
          router.back();
     };
     const onChange = (key) => {
          console.log(key);
     };
     console.log(covertItemCollapse(course.Topics));
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
                                   <Collapse
                                        style={{ width: '100%' }}
                                        items={covertItemCollapse(course.Topics)}
                                        // items={items}
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
                                   />

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
