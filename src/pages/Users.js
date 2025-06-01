"use client";
import UploadImage from "@/components/UploadImage";
import { requestResgiter } from "@/store/middlewares/auth.middewares";
import {
  requestDeleteManyUser,
  requestDeleteUser,
  requestEditUser,
  requestGetUsers,
} from "@/store/middlewares/user.middwares";
import { userSlices } from "@/store/slices/userSlices";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
const { resetValidateUser } = userSlices.actions;
const { TextArea } = Input;
const avatarDefault = "/images/user.png";
export default function Users() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [urlAvatar, setUrlAvatar] = useState(null);
  const loading = useSelector((state) => state.user.loading);
  const users = useSelector((state) => state.user.users);
  const [formValue, setFormValue] = useState({
    avatar: avatarDefault,
  });
  const validateUser = useSelector((state) => state.user.validateUser);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const showCreateModal = () => {
    setFormValue({
      avatar: avatarDefault,
    });
    form.resetFields(null);
    setIsModalOpen(true);
  };
  const handleCancel = async () => {
    await dispatch(resetValidateUser());
    form.resetFields(null);
    setFormValue({
      avatar: avatarDefault,
    });
    setIsEdit(false);
    setIsModalOpen(false);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const showEditModal = (user) => {
    setIsEdit(true);
    setFormValue(user);
    if (!user.avatar) {
      user.avatar = avatarDefault;
    }
    form.setFieldsValue(user);
    setUrlAvatar(user?.avatar || avatarDefault);
    setIsModalOpen(true);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      {
        key: "all",
        text: "Chọn tất cả",
        onSelect: (changeableRowKeys) => {
          setSelectedRowKeys(changeableRowKeys);
        },
      },
      {
        key: "odd",
        text: "Chọn hàng lẻ",
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
        key: "even",
        text: "Chọn hàng chẵn",
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
  const requestLoadUsers = async () => {
    try {
      const response = await dispatch(requestGetUsers());
      const data = unwrapResult(response);
      if (data?.status !== 200) {
        throw new Error(data?.message);
      }
    } catch (err) {
      notification.error({
        message: err?.message || "Lỗi server",
        duration: 1.0,
      });
    }
  };
  const handleEditUser = async () => {
    setConfirmLoading(true);
    try {
      const { phone } = formValue;
      if (!phone) {
        delete formValue.phone;
      }
      const response = await dispatch(
        requestEditUser({ ...formValue, avatar: urlAvatar })
      );
      const { message } = unwrapResult(response);
      await dispatch(resetValidateUser());
      setIsEdit(false);
      setIsModalOpen(false);
      form.resetFields(null);
      setFormValue({
        avatar: avatarDefault,
      });
      notification.success({
        message,
        duration: 1.0,
      });
      setConfirmLoading(false);
    } catch (e) {
      notification.error({
        message: e?.message || "lỗi server",
        duration: 1.0,
      });
      setConfirmLoading(false);
    }
  };
  const handleAddUser = async () => {
    setConfirmLoading(true);
    try {
      const { phone } = formValue;
      if (!phone) {
        delete formValue.phone;
      }
      const response = await dispatch(
        requestResgiter({ ...formValue, avatar: urlAvatar })
      );
      const { message } = unwrapResult(response);
      await dispatch(resetValidateUser());
      setIsEdit(false);
      setIsModalOpen(false);
      form.resetFields(null);
      setFormValue({
        avatar: avatarDefault,
      });
      notification.success({
        message,
        duration: 1.0,
      });
      setConfirmLoading(false);
    } catch (e) {
      notification.error({
        message: e?.message || "Lỗi server",
        duration: 1.0,
      });
      setConfirmLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const response = await dispatch(requestDeleteUser(id));
      const { status, message } = unwrapResult(response);
      if (status !== 200) {
        throw new Error(message);
      }
      notification.success({
        message,
        duration: 1.0,
      });
    } catch (e) {
      notification.error({
        message: e?.message || "Lỗi Server",
        duration: 1.0,
      });
    }
  };
  const handleDeleteManyUser = async () => {
    try {
      if (selectedRowKeys.length) {
        const response = await dispatch(
          requestDeleteManyUser({ userIds: selectedRowKeys })
        );
        const { status, message } = unwrapResult(response);
        if (status !== 200) {
          throw new Error(message);
        }
        notification.success({
          message,
          duration: 1.0,
        });
      }
    } catch (e) {
      notification.error({
        message: e?.message || "lỗi server",
        duration: 1.0,
      });
    }
    setSelectedRowKeys([]);
  };
  useEffect(() => {
    requestLoadUsers();
  }, []);
  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (text, { id }) => (
        <div className="relative inline-block  p-[3px] cursor-pointer rounded-[50%] bg-gradient-to-r from-[#ffd900] to-[#b45264]">
          <Image
            className="rounded-[50%] object-cover w-[30px] h-[30px]"
            src={`${text || "/images/user.png"}`}
            width={30}
            height={30}
            alt="avatar"
          />
          <Image
            className="absolute top-[-0.8px] right-[-5px]"
            src="http://res.cloudinary.com/daxftrleb/image/upload/v1709909392/e-learning/ywrqz2cgl84z5nxy0ncq.svg"
            width={10}
            height={10}
            alt="border-avatar"
          />
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || <span className="italic">null</span>,
    },
    // {
    //      title: 'Địa chỉ',
    //      dataIndex: 'address',
    //      key: 'address',
    //      render: (text) => text || <span className='italic'>null</span>
    // }
    // ,
    {
      title: "Hành động",
      key: "action",
      render: (user, { id }) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh Sửa">
            <Button onClick={() => showEditModal(user)}>
              <MdEdit className="text-[20px]" />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc bạn muốn xóa mục này không?"
            onConfirm={() => {
              handleDeleteUser(id);
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
      <h2 className="mt-7 text-[#242424] text-[20px] font-bold text-center">
        Danh sách người dùng
      </h2>
      <div className="relative">
        <Table
          className="mt-5"
          rowSelection={rowSelection}
          loading={loading}
          columns={columns}
          dataSource={users.map((user) => {
            return { ...user, key: user?.id };
          })}
          pagination={{
            pageSize: 5,
          }}
        />
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            className="absolute top-[-40px] left-0"
            title="Bạn có chắc bạn muốn xoá các danh mục này không?"
            placement="leftTop"
            onConfirm={handleDeleteManyUser}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip placement="top" title="Xóa">
              <Button type="primary" danger>
                <RiDeleteBin2Fill className="text-[20px]" />
              </Button>
            </Tooltip>
          </Popconfirm>
        )}
      </div>
      <Modal
        title={
          <h2 className="text-[25px] font-bold text-center">
            {isEdit ? "Sửa" : "Tạo"} thông tin người dùng
          </h2>
        }
        open={isModalOpen}
        width="60%"
        confirmLoading={confirmLoading}
        style={{ top: 20 }}
        onOk={isEdit ? handleEditUser : handleAddUser}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button
            type="primary"
            className="bg-[#1473e6]"
            key="submit"
            loading={loading}
            onClick={isEdit ? handleEditUser : handleAddUser}
          >
            {isEdit ? "Cập nhập" : "Tạo"}
          </Button>,
        ]}
      >
        <Form
          className="mt-5"
          layout="vertical"
          name="create-update-user"
          form={form}
        >
          <Row>
            <Col
              xl={8}
              md={8}
              xs={24}
              style={{ borderRight: "0.1px solid #ccc" }}
            >
              <Form.Item
                name="avatar"
                label={
                  <h3 className="text-[20px] font-semibold">Ảnh đại diện</h3>
                }
              >
                <UploadImage
                  defaultImage={formValue?.avatar}
                  onChangeUrl={(value) => setUrlAvatar(value)}
                />
              </Form.Item>
            </Col>
            <Col xl={16} md={16} xs={24} style={{ padding: "20px" }}>
              <Form.Item
                name="name"
                label={
                  <div className="flex gap-2">
                    <span className="text-[red] text-[20px] inline-block align-middle text-center">
                      *
                    </span>
                    <span className="text-[16px]">Tên người dùng: </span>
                  </div>
                }
                className="mb-2"
              >
                <Input
                  autoComplete="user-name"
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                />
              </Form.Item>
              {validateUser?.name && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateUser?.name}</span>
                </Form.Item>
              )}
              <Form.Item
                name="email"
                label={
                  <div className="flex gap-2">
                    <span className="text-[red] text-[20px] inline-block align-middle text-center">
                      *
                    </span>
                    <span className="text-[16px]">Email: </span>
                  </div>
                }
                className="mb-2"
              >
                <Input
                  autoComplete="user-email"
                  onChange={(e) =>
                    setFormValue({ ...formValue, email: e.target.value })
                  }
                />
              </Form.Item>
              {validateUser?.email && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateUser?.email}</span>
                </Form.Item>
              )}
              {!isEdit && (
                <>
                  <Form.Item
                    name="password"
                    label={
                      <div className="flex gap-2">
                        <span className="text-[red] text-[20px] inline-block align-middle text-center">
                          *
                        </span>
                        <span className="text-[16px]">Mật khẩu: </span>
                      </div>
                    }
                    className="mb-2"
                  >
                    <Input.Password
                      autoComplete="new-password"
                      onChange={(e) =>
                        setFormValue({ ...formValue, password: e.target.value })
                      }
                    />
                  </Form.Item>
                  {validateUser?.password && (
                    <Form.Item className="mb-0">
                      <span className="text-[red]">
                        {validateUser?.password}
                      </span>
                    </Form.Item>
                  )}
                  <Form.Item
                    name="passwordRe"
                    label={
                      <div className="flex gap-2">
                        <span className="text-[red] text-[20px] inline-block align-middle text-center">
                          *
                        </span>
                        <span className="text-[16px]">Nhập lại mật khẩu: </span>
                      </div>
                    }
                    className="mb-2"
                  >
                    <Input.Password
                      autoComplete="new-password"
                      onChange={(e) =>
                        setFormValue({
                          ...formValue,
                          passwordRe: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                  {validateUser?.password && (
                    <Form.Item className="mb-0">
                      <span className="text-[red]">
                        {validateUser?.password}
                      </span>
                    </Form.Item>
                  )}
                </>
              )}
              <Form.Item
                name="phone"
                label={<span className="text-[16px]">Số điện thoại:</span>}
                className="mb-3"
              >
                <Input
                  onChange={(e) =>
                    setFormValue({ ...formValue, phone: e.target.value })
                  }
                />
              </Form.Item>
              {validateUser?.phone && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateUser?.phone}</span>
                </Form.Item>
              )}
            </Col>
          </Row>
          <Form.Item
            name="address"
            label={<span className="text-[16px]">Địa chỉ:</span>}
          >
            <TextArea
              onChange={(e) =>
                setFormValue({ ...formValue, address: e.target.value })
              }
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
