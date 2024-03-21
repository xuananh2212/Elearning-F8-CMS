"use client"
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { requestToken, requestLogOut } from "@/store/middlewares/auth.middewares";
import { unwrapResult } from "@reduxjs/toolkit";
import { notification } from "antd";
import { useRouter } from 'next/navigation';
import Link from "next/link";
export default function DropDow() {
     const dispatch = useDispatch();
     const router = useRouter();
     const [isShow, setIsShow] = useState(false);
     const user = useSelector((state) => state.user.userInfo);
     const handleLogOut = async () => {
          try {
               const token = Cookies.get("token");
               await dispatch(requestLogOut(token));
               Cookies.remove("token");
               Cookies.remove("refreshToken");
               router.push('/auth/dang-nhap');
          } catch (e) {
               notification.error({
                    message: 'lỗi server',
                    duration: 1.0,
               });
          }
     }
     const requestLoadToken = async (token) => {
          try {
               await dispatch(requestToken(token));
          } catch (e) {
               notification.error({
                    message: 'lỗi server',
                    duration: 1.0,
               });
          }
     }
     useEffect(() => {
          if (!user) {
               const token = Cookies.get("token");
               requestLoadToken(token);
          }
     }, []);
     return (
          <div
               className="relative flex p-[3px] items-center justify-center cursor-pointer rounded-[50%] bg-gradient-to-r from-[#ffd900] to-[#b45264]"
               onClick={() => setIsShow(!isShow)}
          >
               <button>
                    <Image
                         className='rounded-[50%]'
                         src={`${user?.avatar || 'http://res.cloudinary.com/daxftrleb/image/upload/v1709733165/e-learning/xpasxyscc4jh0tz7rlzu.png'}`}
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
               </button>
               {isShow &&
                    <div className="absolute z-30 top-[60px] right-0">
                         <ul className="bg-[#fff] my-3 rounded-[10px] min-w-[230px] py-[8px] px-[24px] shadow-[0_-4px_32px_#00000033]">
                              <li className="flex items-center">
                                   <div className="relative flex p-[3px] items-center justify-center cursor-pointer rounded-[50%] bg-gradient-to-r from-[#ffd900] to-[#b45264]">
                                        <Image
                                             className='rounded-[50%]'
                                             src={`${user?.avatar || 'http://res.cloudinary.com/daxftrleb/image/upload/v1709733165/e-learning/xpasxyscc4jh0tz7rlzu.png'}`}
                                             width={50}
                                             height={50}
                                             alt="avatar"
                                        />
                                        <Image
                                             className="absolute top-[-0.8px] right-[-5px]"
                                             src="http://res.cloudinary.com/daxftrleb/image/upload/v1709909392/e-learning/ywrqz2cgl84z5nxy0ncq.svg"
                                             width={18}
                                             height={18}
                                             alt="border-avatar"
                                        />
                                   </div>
                                   <div className="ml-3">
                                        <span className="text-[#292929] text-[16px] font-semibold">{user?.fullName}</span>
                                   </div>
                              </li>
                              <li className="my-2">
                                   <hr className="border-t border-solid border-[#0000000d]" />
                              </li>
                              <li>
                                   <Link className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] " href={"#"}>Trang cá nhân</Link>
                              </li>
                              <li>
                                   <Link className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] " href={"#"}>Liên kết giới thiệu</Link>
                              </li>
                              <li className="my-2">
                                   <hr className="border-t border-solid border-[#0000000d]" />
                              </li>
                              <li>
                                   <Link className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] " href={"#"}>Cài đặt</Link>
                              </li>
                              <li>
                                   <button
                                        onClick={handleLogOut}
                                        className="block bg-[transparent] text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] ">Đăng Xuất</button>
                              </li>


                         </ul>
                    </div>}

          </div>
     )
}
