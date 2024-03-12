"use client"
import { IoMdAdd } from "react-icons/io";
import { Button, Modal, Form, Input, Select, Table, Tag, Space, Popconfirm, Tooltip, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { requestGetCategories, requestAddCategory, requestDeleteCategory } from "@/store/middlewares/category.middewares";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
export default function Categories() {
     const dispatch = useDispatch();
     const [formCreate] = useForm();
     const loading = useSelector((state) => state.category.loading);
     const categories = useSelector((state) => state.category.categories);
     const [loadingSubmit, setLoadingSubmit] = useState(false);
     const [validateName, setValidateName] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [form, setForm] = useState(
          {
               name: null,
               status: 0
          });

     const showModal = () => {
          setIsModalOpen(true);
     };
     useEffect(() => {
          if (isModalOpen) {
               setValidateName(null);
          }

     }, [isModalOpen]);
     console.log(formCreate);
     const handleOk = async () => {
          setLoadingSubmit(true);
          try {
               const response = await dispatch(requestAddCategory(form));
               const data = unwrapResult(response);
               if (data.status === 201) {
                    formCreate.resetFields();
                    setForm({
                         name: null,
                         status: 0
                    })
                    notification.success({
                         message: "Thêm danh mục thành công",
                         duration: 1.0
                    })
                    setIsModalOpen(false);
                    setValidateName("");
               } else {
                    setValidateName(data.message);
               }

          } catch (e) {
               notification.error({
                    message: 'lỗi server',
                    duration: 1.0
               })
          }
          setLoadingSubmit(false);

     };

     const handleCancel = () => {
          formCreate.resetFields();
          setIsModalOpen(false);
     };
     const handleChangeStatus = (value) => {
          setForm({ ...form, status: value });
     }
     const handleChangeName = (value) => {
          setForm({ ...form, name: value });
     }
     const requestLoadCategories = async () => {
          try {
               const response = await dispatch(requestGetCategories());
               const data = unwrapResult(response);
               if (data.status !== 200) {
                    throw new Error(data?.message)
               };
          } catch (e) {
               notification.error({
                    message: e.message || 'lỗi server',
                    duration: 1.0,
               })
          }

     }
     const handleDeleteCategory = async (id, text) => {
          try {
               const response = await dispatch(requestDeleteCategory(id));
               const result = unwrapResult(response);
               const { status, message } = result;
               if (status == !200) {
                    throw new Error(message);
               };
               notification.success({
                    message,
                    duration: 1.0
               })
          } catch (e) {
               notification.error({
                    message: e?.message || 'lỗi server',
                    duration: 1.0
               })

          }
     };
     useEffect(() => {
          requestLoadCategories();
     }, []);
     const columns = [
          {
               title: 'STT',
               key: 'stt',
               align: 'center',
               render: (text, record, index) => index + 1,
          },
          {
               title: 'Tên danh mục',
               dataIndex: 'name',
               key: 'name',
          },
          {
               title: 'Trạng Thái',
               key: 'status',
               dataIndex: 'status',
               render: (_, { status, id }) => (
                    <Tag color={status ? 'red' : 'blue'} key={id}>
                         {status ? 'Riêng tư' : 'Công khai'}
                    </Tag>
               ),
          },
          {
               title: 'Ngày tạo',
               dataIndex: 'createdAt',
               key: 'createdAt',
               render: (_, { createdAt }) => (
                    moment(createdAt).format("DD/MM/YYYY HH:mm:ss")
               )
          },
          {
               title: 'Hành Động',
               key: 'action',
               render: (_, { id }) => (
                    <Space size="middle">
                         <Tooltip placement="top" title="Chỉnh Sửa">
                              <Button
                                   onClick={showModal}
                              >
                                   <MdEdit className="text-[20px]" />
                              </Button>
                         </Tooltip>
                         <Popconfirm
                              title="Bạn có chắc bạn muốn xóa mục này không?"
                              onConfirm={() => {
                                   handleDeleteCategory(id);
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
     return (
          <div>
               <Button
                    className="mt-5 w-[50px] h-[50px] flex items-center justify-center bg-[#1473e6] rounded-[50%]"
                    type="primary"
                    onClick={showModal}
               >
                    <IoMdAdd className="text-[#fff] text-[20px]" />
               </Button>
               <h2 className="mt-7 text-[#242424] text-[20px] font-bold text-center">Danh Sách Danh Mục</h2>

               <Table
                    className="mt-5"
                    loading={loading}
                    columns={columns}
                    dataSource={categories}
                    pagination={{
                         pageSize:
                              5
                    }}
               />
               <Modal
                    title="Tạo Danh Mục"
                    open={isModalOpen}
                    onOk={handleOk}
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
                              onClick={handleOk}
                         >
                              Tạo
                         </Button>
                    ]}
               >
                    <Form
                         className="mt-2 p-5 rounded-lg border-solid border-[1px] border-[#b2b2b2]"
                         layout="vertical"
                         name="create categories"
                         form={formCreate}
                         initialValues={{
                              status: 0
                         }}
                    >
                         <Form.Item
                              name="name"
                              label="Tên danh mục"
                         >
                              <Input onChange={(e) => handleChangeName(e.target.value)} />
                         </Form.Item>
                         {
                              validateName && <span className="text-[red] mt-2">{validateName}</span>
                         }
                         <Form.Item
                              name="status"
                              label="Trạng thái"
                         >
                              <Select
                                   onChange={handleChangeStatus}
                                   options={[
                                        { value: 0, label: 'Công khai' },
                                        { value: 1, label: 'Riêng tư' }
                                   ]}
                              />
                         </Form.Item>
                    </Form>
               </Modal>
          </div>
     )
}
