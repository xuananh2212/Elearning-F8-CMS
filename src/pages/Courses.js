"use client";
import TextEdit from "@/components/TextEdit";
import UploadImage from "@/components/UploadImage";
import { axiosInstance } from "@/configs/axios.config";
import { requestGetCategories } from "@/store/middlewares/category.middewares";
import {
  requestAddCourse,
  requestDeleteCourse,
  requestDeleteManyCourse,
  requestGetAllCourse,
  requestUpdateCourse,
} from "@/store/middlewares/course.middewares";
import { requestGetDiscounts } from "@/store/middlewares/discount.middewares";
import { requestGetAllTypeCourse } from "@/store/middlewares/typeCourse.middewares";
import { courseSlices } from "@/store/slices/courseSlices";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const { resetValidateCourse } = courseSlices.actions;
const thumbDefault =
  "http://res.cloudinary.com/daxftrleb/image/upload/v1711213412/e-learning/jmvs3r7br0kakgayybkf.png";
export default function Courses({ isTeacher }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const courses = useSelector((state) => state.course.courses);
  const discounts = useSelector((state) => state.discount.discounts);
  const categories = useSelector((state) => state.category.categories);
  const validateCourse = useSelector((state) => state.course.validateCourse);
  const typeCourses = useSelector((state) => state.typeCourse.typeCourses);
  const [urlAvatar, setUrlAvatar] = useState(thumbDefault);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [id, setId] = useState("");
  const [typeCourseId, setTypeCourseId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const loading = useSelector((state) => state.category.loading);
  const { data: teachers, isFetching } = useQuery({
    queryKey: "teachers",
    queryFn: async () => {
      const res = await axiosInstance.get("/teachers/v1");
      return res.data;
    },
  });
  const showCreateModal = () => {
    form.resetFields();
    editorRef?.current?.setContent("");
    setIsEdit(false);
    setIsModalOpen(true);
  };
  const handleCancel = async () => {
    await dispatch(resetValidateCourse());
    form.resetFields();
    setTypeCourseId(null);
    setUrlAvatar(thumbDefault);
    editorRef?.current?.setContent("");
    setIsModalOpen(false);
  };
  const handleEditCourse = async () => {
    try {
      const formValues = form?.getFieldsValue();
      delete formValues?.typeCourseName;
      delete formValues?.categoryName;
      const response = await dispatch(
        requestUpdateCourse({
          ...formValues,
          id,
          thumb: urlAvatar,
          desc: editorRef?.current?.getContent(),
        })
      );
      const { message } = unwrapResult(response);
      await dispatch(resetValidateCourse());
      setIsEdit(false);
      setTypeCourseId(null);
      setDiscountPercent(null);
      setPrice(null);
      setIsModalOpen(false);
      form.resetFields(null);
      toast.success("cập nhật khóa học thành công");
    } catch (e) {
      console.error(e);
    }
  };
  const handleAddCourse = async () => {
    setConfirmLoading(true);
    try {
      const formValues = form.getFieldsValue();
      delete formValues?.typeCourseName;
      delete formValues?.categoryName;
      const response = await dispatch(
        requestAddCourse({
          ...formValues,
          thumb: urlAvatar,
          desc: editorRef.current?.getContent(),
        })
      );
      const { message } = unwrapResult(response);
      await dispatch(resetValidateCourse());
      setIsEdit(false);
      setIsModalOpen(false);
      form.resetFields();
      notification.success({
        message: "Tạo thành công",
        duration: 1.0,
      });
      setConfirmLoading(false);
    } catch (e) {
      console.log(e);
      setConfirmLoading(false);
    }
  };
  const showEditModal = (course) => {
    setIsEdit(true);
    console.log(course);
    editorRef.current?.setContent(course?.desc);
    setId(course?.id);
    setPrice(course?.price);
    setDiscountPercent(course?.percent);
    setTypeCourseId(course?.typeCourseId);
    form.setFieldsValue(course);
    setUrlAvatar(course?.thumb);
    setIsModalOpen(true);
  };
  const handleChangeTypeCourse = (value) => {
    setTypeCourseId(value);
    form.setFieldValue("typeCourseId", value);
  };
  const handleDeleteManyCourse = async () => {
    if (selectedRowKeys.length) {
      try {
        const response = await dispatch(
          requestDeleteManyCourse({ courseIds: selectedRowKeys })
        );
        const { message } = unwrapResult(response);
        await dispatch(resetValidateCourse());
        notification.success({
          message,
          duration: 1.0,
        });
        setSelectedRowKeys([]);
      } catch (e) {}
    }
  };
  const handleChangeDiscount = (value) => {
    const discount = discounts.find(({ id }) => id === value);
    setDiscountPercent(discount?.percent);
  };
  const handleChangeTitle = (e) => {
    form.setFieldValue("title", e.target.value);
  };
  const handleChangeSlug = (e) => {
    form.setFieldValue("slug", e.target.value);
  };
  const handleChangeStatus = (value) => {
    form.setFieldValue("status", value);
  };
  const handleChangeCategory = (value) => {
    form.setFieldValue("categoryId", value);
  };
  const handleChangeTeacher = (value) => {
    form.setFieldValue("teacherId", value);
  };
  const handleChangePrice = (value) => {
    setPrice(value);
    form.setFieldValue("price", value);
  };
  const handleChangeDiscountedPrice = () => {
    const priceCount = price || 0;
    const percent = discountPercent || 0;
    const discountedPrice = priceCount - (priceCount * percent) / 100;
    if (isModalOpen) {
      form.setFieldValue("discountedPrice", Math.floor(discountedPrice));
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const handleDeletecourse = async (id) => {
    try {
      const response = await dispatch(requestDeleteCourse(id));
      await unwrapResult(response);
      notification.success({
        message: "Xóa thành công",
        duration: 1.0,
      });
    } catch (e) {}
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
  const requestLoadCategories = async () => {
    try {
      const response = await dispatch(requestGetCategories());
      unwrapResult(response);
    } catch (e) {}
  };
  const requestLoadCourses = async () => {
    try {
      const response = await dispatch(requestGetAllCourse());
      unwrapResult(response);
    } catch (e) {}
  };
  const requestLoadTypeCourse = async () => {
    try {
      const response = await dispatch(requestGetAllTypeCourse());
      const { typeCourses } = unwrapResult(response);
      if (typeCourses.length) {
        const { id } = typeCourses.find(({ name }) => name === "miễn phí");
      }
    } catch (e) {}
  };
  const requestLoadDiscounts = async () => {
    try {
      const response = await dispatch(requestGetDiscounts());
      unwrapResult(response);
    } catch (e) {}
  };
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
  }, [price, discountPercent]);
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: "5%",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên Khoá Học",
      dataIndex: "title",
      width: "15%",
      key: "title",
      render: (title, { slug }) => {
        return (
          <Link
            className="hover:italic"
            href={
              isTeacher ? `/teacher/courses/${slug}` : `/admin/courses/${slug}`
            }
          >
            {title}
          </Link>
        );
      },
    },
    {
      title: "Ảnh",
      dataIndex: "thumb",
      width: "15%",
      key: "thumb",
      align: "center",
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
      ),
    },
    {
      title: "Đường dẫn",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Thể loại",
      dataIndex: "typeCourseId",
      key: "typeCourseId",
      render: (typeCourseId, { id, typeCourseName }) => (
        <Tag color={typeCourseName === "pro" ? "blue" : "green"} key={id}>
          {typeCourseName}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (_, { id, categoryName }) =>
        categoryName && (
          <Tag color={"blue"} key={id}>
            {categoryName}
          </Tag>
        ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status, { id }) => (
        <Tag color={status ? "red" : "green"} key={id}>
          {status ? "Riêng tư" : "Công khai"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (course, { id }) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh Sửa">
            <Button onClick={() => showEditModal(course)}>
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
        Danh sách Khoá học
      </h2>
      <div className="relative">
        <Table
          className="mt-5"
          rowSelection={rowSelection}
          loading={loading}
          columns={columns}
          dataSource={courses.map((course, index) => {
            return { ...course, key: course.id };
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
        )}
      </div>
      <Modal
        width="80%"
        confirmLoading={confirmLoading}
        title={
          isEdit ? (
            <h2 className="text-[20px]">Sửa khoá học</h2>
          ) : (
            <h2 className="text-[20px]">Tạo khoá học</h2>
          )
        }
        open={isModalOpen}
        onOk={isEdit ? handleEditCourse : handleAddCourse}
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
            onClick={isEdit ? handleEditCourse : handleAddCourse}
          >
            {isEdit ? "Cập nhập" : "Tạo"}
          </Button>,
        ]}
      >
        <Form
          className="mt-2 p-4 rounded-lg"
          layout="vertical"
          name="create-update-course"
          form={form}
          initialValues={{
            status: 0,
            typeCourseId:
              typeCourses.length &&
              typeCourses.find(({ name }) => name === "miễn phí")?.id,
          }}
        >
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col xl={16} md={16} xs={24}>
              <Form.Item
                name="desc"
                className="p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-xl "
                label={<h3 className="text-[16px] font-medium">Nội dung:</h3>}
              >
                <TextEdit editorRef={editorRef} />
              </Form.Item>
            </Col>
            <Col xl={8} md={8} xs={0}>
              <Form.Item
                name="thumb"
                label={
                  <div className="flex gap-2">
                    <span className="text-[red] text-[20px] inline-block align-middle text-center">
                      *
                    </span>
                    <span className="text-[16px] font-medium">
                      Ảnh khoá học:{" "}
                    </span>
                  </div>
                }
              >
                <UploadImage
                  styleImage={1}
                  defaultImage={urlAvatar}
                  onChangeUrl={(value) => setUrlAvatar(value)}
                />
              </Form.Item>
              {validateCourse?.thumb && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateCourse?.thumb}</span>
                </Form.Item>
              )}
              <Form.Item
                name="title"
                label={
                  <div className="flex gap-2">
                    <span className="text-[red] text-[20px] inline-block align-middle text-center">
                      *
                    </span>
                    <span className="text-[16px] font-medium">
                      Tên khoá học:{" "}
                    </span>
                  </div>
                }
              >
                <Input onChange={handleChangeTitle} />
              </Form.Item>
              {validateCourse?.title && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateCourse?.title}</span>
                </Form.Item>
              )}
              <Form.Item
                name="slug"
                label={
                  <div className="flex gap-2">
                    <span className="text-[red] text-[20px] inline-block align-middle text-center">
                      *
                    </span>
                    <span className="text-[16px] font-medium">Đường dẫn: </span>
                  </div>
                }
              >
                <Input onChange={handleChangeSlug} />
              </Form.Item>
              {validateCourse?.slug && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">{validateCourse?.slug}</span>
                </Form.Item>
              )}
              <Form.Item
                name="status"
                label={<h3 className="text-[16px] font-medium">Trạng thái</h3>}
              >
                <Select
                  onChange={handleChangeStatus}
                  options={[
                    { value: 0, label: "Công khai" },
                    { value: 1, label: "Riêng tư" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="typeCourseId"
                label={<h3 className="text-[16px] font-medium">Thể loại:</h3>}
              >
                <Select
                  onChange={handleChangeTypeCourse}
                  options={
                    typeCourses.length &&
                    typeCourses.map(({ id, name }) => {
                      return { value: id, label: name };
                    })
                  }
                />
              </Form.Item>
              {validateCourse?.typeCourseId && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">
                    {validateCourse?.typeCourseId}
                  </span>
                </Form.Item>
              )}
              {typeCourses.find(
                ({ id, name }) => id === typeCourseId && name === "pro"
              ) && (
                <>
                  <Form.Item
                    name="price"
                    label={
                      <div className="flex gap-2">
                        <span className="text-[red] text-[20px] inline-block align-middle text-center">
                          *
                        </span>
                        <span className="text-[16px] font-medium">
                          Giá gốc(VND):{" "}
                        </span>
                      </div>
                    }
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value.replace(/\s?/g, "").replace(/\$\s?|(,*)/g, "")
                      }
                      onChange={handleChangePrice}
                    />
                  </Form.Item>
                  {validateCourse?.price && (
                    <Form.Item className="mb-0">
                      <span className="text-[red]">
                        {validateCourse?.price}
                      </span>
                    </Form.Item>
                  )}
                  <Form.Item
                    name="discountId"
                    label={
                      <div className="flex gap-2">
                        <span className="text-[red] text-[20px] inline-block align-middle text-center">
                          *
                        </span>
                        <span className="text-[16px] font-medium">
                          Phiếu Khuyến mại:{" "}
                        </span>
                      </div>
                    }
                  >
                    <Select
                      onChange={handleChangeDiscount}
                      options={
                        discounts.length &&
                        discounts.map(({ id, discountType, percent }) => {
                          return {
                            value: id,
                            label: `${discountType} - ( ${percent}% )`,
                          };
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="discountedPrice"
                    label={
                      <div className="flex gap-2">
                        <span className="text-[red] text-[20px] inline-block align-middle text-center">
                          *
                        </span>
                        <span className="text-[16px] font-medium">
                          Giá sau khi khuyến mãi(vnd):{" "}
                        </span>
                      </div>
                    }
                  >
                    <InputNumber
                      disabled={true}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value.replace(/\s?/g, "").replace(/\$\s?|(,*)/g, "")
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item
                name="categoryId"
                label={<h3 className="text-[16px] font-medium">Danh mục:</h3>}
              >
                <Select
                  onChange={handleChangeCategory}
                  options={
                    categories &&
                    categories.map(({ id, name }) => {
                      return { value: id, label: name };
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="teacherId"
                label={<h3 className="text-[16px] font-medium">Giáo viên:</h3>}
              >
                <Select
                  onChange={handleChangeTeacher}
                  options={
                    teachers &&
                    teachers.map(({ id, name }) => {
                      return { value: id, label: name };
                    })
                  }
                />
              </Form.Item>
              {validateCourse?.categoryId && (
                <Form.Item className="mb-0">
                  <span className="text-[red]">
                    {validateCourse?.categoryId}
                  </span>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
