"use client"
import { IoMdAdd } from "react-icons/io";
import { Button, Modal, Form, Input, Select, Table, Tag, Space, Popconfirm, Tooltip, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
     requestGetCategories, requestAddCategory,
     requestDeleteCategory, requestUpdateCategory,
     requestDeleteCategories
} from "@/store/middlewares/category.middewares";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import { RiDeleteBin2Fill } from "react-icons/ri";
export default function Categories() {
     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
     const dispatch = useDispatch();
     const [form] = useForm();
     const loading = useSelector((state) => state.category.loading);
     const categories = useSelector((state) => state.category.categories);
     const [loadingSubmit, setLoadingSubmit] = useState(false);
     const [validateName, setValidateName] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isEdit, setIsEdit] = useState(false);
     const [formValue, setFormValue] = useState({
          name: '',
          status: 0
     });
     const handleCancel = () => {
          form.resetFields();
          setFormValue({
               name: '',
               status: 0
          });
          setIsModalOpen(false);
     };
     const handleChangeStatus = (value) => {
          setFormValue({ ...formValue, status: value });
     }
     const handleChangeName = (value) => {
          setFormValue({ ...formValue, name: value });
     }

     const showCreateModal = () => {
          setIsEdit(false);
          setIsModalOpen(true);
     };
     const showEditModal = (category) => {
          setIsEdit(true);
          setFormValue(category);
          form.setFieldsValue(category);
          setIsModalOpen(true);
     }
     const onSelectChange = (newSelectedRowKeys) => {
          setSelectedRowKeys(newSelectedRowKeys);
     };
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
     const handleAddCategory = async () => {
          setLoadingSubmit(true);
          try {
               const response = await dispatch(requestAddCategory(formValue));
               const data = unwrapResult(response);
               if (data.status === 201) {
                    form.resetFields();
                    setFormValue(
                         {
                              name: '',
                              status: 0
                         }
                    );
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
     const handleEditCategory = async () => {
          setLoadingSubmit(true);
          try {
               const response = await dispatch(requestUpdateCategory(formValue));
               const data = unwrapResult(response);
               if (data.status === 200) {
                    form.resetFields();
                    setFormValue({
                         name: '',
                         status: 0
                    });
                    notification.success({
                         message: data.message,
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
     const handleDeleteCategory = async (id) => {
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
     const handleDeleteCategories = async () => {
          try {
               const response = await dispatch(requestDeleteCategories({ categoriesId: selectedRowKeys }));
               const data = unwrapResult(response);
               if (data.status !== 200) {
                    throw new Error(data.message);
               }
               setSelectedRowKeys([]);
               notification.success({
                    message: data.message,
                    duration: 1.0
               })
          } catch (e) {
               notification.error({
                    message: e?.message || 'lỗi server',
                    duration: 1.0
               })

          }

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

     useEffect(() => {
          requestLoadCategories();
     }, []);

     useEffect(() => {
          if (isModalOpen) {
               setValidateName(null);
          }

     }, [isModalOpen]);
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
               title: 'Trạng thái',
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
               title: 'Hành động',
               key: 'action',
               render: (category, { id }) => (
                    <Space size="middle">
                         <Tooltip placement="top" title="Chỉnh Sửa">
                              <Button
                                   onClick={() => showEditModal(category)}
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
                    onClick={showCreateModal}
               >
                    <IoMdAdd className="text-[#fff] text-[20px]" />
               </Button>
               <h2 className="mt-7 text-[#242424] text-[20px] font-bold text-center">Danh sách danh mục</h2>
               <div className="relative">
                    <Table
                         className="mt-5"
                         rowSelection={rowSelection}
                         loading={loading}
                         columns={columns}
                         dataSource={categories.map((category, index) => {
                              return { ...category, key: category.id }
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
                              onConfirm={handleDeleteCategories}
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
                    title={isEdit ? "Sửa danh mục" : "Tạo danh mục"}
                    open={isModalOpen}
                    onOk={isEdit ? handleEditCategory : handleAddCategory}
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
                              onClick={isEdit ? handleEditCategory : handleAddCategory}
                         >
                              {isEdit ? "Cập nhập" : "Tạo"}
                         </Button>
                    ]}
               >
                    <Form
                         className="mt-2 p-5 rounded-lg border-solid border-[1px] border-[#b2b2b2]"
                         layout="vertical"
                         name="create-update-category"
                         form={form}
                         initialValues={{
                              status: 0
                         }}
                    >
                         <Form.Item
                              className="mb-1"
                              name="name"
                              label="Tên danh mục"
                         >
                              <Input onChange={(e) => handleChangeName(e.target.value)} />

                         </Form.Item>
                         {
                              validateName && (
                                   <Form.Item className="mb-0">
                                        <span className="text-[red]">{validateName}</span>
                                   </Form.Item>)
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
