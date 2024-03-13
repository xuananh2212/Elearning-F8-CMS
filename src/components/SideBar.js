"use client"
import { FaFile } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { usePathname } from 'next/navigation';
import { FaUserAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from 'next/link';
const menu = [
     { title: 'Dashboard', path: '/', icon: <MdDashboard className='text-[22px] text-[#404040]' /> },
     { title: 'Phân quyền', path: '/permissions', icon: <HiUserGroup className='text-[25px] text-[#404040]' /> },
     { title: 'Người dùng', path: '/users', icon: <FaUserAlt className='text-[20px] text-[#404040]' /> },
     { title: 'Danh mục', path: '/categories', icon: <FaFile className='text-[20px] text-[#404040]' /> },
     { title: 'Khoá học', path: '/courses', icon: <FaBookOpen className='text-[20px] text-[#404040]' /> },
     { title: 'Bài viết', path: '/blogs', icon: <svg className='w-[20px] text-[#404040]' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="newspaper" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M480 32H128C110.3 32 96 46.33 96 64v336C96 408.8 88.84 416 80 416S64 408.8 64 400V96H32C14.33 96 0 110.3 0 128v288c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V64C512 46.33 497.7 32 480 32zM272 416h-96C167.2 416 160 408.8 160 400C160 391.2 167.2 384 176 384h96c8.836 0 16 7.162 16 16C288 408.8 280.8 416 272 416zM272 320h-96C167.2 320 160 312.8 160 304C160 295.2 167.2 288 176 288h96C280.8 288 288 295.2 288 304C288 312.8 280.8 320 272 320zM432 416h-96c-8.836 0-16-7.164-16-16c0-8.838 7.164-16 16-16h96c8.836 0 16 7.162 16 16C448 408.8 440.8 416 432 416zM432 320h-96C327.2 320 320 312.8 320 304C320 295.2 327.2 288 336 288h96C440.8 288 448 295.2 448 304C448 312.8 440.8 320 432 320zM448 208C448 216.8 440.8 224 432 224h-256C167.2 224 160 216.8 160 208v-96C160 103.2 167.2 96 176 96h256C440.8 96 448 103.2 448 112V208z"></path></svg> }
]
export default function SideBar() {
     const pathname = usePathname();
     return (
          <aside className='flex-shrink-0'>
               <div className='w-[96px] sticky top-[74px] left-0 px-2 z-10'>
                    <ul className='mt-4'>
                         {
                              menu.map(({ title, icon, path }, index) => <li key={index}>
                                   <Link
                                        className={`flex items-center flex-col w-[72px] h-[72px] justify-center mt-1 rounded-2xl cursor-pointer ${pathname === path ? 'bg-[#e8ebed]' : ''}`}
                                        href={path}>
                                        {icon}
                                        <span className='text-[11px] text-[#404040] mt-2 font-semibold'>{title}</span>
                                   </Link>
                              </li>)
                         }
                    </ul>
               </div>

          </aside>
     )
}
