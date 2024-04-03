import { FaTrashCan } from "react-icons/fa6";
import { Button, message, Popconfirm, Dropdown, Space } from 'antd';
import { IoMdAdd } from "react-icons/io";
function convertToRoman(num) {
     const romanNumerals = {
          M: 1000,
          CM: 900,
          D: 500,
          CD: 400,
          C: 100,
          XC: 90,
          L: 50,
          XL: 40,
          X: 10,
          IX: 9,
          V: 5,
          IV: 4,
          I: 1
     };

     let roman = '';

     for (let key in romanNumerals) {
          while (num >= romanNumerals[key]) {
               roman += key;
               num -= romanNumerals[key];
          }
     }

     return roman;
}
const items = [
     {
          label: <div onClick={(e) => { e.stopPropagation() }} >1st menu item</div>,
          key: '0',

     },
     {
          label: <a href="#">2nd menu item</a>,
          key: '1',
     },
     {
          type: 'divider',
     },
     {
          label: '3rd menu item',
          key: '3',
     },
];
export const childrenCollapse = (lessons) => (
     lessons.map(({ title, sort }, index) => (
          <div className="mt-1 p-4 flex items-center justify-between border border-solid border-[#7a797985] rounded cursor-pointer" key={index}>
               {`${sort}. ${title}`}
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
const confirm = (e) => {
     e.stopPropagation();
     message.success('Click on Yes');
};

const cancel = (e) => {
     e.stopPropagation();
     message.error('Click on No');
};

const genExtra = (id) => (
     <div className="flex items-center justify-between gap-3">
          <Dropdown
               menu={{ items }}
               trigger={['click']}
               onClick={(e) => e.stopPropagation()}
          >
               <Button
                    className="w-[30px] h-[30px] p-0 flex items-center justify-center bg-[#1473e6] rounded-md"
                    type="primary"
               >
                    <IoMdAdd className="text-[#fff] text-[10px]" />
               </Button>
          </Dropdown>

          <Popconfirm
               title="Delete the task"
               description="Are you sure to delete this task?"
               onConfirm={confirm}
               onCancel={cancel}
               okText="Yes"
               cancelText="No"
          >
               <div className="w-[30px] h-[30px] flex bg-[#fff] items-center justify-center rounded-md"
                    onClick={(event) => {
                         event.stopPropagation();
                    }}
               >
                    <FaTrashCan
                         className="text-[red]"

                    />
               </div>
          </Popconfirm>
     </div>

);

export const covertItemCollapse = (topics) => {
     console.log(topics);
     return topics.map((topic) => ({
          key: topic?.id,
          label: `${convertToRoman(topic?.sort)}. ${topic?.title}`,
          children: topic.Lessons?.length > 0 ? childrenCollapse(topic.Lessons) : undefined,
          extra: genExtra(topic?.id),
     }));
}
