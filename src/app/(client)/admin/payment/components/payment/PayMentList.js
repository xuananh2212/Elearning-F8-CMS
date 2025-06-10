import { axiosInstance } from "@/configs/axios.config";
import { Table, Tag } from "antd";
import dayjs from "dayjs";
import { useQuery } from "react-query";

const PayMentList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/user-course/v1/get-all-users-course"
      );
      return res?.data?.data;
    },
  });
  const getTag = (data) => {
    switch (data) {
      case 0:
        return <Tag color="green">Miễn phí</Tag>;
      case 1:
        return <Tag color="orange">Chờ thanh toán</Tag>;
      case 2:
        return <Tag color="blue">Thanh toán thành công</Tag>;
      default:
        return <Tag>Trạng thái không xác định</Tag>;
    }
  };
  const columns = [
    { title: "Mã thanh toán", dataIndex: "order_code" },
    { title: "Id người dùng", dataIndex: "user_id" },
    { title: "Email người dùng", dataIndex: "email" },
    { title: "Id khóa học", dataIndex: "course_id" },
    { title: "Tên khóa học", dataIndex: "course_name" },
    { title: "Giá thanh toán", dataIndex: "discounted_price" },
    {
      title: "Thời gian tạo thanh toán",
      dataIndex: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updatedAt",
      render: (updatedAt) => dayjs(updatedAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Trạng thái",
      dataIndex: "payment_status",
      render: (data) => getTag(data),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={
          data?.map((item) => ({
            ...item,
            email: item?.User?.email,
            course_name: item?.Course?.title,
            discounted_price: item?.Course?.discounted_price,
          })) || []
        }
        rowKey="id"
        loading={isLoading}
      />
    </>
  );
};

export default PayMentList;
