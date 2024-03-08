"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { requestLogin } from '@/store/middlewares/auth.middewares';
import { useRouter } from 'next/navigation'
export default function Login() {
     const dispatch = useDispatch();
     const router = useRouter();
     const user = useSelector((state) => state.user.userInfo);
     const accessToken = useSelector((state) => state.user.accessToken);
     const refreshToken = useSelector((state) => state.user.refreshToken);
     const [formError, setFormError] = useState(null);
     const loading = useSelector((state) => state.user.loading);
     const handleSubmit = async (values) => {
          try {
               const result = await dispatch(requestLogin(values));
               const data = unwrapResult(result);
               const { code, message } = data;
               switch (code) {
                    case 1:
                         setFormError(null);
                         notification.error({
                              message,
                              duration: 1.0,
                         });
                         break;
                    case 2:
                         setFormError(data.errors);
                         break;
               }

          } catch (err) {
               notification.error({
                    message: 'lỗi server',
                    duration: 1.0,
               });
          }
     };
     const onFinishFailed = (errorInfo) => {
          console.log('Failed:', errorInfo);
     };
     console.log(user);
     useEffect(() => {
          if (user) {
               var date = new Date();
               date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
               var expires = "; expires=" + date.toUTCString();
               document.cookie = "token" + "=" + accessToken + expires + "; path=/";
               document.cookie = "refreshToken" + "=" + refreshToken + expires + "; path=/";
               router.push('/');
          }
     }, [user]);
     return (
          <div className='w-full py-10  flex justify-center items-center h-screen'>
               <div className="w-1/2 h-screen hidden lg:block">
                    <Image
                         src="http://res.cloudinary.com/daxftrleb/image/upload/v1709734684/e-learning/ulecltfdbt5ivcpww8bk.jpg"
                         width={1000}
                         height={1000}
                         alt="Placeholder Image"
                         className="object-cover w-full h-full object-right-top" />
               </div>
               <div className='lg:p-12 md:p-52 sm:20 p-8 w-full lg:w-1/2 flex items-center justify-center'>
                    <div className='w-[80%] p-6 shadow-lg shadow-cyan-500/50 rounded-lg'>
                         <div className='flex items-center justify-center'>
                              <Image
                                   className='rounded-lg'
                                   src="http://res.cloudinary.com/daxftrleb/image/upload/v1709733165/e-learning/xpasxyscc4jh0tz7rlzu.png"
                                   width={40}
                                   height={40}
                                   alt="logo"
                              />
                         </div>
                         <h3
                              className="mb-3 text-4xl font-extrabold text-[#292929] text-center my-3"
                         >Đăng nhập
                         </h3>
                         <Form
                              name="login"
                              layout="vertical"
                              initialValues={{ remember: true }}
                              onFinish={handleSubmit}
                              onFinishFailed={onFinishFailed}
                              autoComplete="off"
                         >
                              <Form.Item
                                   label="Email"
                                   name="email"
                                   className='w-full mb-2'
                                   rules={[
                                        {
                                             required: true,
                                             message: 'Please input your email!'
                                        }]}
                              >
                                   <Input className='w-full p-2' placeholder="vui lòng nhập Email" />
                              </Form.Item>
                              {formError?.email && <span className='mt-1 text-[#ff0000]'>{formError?.email}</span>}
                              <Form.Item
                                   label="Password"
                                   name="password"
                                   className='w-full mt-4 mb-2'
                                   rules={[
                                        {
                                             required: true,
                                             message: 'Please input your password!'
                                        }]}
                              >
                                   <Input.Password className='w-full p-2' placeholder="vui lòng nhập Password" />
                              </Form.Item>
                              {formError?.password && <span className='mt-1 text-[#ff0000]'>{formError?.password}</span>}

                              <Form.Item
                                   name="remember"
                                   valuePropName="checked"
                                   className='w-full'

                              >
                                   <Checkbox>Remember me</Checkbox>
                              </Form.Item>

                              <Form.Item >
                                   <Button loading={loading} type="primary" htmlType="submit"
                                        className=' text-[#fff] bg-[#1dbfaf]  py-2 px-4 h-full flex justify-center rounded-[44px] w-full cursor-pointer'
                                   >
                                        Submit
                                   </Button>
                              </Form.Item>
                         </Form>
                    </div>
               </div>
          </div>
     )
}
