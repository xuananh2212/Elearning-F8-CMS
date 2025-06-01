"use client";

import UploadImage from "@/components/UploadImage";
import { axiosInstance } from "@/configs/axios.config";
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
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

const avatarDefault = "/images/user.png";

export default function Teachers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [urlAvatar, setUrlAvatar] = useState(null);
  const [formValue, setFormValue] = useState({ avatar: avatarDefault });
  const [form] = useForm();

  const { data: teachers = [], isLoading } = useQuery(
    ["teachers"],
    async () => {
      const res = await axiosInstance.get("/teachers/v1");
      return res.data;
    }
  );

  const createMutation = useMutation(
    (newTeacher) => axiosInstance.post("/teachers/v1/create", newTeacher),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
        notification.success({ message: "Tạo giáo viên thành công" });
      },
      onError: () => {
        notification.error({ message: "Tạo thất bại" });
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, updated }) => axiosInstance.put(`/teachers/v1/${id}`, updated),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
        notification.success({ message: "Cập nhật thành công" });
      },
      onError: () => {
        notification.error({ message: "Cập nhật thất bại" });
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => axiosInstance.delete(`/teachers/v1/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
        notification.success({ message: "Xóa thành công" });
      },
      onError: () => {
        notification.error({ message: "Xóa thất bại" });
      },
    }
  );

  const showCreateModal = () => {
    form.resetFields();
    setFormValue({ avatar: avatarDefault });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const showEditModal = (teacher) => {
    setIsEdit(true);
    setFormValue(teacher);
    form.setFieldsValue(teacher);
    setUrlAvatar(teacher.avatar || avatarDefault);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = { ...formValue, avatar: urlAvatar };
    if (isEdit) {
      updateMutation.mutate({ id: formValue.id, updated: values });
    } else {
      createMutation.mutate({ ...values, role: 1 });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      render: (text) => (
        <div className="flex items-center justify-center">
          <Image
            src={text || avatarDefault}
            width={30}
            height={30}
            className="rounded-full object-cover"
            alt="avatar"
          />
        </div>
      ),
      align: "center",
    },
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phone" },
    {
      title: "Hành động",
      render: (record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button onClick={() => showEditModal(record)}>
              <MdEdit />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa giáo viên?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button danger>
                <MdDelete />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" className="mt-5" onClick={showCreateModal}>
        <IoMdAdd />
      </Button>
      <Table
        className="mt-5"
        loading={isLoading}
        columns={columns}
        dataSource={teachers.map((t) => ({ ...t, key: t.id }))}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        open={isModalOpen}
        title={isEdit ? "Cập nhật giáo viên" : "Tạo giáo viên"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Row>
            <Col span={8}>
              <Form.Item label="Ảnh đại diện">
                <UploadImage
                  defaultImage={formValue.avatar}
                  onChangeUrl={(val) => setUrlAvatar(val)}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="Tên" name="name">
                <Input
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input
                  onChange={(e) =>
                    setFormValue({ ...formValue, email: e.target.value })
                  }
                />
              </Form.Item>
              {!isEdit && (
                <Form.Item label="Mật khẩu" name="password">
                  <Input.Password
                    onChange={(e) =>
                      setFormValue({ ...formValue, password: e.target.value })
                    }
                  />
                </Form.Item>
              )}
              <Form.Item label="Số điện thoại" name="phone">
                <Input
                  onChange={(e) =>
                    setFormValue({ ...formValue, phone: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input.TextArea
                  rows={2}
                  onChange={(e) =>
                    setFormValue({ ...formValue, address: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
