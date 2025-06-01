"use client";
import {
  requestLogOut,
  requestToken,
} from "@/store/middlewares/auth.middewares";
import { unwrapResult } from "@reduxjs/toolkit";
import { Dropdown, notification } from "antd";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function DropDow() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);
  const handleLogOut = async () => {
    try {
      const token = Cookies.get("token");
      console.log(token);
      await dispatch(requestLogOut(token));
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      router.push("/auth/dang-nhap");
    } catch (e) {
      notification.error({
        message: "lỗi server",
        duration: 1.0,
      });
    }
  };
  const requestLoadToken = async (token) => {
    try {
      console.log(token);
      const response = await dispatch(requestToken(token));
      unwrapResult(response);
    } catch (e) {
      console.log(e);
      notification.error({
        message: "lỗi server",
        duration: 1.0,
      });
    }
  };
  useEffect(() => {
    if (!user) {
      const token = Cookies.get("token");
      console.log(token);
      requestLoadToken(token);
    }
  }, []);
  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center w-[200px]">
          <div className="relative flex p-[3px] items-center justify-center cursor-pointer rounded-full bg-gradient-to-r from-[#ffd900] to-[#b45264] w-[50px] h-[50px]">
            {user?.avatar ? (
              <>
                <Image
                  className="rounded-full object-cover"
                  src={user.avatar}
                  width={44}
                  height={44}
                  alt="avatar"
                />
                <Image
                  className="absolute top-[-0.8px] right-[-5px]"
                  src="http://res.cloudinary.com/daxftrleb/image/upload/v1709909392/e-learning/ywrqz2cgl84z5nxy0ncq.svg"
                  width={18}
                  height={18}
                  alt="border-avatar"
                />
              </>
            ) : (
              <div className="w-[44px] h-[44px] rounded-full bg-white text-[#b45264] text-[20px] font-bold uppercase flex items-center justify-center">
                {user?.fullName?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="ml-3">
            <span className="text-[#292929] text-[16px] font-semibold">
              {user?.fullName || "Không tên"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <div className="my-2">
            <hr className="border-t border-solid border-[#0000000d]" />
          </div>
        </>
      ),
      disabled: true,
    },
    {
      key: "3",
      label: (
        <>
          <div>
            <Link
              className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] "
              href={"#"}
            >
              Trang cá nhân
            </Link>
          </div>
        </>
      ),
    },
    {
      key: "4",
      label: (
        <div>
          <Link
            className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] "
            href={"#"}
          >
            Liên kết giới thiệu
          </Link>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <div className="my-2">
          <hr className="border-t border-solid border-[#0000000d]" />
        </div>
      ),
      disabled: true,
    },
    {
      key: "6",
      label: (
        <div>
          <Link
            className="block text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] "
            href={"#"}
          >
            Cài đặt
          </Link>
        </div>
      ),
    },
    {
      key: "7",
      label: (
        <div>
          <button
            onClick={handleLogOut}
            className="block bg-[transparent] text-[14px] py-[10px] text-[#666] cursor-pointer hover:text-[#000] "
          >
            Đăng Xuất
          </button>
        </div>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="relative flex p-[3px] items-center justify-center cursor-pointer rounded-full bg-gradient-to-r from-[#ffd900] to-[#b45264] w-[36px] h-[36px]">
        <button className="w-[30px] h-[30px] relative flex items-center justify-center rounded-full overflow-hidden bg-white">
          {user?.avatar ? (
            <Image
              className="rounded-full object-cover"
              src={user.avatar}
              width={30}
              height={30}
              alt="avatar"
            />
          ) : (
            <span className="text-[14px] font-bold text-[#b45264] uppercase">
              {user?.fullName?.charAt(0) || "?"}
            </span>
          )}
          <Image
            className="absolute top-[-2px] right-[-4px]"
            src="http://res.cloudinary.com/daxftrleb/image/upload/v1709909392/e-learning/ywrqz2cgl84z5nxy0ncq.svg"
            width={10}
            height={10}
            alt="border-avatar"
          />
        </button>
      </div>
    </Dropdown>
  );
}
