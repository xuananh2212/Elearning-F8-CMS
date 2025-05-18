"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { FaBookOpen, FaFile } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";

const menu = [
  {
    title: "Thống kê",
    path: "/",
    icon: <MdDashboard className="text-[22px] text-[#404040]" />,
    onlyFor: "admin",
  },
  {
    title: "Giáo viên",
    path: "/teacher",
    icon: <GiTeacher className="text-[20px] text-[#404040]" />,
    onlyFor: "admin",
  },
  {
    title: "Người dùng",
    path: "/users",
    icon: <FaUserAlt className="text-[20px] text-[#404040]" />,
    onlyFor: "admin",
  },
  {
    title: "Danh mục",
    path: "/categories",
    icon: <FaFile className="text-[20px] text-[#404040]" />,
    onlyFor: "admin",
  },
  {
    title: "Bộ đề",
    path: "/question-set",
    icon: <BsFillQuestionSquareFill className="text-[20px] text-[#404040]" />,
    onlyFor: "teacher",
  },
  {
    title: "Khoá học",
    path: "/courses",
    icon: <FaBookOpen className="text-[20px] text-[#404040]" />,
    onlyFor: "teacher",
  },
];

export default function SideBar() {
  const pathname = usePathname();
  const isCoursePage = pathname.includes("/courses/");
  const role = useSelector((state) => state.user?.userInfo?.role); // ví dụ role = 1 là giáo viên

  return (
    <aside
      className={`transition-transform transform flex-shrink-0 ${
        isCoursePage ? "fixed -translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="w-[96px] sticky top-[74px] left-0 px-2 z-10">
        <ul className="mt-4">
          {menu
            .filter(({ onlyFor }) => {
              if (role === 1) {
                // role = 1: giáo viên -> chỉ hiện các mục dành riêng cho teacher
                return onlyFor === "teacher";
              }
              // role khác (admin, ...): hiển thị tất cả
              return true;
            })
            .map(({ title, icon, path }, index) => (
              <li key={index}>
                <Link
                  className={`flex items-center flex-col w-[72px] h-[72px] justify-center mt-1 rounded-2xl cursor-pointer ${
                    pathname === path ? "bg-[#e8ebed]" : ""
                  }`}
                  href={path}
                >
                  {icon}
                  <span className="text-[11px] text-[#404040] mt-2 font-semibold">
                    {title}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
