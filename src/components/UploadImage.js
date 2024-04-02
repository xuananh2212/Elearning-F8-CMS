'use client';
import React, { useEffect, useState } from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import { message, Modal, Upload } from 'antd';
import { requestUploadImage } from '@/utils/api/upload';
import Image from 'next/image';
const getBase64 = (file) =>
     new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
     });
export default function UploadImage({ defaultImage, onChangeUrl }) {
     const [previewOpen, setPreviewOpen] = useState(false);
     const [previewImage, setPreviewImage] = useState('');
     const [previewTitle, setPreviewTitle] = useState('');
     const [fileList, setFileList] = useState([]);

     const handleCancel = () => setPreviewOpen(false);
     const handlePreview = async (file) => {
          if (!file.url && !file.preview) {
               file.preview = await getBase64(file.originFileObj);
          }

          setPreviewImage(file.url || (file.preview));
          setPreviewOpen(true);
          setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1));
     };

     const handleChange = ({ fileList: newFileList }) => {
          console.log("newFileList::", newFileList);
          setFileList(newFileList);
          onChangeUrl(newFileList?.[0]?.response ?? "");
     };
     const uploadButton = (
          <button className='flex items-center justify-center flex-col gap-1' style={{ border: 0, background: 'none' }} type="button">
               <FaCirclePlus className='text-[20px]' />
               <div style={{ marginTop: 8 }}>Tải lên</div>
          </button>
     );
     const customRequest = async ({ file, onSuccess, onError }) => {
          try {
               const formData = new FormData();
               formData.append('image', file);
               const { data } = await requestUploadImage(formData);
               onSuccess(data); // Gọi hàm onSuccess khi tải lên thành công
          } catch (error) {
               onError(error); // Gọi hàm onError nếu có lỗi xảy ra
               message.error('Failed to upload file.'); // Hiển thị thông báo lỗi
          }
     };
     useEffect(() => {
          console.log(1);
          if (defaultImage) {
               setFileList([{
                    uid: "-1",
                    name: "default.png",
                    url: defaultImage,
               },]);
          }

     }, [defaultImage]);
     return (

          <>
               <Upload
                    customRequest={customRequest}
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    maxCount={1}
                    beforeUpload={(file) => {
                         const isJpgOrPng =
                              file.type === "image/jpeg" || file.type === "image/png";
                         const isLt3M = (file.size / 1024 / 1024) < 3;
                         if (!isJpgOrPng || !isLt3M) {
                              message.error("Bạn chỉ có thể tải lên tệp JPG/PNG hoặc phải nhỏ hơn 2MB!")
                         }
                         if (isJpgOrPng && isLt3M) {
                              return true
                         } else {
                              return false
                         }
                    }}
               >
                    {
                         uploadButton
                    }
               </Upload>
               <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <Image width={100} objectFit='cover' height={100} alt="example" style={{ width: '100%' }} src={previewImage} />
               </Modal>
          </>
     )
}
