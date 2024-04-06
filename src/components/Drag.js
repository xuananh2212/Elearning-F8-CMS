import React from 'react'
import { FaTrashCan } from "react-icons/fa6";
import { Button, message, Popconfirm, Dropdown, Space } from 'antd';
import { IoMdAdd } from "react-icons/io";
export default function Drag({ lessons, topic, topicSort }) {
     const confirm = (e) => {
          e.stopPropagation();
          message.success('Click on Yes');
     };

     const cancel = (e) => {
          e.stopPropagation();
          message.error('Click on No');
     };
     return (
          lessons.map(({ title, sort, id }, index) => (
               <div
                    className="mt-1 p-4 flex items-center justify-between border border-solid border-[#7a797985] rounded cursor-pointer" key={index}>
                    {`${topicSort}.${sort}. ${title}`}
                    <Popconfirm
                         title="Delete the task"
                         description="Are you sure to delete this task?"
                         onConfirm={confirm}
                         onCancel={cancel}
                         okText="Yes"
                         cancelText="No"
                    >
                         <FaTrashCan
                              className="text-[red]"
                              onClick={(event) => {
                                   event.stopPropagation();
                              }}
                         />
                    </Popconfirm>
               </div>

          ))
     );
}
