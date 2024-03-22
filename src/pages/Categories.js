"use client"
import { IoMdAdd } from "react-icons/io";
import { Button, Modal, Form, Input, Select, Table, Tag, Space, Popconfirm, Tooltip, notification, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
     requestGetCategories, requestAddCategory,
     requestDeleteCategory, requestUpdateCategory,
     requestDeleteManyCategory, requestCategoriesTreeData
} from "@/store/middlewares/category.middewares";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { getParentCategories } from "@/helper/parentCategories";
import { categorySlices } from "@/store/slices/categorySlices";
const { resetValidateCategory } = categorySlices.actions;
export default function Categories() {
     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
     const dispatch = useDispatch();
     const [form] = useForm();
     const loading = useSelector((state) => state.category.loading);
     const categories = useSelector((state) => state.category.categories);
     const categoriesTreeData = useSelector((state) => state.category.categoriesTreeData);
     const validateCategory = useSelector((state) => state.category.validateCategory);
     const [loadingSubmit, setLoadingSubmit] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isEdit, setIsEdit] = useState(false);
     const [formValue, setFormValue] = useState({
          name: '',
          status: 0,
          parentId: null,
     });
     const handleOnChangeParentId = (value) => {
          setFormValue({ ...formValue, parentId: value });
     }
     const handleCancel = async () => {
          await dispatch(resetValidateCategory());
          form.resetFields();
          setFormValue({
               name: '',
               status: 0,
               parentId: null
          });
          setSelectedRowKeys([]);
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
               unwrapResult(response);
               await dispatch(resetValidateCategory());
               form.resetFields();
               setFormValue(
                    {
                         name: '',
                         status: 0,
                         parentId: null,
                    }
               );
               notification.success({
                    message: "Thêm danh mục thành công",
                    duration: 1.0
               })
               setIsModalOpen(false)
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0
               })
          }
          setLoadingSubmit(false);

     };
     const handleEditCategory = async () => {
          setLoadingSubmit(true);
          try {
               const response = await dispatch(requestUpdateCategory(formValue));
               const { message } = unwrapResult(response);
               await dispatch(resetValidateCategory());
               form.resetFields();
               setFormValue({
                    name: '',
                    status: 0,
                    parentId: null,
               });
               notification.success({
                    message,
                    duration: 1.0
               });
               setIsModalOpen(false);
          } catch (e) {
               const { status, message } = e;
               switch (status) {
                    case 404:
                         notification.error({
                              message,
                              duration: 1.0
                         })
                         break;
                    case 400:
                         break;
                    default:
                         notification.error({
                              message: e?.message,
                              duration: 1.0
                         });
                         break;
               }

          }
          setSelectedRowKeys([]);
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
          setSelectedRowKeys([]);
     };
     const handleDeleteManyCategory = async () => {
          try {
               const response = await dispatch(requestDeleteManyCategory({ categoryIds: selectedRowKeys }));
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
               console.log(e);
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
                    message: e?.message || 'lỗi server',
                    duration: 1.0,
               })
          }

     }
     const requestLoadCategoriesTreeData = async () => {
          try {
               const response = await dispatch(requestCategoriesTreeData());
               const data = unwrapResult(response);
               if (data.status !== 200) {
                    throw new Error(data?.message)
               };
          } catch (e) {
               console.log(e);
               notification.error({
                    message: e?.message || 'lỗi server',
                    duration: 1.0,
               })
          }
     }
     useEffect(() => {
          requestLoadCategoriesTreeData();
     }, [categories]);

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
               title: 'Trạng thái',
               key: 'status',
               dataIndex: 'status',
               render: (_, { status, id }) => (
                    <Tag color={status ? 'red' : 'green'} key={id}>
                         {status ? 'Riêng tư' : 'Công khai'}
                    </Tag>
               ),
          },
          {
               title: 'Danh mục cha',
               key: 'parentId',
               dataIndex: 'parentId',
               render: (id) => (
                    getParentCategories(id, categories)
                         .map(({ name, id }, index) => {
                              return <Tag
                                   color='blue'
                                   key={id}
                                   className="ml-1"
                              >
                                   {name}
                              </Tag>
                         })
               )
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
     console.log(categories);
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
                    // pagination={{
                    //      pageSize:
                    //           5
                    // }}
                    />
                    {
                         selectedRowKeys.length > 0 &&
                         <Popconfirm
                              className="absolute top-[-40px] left-0"
                              title="Bạn có chắc bạn muốn xoá các danh mục này không?"
                              placement="leftTop"
                              onConfirm={handleDeleteManyCategory}
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
                              validateCategory?.name && (
                                   <Form.Item className="mb-0">
                                        <span className="text-[red]">{validateCategory?.name}</span>
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
                         <Form.Item
                              name="parentId"
                              label="Danh Mục Cha"
                         >
                              <TreeSelect
                                   showSearch
                                   style={{ width: '100%' }}
                                   value={formValue?.parentId}
                                   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                   placeholder="Danh mục gốc"
                                   allowClear
                                   treeDefaultExpandAll
                                   onChange={handleOnChangeParentId}
                                   treeData={categoriesTreeData}
                              />
                         </Form.Item>
                         {
                              validateCategory?.parentId && (
                                   <Form.Item className="mb-0">
                                        <span className="text-[red]">{validateCategory?.parentId}</span>
                                   </Form.Item>)
                         }
                    </Form>
               </Modal>
          </div>
     )
}
