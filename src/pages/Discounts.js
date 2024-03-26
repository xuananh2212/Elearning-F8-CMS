"use client"
import { IoMdAdd } from "react-icons/io";
import {
     Button, Modal, Form, Input, Select, Table, Tag, Space, Popconfirm, Tooltip, notification,
     DatePicker,
     InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { RiDeleteBin2Fill } from "react-icons/ri";
import {
     requestGetDiscounts, requestAddDiscounts,
     requestUpdateDiscounts, requestDeleteManyDiscount,
     requestDeleteDiscounts
} from "@/store/middlewares/discount.middewares";
import { discountSlices } from "@/store/slices/discountSlices";
const { resetValidateDiscounts } = discountSlices.actions;
export default function Discounts() {
     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
     const loading = useSelector((state) => state.discount.loading);
     const discounts = useSelector((state) => state.discount.discounts);
     const [loadingSubmit, setLoadingSubmit] = useState(false);
     const validateDiscounts = useSelector((state) => state.discount.validateDiscounts);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isEdit, setIsEdit] = useState(false);
     const [formValue, setFormValue] = useState(null);
     const [form] = useForm();
     const dispatch = useDispatch();
     const showCreateModal = () => {
          setIsEdit(false);
          setIsModalOpen(true);
     };
     const onSelectChange = (newSelectedRowKeys) => {
          setSelectedRowKeys(newSelectedRowKeys);
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
     const handleDeleteManyDiscount = async () => {
          if (selectedRowKeys.length) {
               const response = await dispatch(requestDeleteManyDiscount({ discountIds: selectedRowKeys }));
               const { message } = unwrapResult(response);
               setSelectedRowKeys([]);
               notification.success({
                    message,
                    duration: 1.0,
               });
          } else {
               notification.error({
                    message: 'vui lòng chọn phiếu khuyến mại muốn xoá!',
                    duration: 1.0,
               });
          }

     };
     const handleDeleteDiscount = async (id) => {
          try {
               const response = await dispatch(requestDeleteDiscounts(id));
               const { message } = unwrapResult(response);
               setSelectedRowKeys([]);
               notification.success(
                    {
                         message,
                         duration: 1.0,
                    });

          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               });
          }
     };
     const showEditModal = (discount) => {
          let date = null;
          if (discount?.expired) {
               date = dayjs(discount?.expired);
          }
          form.setFieldsValue({ ...discount, expired: date });
          setFormValue(discount);
          setIsEdit(true);
          setIsModalOpen(true);
     }
     const handleCancel = async () => {
          setIsModalOpen(false);
          await dispatch(resetValidateDiscounts());
          form.resetFields(null);
          setFormValue(null);
     }
     const handleAddDiscount = async () => {
          setLoadingSubmit(true);
          try {
               if (!formValue?.expired) {
                    delete formValue?.expired;
               }
               const response = await dispatch(requestAddDiscounts(formValue));
               const { message } = await unwrapResult(response);
               await dispatch(resetValidateDiscounts());
               setFormValue(null);
               form.resetFields(null);
               setIsModalOpen(false);
               notification.success(
                    {
                         message,
                         duration: 1.0,
                    });
               setLoadingSubmit(false);
          } catch (e) {
               notification.error(
                    {
                         message: e?.message,
                         duration: 1.0,
                    });
               setLoadingSubmit(false);
          }

     };
     const handleEditDiscount = async () => {
          try {
               const response = await dispatch(requestUpdateDiscounts(formValue));
               const { message } = unwrapResult(response);
               await dispatch(resetValidateDiscounts());
               setFormValue(null);
               form.resetFields(null);
               setIsModalOpen(false);
               notification.success(
                    {
                         message,
                         duration: 1.0,
                    });
          } catch (e) {
               notification.error({
                    message: e?.message,
                    duration: 1.0,
               })

          }

     };
     const handleChangeDiscountType = (value) => {
          setFormValue({ ...formValue, discountType: value });
     }
     const handleChangePercent = (value) => {
          setFormValue({ ...formValue, percent: value });
     }
     const handleChangeQuantity = (value) => {
          setFormValue({ ...formValue, quantity: value });
     }
     const handleChangeExpired = (date, dateString) => {
          console.log(date, typeof date);
          if (date) {
               setFormValue({ ...formValue, expired: date?.$d });
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
     const columns = [
          {
               title: 'STT',
               key: 'stt',
               align: 'center',
               render: (text, record, index) => index + 1,
          },
          {
               title: 'Loại khuyến mại',
               dataIndex: 'discountType',
               key: 'discountType',
          },
          {
               title: 'Giảm giá(%)',
               dataIndex: 'percent',
               align: 'center',
               key: 'percent',
               render: (percent) => (
                    <Tag color="green">{percent}%</Tag>
               )
          },
          {
               title: 'Số lượng',
               dataIndex: 'quantity',
               align: 'center',
               key: 'quantity',
               render: (quantity) => (
                    !quantity && quantity !== 0 ? <Tag color="blue">Vô cùng</Tag> : <span>{quantity}</span>
               )
          },
          {
               title: 'Ngày hết hạn',
               dataIndex: 'expired',
               key: 'expired',
               render: (expired) => (
                    expired ? moment(expired).format("DD/MM/YYYY HH:mm:ss") : <Tag color="blue">Vô thời hạn</Tag>
               )
          },
          {
               title: 'Ngày tạo',
               dataIndex: 'createdAt',
               key: 'createdAt',
               render: (createdAt) => (
                    moment(createdAt).format("DD/MM/YYYY HH:mm:ss")
               )
          },
          {
               title: 'Hành động',
               key: 'action',
               render: (discount, { id }) => (
                    <Space size="middle">
                         <Tooltip placement="top" title="Chỉnh Sửa">
                              <Button
                                   onClick={() => showEditModal(discount)}
                              >
                                   <MdEdit className="text-[20px]" />
                              </Button>
                         </Tooltip>
                         <Popconfirm
                              title="Bạn có chắc bạn muốn xóa mục này không?"
                              onConfirm={() => {
                                   handleDeleteDiscount(id);
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
     useEffect(() => {
          requestLoadDiscounts();
     }, [])
     return (
          <div>
               <Button
                    className="mt-5 w-[50px] h-[50px] flex items-center justify-center bg-[#1473e6] rounded-[50%]"
                    type="primary"
                    onClick={showCreateModal}
               >
                    <IoMdAdd className="text-[#fff] text-[20px]" />
               </Button>
               <h2 className="mt-7 text-[#242424] text-[20px] font-bold text-center">Danh sách phiếu khuyến mại </h2>
               <div className="relative">
                    <Table
                         className="mt-5"
                         rowSelection={rowSelection}
                         loading={loading}
                         columns={columns}
                         dataSource={discounts.map((discount, index) => {
                              return { ...discount, key: discount.id }
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
                              onConfirm={handleDeleteManyDiscount}
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
                    title={isEdit ? "Sửa phiếu Khuyến mại" : "Tạo phiếu Khuyến mại"}
                    open={isModalOpen}
                    onOk={isEdit ? handleEditDiscount : handleAddDiscount}
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
                              onClick={isEdit ? handleEditDiscount : handleAddDiscount}
                         >
                              {isEdit ? "Cập nhập" : "Tạo"}
                         </Button>
                    ]}
               >
                    <Form
                         className="mt-2 p-5"
                         layout="vertical"
                         name="create-update-discount"
                         form={form}
                    >
                         <Form.Item
                              className="mb-1"
                              name="discountType"
                              label={
                                   <h3 className="text-[16px]">Loại khuyến mãi:</h3>
                              }
                         >
                              <Input onChange={(e) => handleChangeDiscountType(e.target.value)} />
                         </Form.Item>
                         {
                              validateDiscounts?.discountType && (
                                   <Form.Item className="mb-0">
                                        <span className="text-[red]">{validateDiscounts?.discountType}</span>
                                   </Form.Item>)
                         }
                         <Form.Item
                              className="mb-1"
                              name="percent"
                              label={
                                   <h3 className="text-[16px]">Giảm giá(%):</h3>
                              }
                         >
                              <InputNumber
                                   onChange={handleChangePercent}
                                   min={0}
                                   max={100}
                                   style={{ width: '100%' }}
                              />
                         </Form.Item>
                         {
                              validateDiscounts?.percent && (
                                   <Form.Item className="mb-0">
                                        <span className="text-[red]">{validateDiscounts?.percent}</span>
                                   </Form.Item>)
                         }
                         <Form.Item
                              className="mb-1"
                              name="quantity"
                              label={
                                   <h3 className="text-[16px]">Số lượng:</h3>
                              }
                         >
                              <InputNumber
                                   onChange={handleChangeQuantity}
                                   min={0}
                                   style={{ width: '100%' }}
                              />
                         </Form.Item>
                         <Form.Item

                              className="mb-1"
                              name="expired"
                              label={
                                   <h3 className="text-[16px]">Ngày hết hạn:</h3>
                              }
                         >
                              <DatePicker
                                   onChange={handleChangeExpired}
                                   style={{ width: '100%' }}
                              />
                         </Form.Item>


                    </Form>
               </Modal>

          </div>
     )
}
