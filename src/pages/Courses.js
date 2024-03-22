"use client"
import { IoMdAdd } from "react-icons/io";
import { Button, Modal, Form, Input, Select, Table, Tag, Space, Popconfirm, Tooltip, notification, TreeSelect } from 'antd';
import { useEffect, useState } from "react";
export default function Courses() {
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isEdit, setIsEdit] = useState(false);
     const showCreateModal = () => {
          setIsEdit(false);
          setIsModalOpen(true);
     };
     return (
          <div>
               <Button
                    className="mt-5 w-[50px] h-[50px] flex items-center justify-center bg-[#1473e6] rounded-[50%]"
                    type="primary"
                    onClick={showCreateModal}
               >
                    <IoMdAdd className="text-[#fff] text-[20px]" />
               </Button>
          </div>
     )
}
