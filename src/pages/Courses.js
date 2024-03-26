"use client"
import { IoMdAdd } from "react-icons/io";
import { Button, Modal, Form, Input, Select, Table, Row, Col, Tag, Space, Popconfirm, Tooltip, notification, TreeSelect } from 'antd';
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useForm } from "antd/es/form/Form";
import { useSelector, useDispatch } from "react-redux";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { MdDelete, MdEdit } from "react-icons/md";
import { InputNumber } from 'antd';
import {
     requestGetCategories
} from "@/store/middlewares/category.middewares";
import { requestGetAllCourse, requestAddCourse, requestUpdateCourse, requestDeleteCourse } from "@/store/middlewares/course.middewares";
import { requestGetDiscounts } from "@/store/middlewares/discount.middewares";
import { requestGetAllTypeCourse } from "@/store/middlewares/typeCourse.middewares";
import { unwrapResult } from "@reduxjs/toolkit";
import TextEdit from "@/components/TextEdit";
import UploadImage from "@/components/UploadImage";
import { courseSlices } from "@/store/slices/courseSlices";
import Image from "next/image";
const { resetValidateCourse } = courseSlices.actions;
const thumbDefault = 'http://res.cloudinary.com/daxftrleb/image/upload/v1711213412/e-learning/jmvs3r7br0kakgayybkf.png';
export default function Courses() {
     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isEdit, setIsEdit] = useState(false);
     const dispatch = useDispatch();
     const editorRef = useRef(null);
     const courses = useSelector(state => state.course.courses);
     const discounts = useSelector(state => state.discount.discounts);
     const categories = useSelector(state => state.category.categories);
     const validateCourse = useSelector(state => state.course.validateCourse);
     const typeCourses = useSelector(state => state.typeCourse.typeCourses);
     const [urlAvatar, setUrlAvatar] = useState(thumbDefault);
     const [confirmLoading, setConfirmLoading] = useState(false);
     const [form] = useForm();
     const [formValue, setFormValue] = useState({ status: 0 });
     const loading = useSelector((state) => state.category.loading);
     const showCreateModal = () => {
          setIsEdit(false);
          setIsModalOpen(true);
     };
     const handleCancel = async () => {
          form.resetFields();
          setFormValue({
               status: 0,
               typeCourseId: typeCourses.length ? typeCourses[0]?.id : null
          });
          setUrlAvatar(thumbDefault);
          editorRef.current.setContent("");
          setIsModalOpen(false);
     };
     console.log(validateCourse);
     const handleEditCourse = async () => {
          try {
               const response = await dispatch(requestUpdateCourse({ ...formValue, thumb: urlAvatar, desc: editorRef.current.getContent() }));
               const { message } = unwrapResult(response);
               await dispatch(resetValidateCourse());
               setIsEdit(false);
               setIsModalOpen(false);
               form.resetFields(null);
               setFormValue({
                    status: 0,
                    typeCourseId: 1
               });
               notification.success({
                    message,
                    duration: 1.0
               });


          } catch (e) {
               notification.error({
                    message: e.message,
                    duration: 1.0
               });

          }

     };
     const handleAddCourse = async () => {
          setConfirmLoading(true);
          try {
               const response = await dispatch(requestAddCourse({ ...formValue, thumb: urlAvatar, desc: editorRef.current.getContent() }));
               const { message } = unwrapResult(response);
               await dispatch(resetValidateCourse());
               setIsEdit(false);
               setIsModalOpen(false);
               form.resetFields(null);
               setFormValue({
                    status: 0,
                    typeCourseId: 1
               });
               notification.success({
                    message,
                    duration: 1.0
               });
               setConfirmLoading(false);

          } catch (e) {
               console.log(e);
               notification.error({
                    message: e?.message,
                    duration: 1.0
               });
               setConfirmLoading(false);
          }
     };
     const showEditModal = (course) => {
          setIsEdit(true);
          setFormValue(course);
          editorRef.current?.setContent(course?.desc);
          form.setFieldsValue(course);
          setUrlAvatar(course?.thumb);
          setIsModalOpen(true);
     }
     console.log(formValue);
     const handleChangeTypeCourse = (value) => {
          setFormValue({ ...formValue, typeCourseId: value });
     }
     const handleDeleteManyCourse = () => {

     }
     const handleChangeDiscount = (value) => {
          const discount = discounts.find(({ id }) => id === value);
          setFormValue({ ...formValue, discountId: value, percent: discount?.percent || 0 })
     }
     const handleChangeTitle = (e) => {
          setFormValue({ ...formValue, title: e.target.value });
     }
     const handleChangeSlug = (e) => {
          setFormValue({ ...formValue, slug: e.target.value });
     }
     const handleChangeStatus = (value) => {
          setFormValue({ ...formValue, status: value });
     }
     const handleChangeCategory = (value) => {
          setFormValue({ ...formValue, categoryId: value });
     }
     const handleChangePrice = (value) => {
          setFormValue({ ...formValue, price: value });
     }

     const handleChangeDiscountedPrice = () => {
          const price = !formValue?.price ? 0 : formValue.price;
          const percent = !formValue?.percent ? 0 : formValue.percent;
          const disCountedPrice = price - (price * percent) / 100;
          setFormValue({ ...formValue, disCountedPrice });
          form.setFieldsValue({ disCountedPrice: Math.floor(disCountedPrice) });
     }
     const onSelectChange = (newSelectedRowKeys) => {
          setSelectedRowKeys(newSelectedRowKeys);
     };
     const handleDeletecourse = async (id) => {
          try {
               const response = await dispatch(requestDeleteCourse(id));
               await unwrapResult(response);
               notification.success({
                    message: "Xóa thành công",
                    duration: 1.0
               });
          } catch (e) {
               notification.error({
                    message: e.message,
                    duration: 1.0
               })
          }

     }
     const rowSelection = {
          selectedRowKeys,
          onChange: onSelectChange,
          selections: [
               {
                    key: 'all',
                    text: 'Chọn tất cả',
                    onSelect: (changeableRowKeys) => {
                         setSelectedRowKeys(changeableRowKeys);
                    },
               },
               {
                    key: 'odd',
                    text: 'Chọn hàng lẻ',
                    onSelect: (changeableRowKeys) => {
                         let newSelectedRowKeys = [];
                         newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                              if (index % 2 !== 0) {
                                   return false;
                              }
                              return true;
                         });
                         setSelectedRowKeys(newSelectedRowKeys);
                    },
               },
               {
                    key: 'even',
                    text: 'Chọn hàng chẵn',
                    onSelect: (changeableRowKeys) => {
                         let newSelectedRowKeys = [];
                         newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                              if (index % 2 !== 0) {
                                   return true;
                              }
                              return false;
                         });
                         setSelectedRowKeys(newSelectedRowKeys);
                    },
               },
          ],
     };
     const requestLoadCategories = async () => {
          try {
               const response = await dispatch(requestGetCategories());
               unwrapResult(response);
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               })
          }

     };
     const requestLoadCourses = async () => {
          try {
               const response = await dispatch(requestGetAllCourse());
               unwrapResult(response);
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               })
          }

     };
     const requestLoadTypeCourse = async () => {
          try {
               const response = await dispatch(requestGetAllTypeCourse());
               const { typeCourses } = unwrapResult(response);
               if (typeCourses.length) {
                    const { id } = typeCourses.find(({ name }) => name === "miễn phí");
                    setFormValue({ ...formValue, typeCourseId: id })
               }
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               })
          }
     };
     const requestLoadDiscounts = async () => {
          try {
               const response = await dispatch(requestGetDiscounts());
               unwrapResult(response);
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               });
          }
     }
     useEffect(() => {
          if (!categories.length) {
               requestLoadCategories();
          }
          if (!discounts.length) {
               requestLoadDiscounts();
          }
          requestLoadCourses();
          requestLoadTypeCourse();
     }, []);
     useEffect(() => {
          handleChangeDiscountedPrice();
     }, [formValue?.price, formValue?.percent])
     const columns =
          [
               {
                    title: 'STT',
                    key: 'stt',
                    align: 'center',
                    render: (text, record, index) => index + 1,
               },
               {
                    title: 'Tên Khoá Học',
                    dataIndex: 'title',
                    key: 'title',
               },
               {
                    title: 'Ảnh',
                    dataIndex: 'thumb',
                    key: 'thumb',
                    align: 'center',
                    render: (thumb) => (
                         <div className="flex items-center justify-center">

                              <Image
                                   className="rounded-md"
                                   src={thumb}
                                   width={100}
                                   height={100}
                                   alt="thumb"
                                   objectFit="cover"
                              />
                         </div>

                    )
               },
               {
                    title: 'Thể loại',
                    dataIndex: 'typeCourseId',
                    key: 'typeCourseId',
                    render: (typeCourseId, { id, typeCourseName }) => (

                         <Tag color={typeCourseName === 'pro' ? 'blue' : 'green'} key={id}>
                              {typeCourseName}
                         </Tag>

                    )
               },
               {
                    title: 'Danh mục',
                    dataIndex: 'categoryId',
                    key: 'categoryId',
                    render: (_, { id, categoryName }) => (
                         categoryName && (
                              <Tag color={'blue'} key={id}>
                                   {categoryName}
                              </Tag>
                         )

                    )
               },
               {
                    title: 'Trạng thái',
                    key: 'status',
                    dataIndex: 'status',
                    render: (status, { id }) => (
                         <Tag color={status ? 'red' : 'green'} key={id}>
                              {status ? 'Riêng tư' : 'Công khai'}
                         </Tag>
                    ),
               },
               {
                    title: 'Hành động',
                    key: 'action',
                    render: (course, { id }) => (
                         <Space size="middle">
                              <Tooltip placement="top" title="Chỉnh Sửa">
                                   <Button
                                        onClick={() => showEditModal(course)}
                                   >
                                        <MdEdit className="text-[20px]" />
                                   </Button>
                              </Tooltip>
                              <Popconfirm
                                   title="Bạn có chắc bạn muốn xóa mục này không?"
                                   onConfirm={() => {
                                        handleDeletecourse(id);
                                   }}
                                   okText="Yes"
                                   cancelText="No"

                              >
                                   <Tooltip placement="top" title="Xóa">
                                        <Button type="primary" danger>
                                             <MdDelete className="text-[20px]" />
                                        </Button>
                                   </Tooltip>
                              </Popconfirm>
                         </Space>
                    ),
               },
          ];
     console.log(1, formValue);
     return (
          <div>
               <Button
                    className="mt-5 w-[50px] h-[50px] flex items-center justify-center bg-[#1473e6] rounded-[50%]"
                    type="primary"
                    onClick={showCreateModal}
               >
                    <IoMdAdd className="text-[#fff] text-[20px]" />
               </Button>
               <h2 className="mt-7 text-[#242424] text-[20px] font-bold text-center">Danh sách Khoá học</h2>
               <div className="relative">
                    <Table
                         className="mt-5"
                         rowSelection={rowSelection}
                         loading={loading}
                         columns={columns}
                         dataSource={courses.map((course, index) => {
                              return { ...course, key: course.id }
                         })}
                         pagination={{
                              pageSize:
                                   5
                         }}
                    />
                    {
                         selectedRowKeys.length > 0 &&
                         <Popconfirm
                              className="absolute top-[-40px] left-0"
                              title="Bạn có chắc bạn muốn xoá các danh mục này không?"
                              placement="leftTop"
                              onConfirm={handleDeleteManyCourse}
                              okText="Yes"
                              cancelText="No"

                         >
                              <Tooltip placement="top" title="Xóa">
                                   <Button type="primary" danger>
                                        <RiDeleteBin2Fill className="text-[20px]" />
                                   </Button>
                              </Tooltip>
                         </Popconfirm>
                    }
               </div>
               <Modal
                    width="80%"
                    confirmLoading={confirmLoading}
                    title={isEdit ? <h2 className="text-[20px]">Sửa khoá học</h2> : <h2 className="text-[20px]">Tạo khoá học</h2>}
                    open={isModalOpen}
                    onOk={isEdit ? handleEditCourse : handleAddCourse}
                    onCancel={handleCancel}
                    footer={[
                         <Button key="back"
                              onClick={handleCancel}
                         >
                              Huỷ
                         </Button>,
                         <Button
                              type="primary"
                              className="bg-[#1473e6]"
                              key="submit"
                              loading={loading}
                              onClick={isEdit ? handleEditCourse : handleAddCourse}
                         >
                              {isEdit ? "Cập nhập" : "Tạo"}
                         </Button>
                    ]}
               >
                    <Form
                         className="mt-2 p-4 rounded-lg"
                         layout="vertical"
                         name="create-update-course"
                         form={form}
                         initialValues={{
                              status: 0,
                              typeCourseId: typeCourses.length && typeCourses.find(({ name }) => name === "miễn phí")?.id

                         }}
                    >
                         <Row
                              gutter={{ xl: 48, md: 16, xs: 0 }}
                         >
                              <Col
                                   xl={16}
                                   md={16}
                                   xs={24}
                              >
                                   <Form.Item
                                        className='p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl '
                                        label={<h3 className="text-[16px] font-medium">Nội dung:</h3>}>
                                        <TextEdit
                                             editorRef={editorRef}
                                             value={formValue?.desc}
                                        />
                                   </Form.Item>
                              </Col>
                              <Col
                                   xl={8}
                                   md={8}
                                   xs={0}
                              >
                                   <Form.Item
                                        name='thumb'
                                        label={
                                             <div className='flex gap-2'>
                                                  <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                  <span className='text-[16px] font-medium'>Ảnh khoá học: </span>
                                             </div>
                                        }
                                   >
                                        <UploadImage
                                             styleImage={1}
                                             defaultImage={formValue?.thumb || urlAvatar}
                                             onChangeUrl={(value) => setUrlAvatar(value)}
                                        />
                                   </Form.Item>
                                   {
                                        validateCourse?.thumb && (
                                             <Form.Item className="mb-0">
                                                  <span className="text-[red]">{validateCourse?.thumb}</span>
                                             </Form.Item>)
                                   }
                                   <Form.Item
                                        name='title'
                                        label={
                                             <div className='flex gap-2'>
                                                  <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                  <span className='text-[16px] font-medium'>Tên khoá học: </span>
                                             </div>
                                        }
                                   >
                                        <Input onChange={handleChangeTitle} />
                                   </Form.Item>
                                   {
                                        validateCourse?.title && (
                                             <Form.Item className="mb-0">
                                                  <span className="text-[red]">{validateCourse?.title}</span>
                                             </Form.Item>)
                                   }
                                   <Form.Item
                                        name='slug'
                                        label={
                                             <div className='flex gap-2'>
                                                  <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                  <span className='text-[16px] font-medium'>Đường dẫn: </span>
                                             </div>
                                        }
                                   >
                                        <Input onChange={handleChangeSlug} />
                                   </Form.Item>
                                   {
                                        validateCourse?.slug && (
                                             <Form.Item className="mb-0">
                                                  <span className="text-[red]">{validateCourse?.slug}</span>
                                             </Form.Item>)
                                   }
                                   <Form.Item
                                        name="status"
                                        label={
                                             <h3 className='text-[16px] font-medium'>Trạng thái</h3>
                                        }
                                   >
                                        <Select
                                             onChange={handleChangeStatus}
                                             options={
                                                  [
                                                       { value: 0, label: 'Công khai' },
                                                       { value: 1, label: 'Riêng tư' }
                                                  ]}
                                        />
                                   </Form.Item>
                                   <Form.Item
                                        name="typeCourseId"
                                        label={
                                             <h3 className='text-[16px] font-medium'>Thể loại:</h3>
                                        }
                                   >
                                        <Select
                                             onChange={handleChangeTypeCourse}

                                             options={typeCourses.length && typeCourses.map(({ id, name }) => {
                                                  return { value: id, label: name }
                                             })}
                                        />
                                   </Form.Item>
                                   {
                                        typeCourses.find(({ id, name }) => id === formValue?.typeCourseId && name === "pro") && (
                                             <>
                                                  <Form.Item
                                                       name="price"
                                                       label={
                                                            <div className='flex gap-2'>
                                                                 <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                                 <span className='text-[16px] font-medium'>Giá gốc(VND): </span>
                                                            </div>
                                                       }
                                                  >
                                                       <InputNumber
                                                            min={0}
                                                            style={{ width: '100%' }}
                                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            parser={(value) => value.replace(/\s?/g, '').replace(/\$\s?|(,*)/g, '')}
                                                            onChange={handleChangePrice} />
                                                  </Form.Item>
                                                  {
                                                       validateCourse?.price && (
                                                            <Form.Item className="mb-0">
                                                                 <span className="text-[red]">{validateCourse?.price}</span>
                                                            </Form.Item>)
                                                  }
                                                  <Form.Item
                                                       name="discountId"
                                                       label=
                                                       {
                                                            <div className='flex gap-2'>
                                                                 <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                                 <span className='text-[16px] font-medium'>Phiếu Khuyến mại: </span>
                                                            </div>
                                                       }
                                                  >
                                                       <Select
                                                            onChange={handleChangeDiscount}

                                                            options={discounts.length && discounts.map(({ id, discountType, percent }) => {
                                                                 return { value: id, label: `${discountType} - ( ${percent}% )` }
                                                            })}
                                                       />

                                                  </Form.Item>
                                                  <Form.Item
                                                       name="disCountedPrice"
                                                       label=
                                                       {
                                                            <div className='flex gap-2'>
                                                                 <span className='text-[red] text-[20px] inline-block align-middle text-center'>*</span>
                                                                 <span className='text-[16px] font-medium'>Giá sau khi khuyến mãi(vnd): </span>
                                                            </div>
                                                       }
                                                  >
                                                       <InputNumber
                                                            // disabled={true}
                                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            parser={(value) => value.replace(/\s?/g, '').replace(/\$\s?|(,*)/g, '')}
                                                            style={{ width: '100%' }}
                                                       />
                                                  </Form.Item>

                                             </>
                                        )
                                   }
                                   <Form.Item
                                        name="categoryId"
                                        label={
                                             <h3 className='text-[16px] font-medium'>Danh mục:</h3>
                                        }
                                   >
                                        <Select
                                             onChange={handleChangeCategory}
                                             options={categories && categories.map(({ id, name }) => {
                                                  return { value: id, label: name }
                                             })}
                                        />
                                   </Form.Item>


                              </Col>
                         </Row>
                    </Form>
               </Modal>
          </div>
     )
}
