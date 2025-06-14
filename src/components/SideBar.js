"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { FaBookOpen, FaFile } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { MdDashboard, MdPayments } from "react-icons/md";
import { useSelector } from "react-redux";
export default function SideBar() {
  const pathname = usePathname();
  const isCoursePage = pathname.includes("/courses/");
  const role = useSelector((state) => state.user?.userInfo?.role); // 1: teacher, 2: admin

  const roleMap = {
    1: "teacher",
    2: "admin",
  };
  const currentRole = roleMap[role];

  if (!currentRole) return null;

  const menu = [
    {
      title: "Thống kê",
      path: "/ROLE",
      icon: <MdDashboard className="text-[22px] text-[#404040]" />,
      roles: ["admin", "teacher"],
    },
    {
      title: "Giáo viên",
      path: "/ROLE/teacher",
      icon: <GiTeacher className="text-[20px] text-[#404040]" />,
      roles: ["admin"],
    },
    {
      title: "Người dùng",
      path: "/ROLE/users",
      icon: <FaUserAlt className="text-[20px] text-[#404040]" />,
      roles: ["admin"],
    },
    {
      title: "Danh mục",
      path: "/ROLE/categories",
      icon: <FaFile className="text-[20px] text-[#404040]" />,
      roles: ["admin"],
    },
    {
      title: "Bộ đề",
      path: "/ROLE/question-set",
      icon: <BsFillQuestionSquareFill className="text-[20px] text-[#404040]" />,
      roles: ["teacher", "admin"],
    },
    {
      title: "Khóa học",
      path: "/ROLE/courses",
      icon: <FaBookOpen className="text-[20px] text-[#404040]" />,
      roles: ["teacher", "admin"],
    },
    {
      title: "Thanh toán",
      path: "/ROLE/payment",
      icon: <MdPayments className="text-[20px] text-[#404040]" />,
      roles: ["admin"],
    },
  ];

  return (
    <aside
      className={`transition-transform transform flex-shrink-0 ${
        isCoursePage ? "fixed -translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="w-[96px] sticky top-[74px] left-0 px-2 z-10">
        <ul className="mt-4">
          {menu
            .filter((item) => item.roles.includes(currentRole))
            .map(({ title, icon, path }, index) => {
              const resolvedPath = path.replace("ROLE", currentRole);
              return (
                <li key={index}>
                  <Link
                    href={resolvedPath}
                    className={`flex items-center flex-col w-[72px] h-[72px] justify-center mt-1 rounded-2xl cursor-pointer ${
                      pathname === resolvedPath ? "bg-[#e8ebed]" : ""
                    }`}
                  >
                    {icon}
                    <span className="text-[11px] text-[#404040] mt-2 font-semibold">
                      {title}
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </aside>
  );
}
