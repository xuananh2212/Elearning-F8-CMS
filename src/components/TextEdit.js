"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { requestUploadImage } from '@/utils/api/upload';
import Image from 'next/image';
export default function TextEdit({ editorRef, value }) {
     const handleImageUpload = async (file, success, failure) => {
          // try {
          //      const formData = new FormData();
          //      formData.append('image', file.blob());
          //      const response = await requestUploadImage(formData);
          //      if (response && response?.data) {
          //           const imageUrl = response.data;
          //           success({ src: imageUrl }, { alt: "image" }, { width: 100, height: 100 });
          //      } else {
          //           failure('Failed to upload image');
          //      }
          // } catch (e) {
          //      failure('Failed to upload image');
          // }
     }
     return (
          <>
               <Editor
                    apiKey='gpakhx8etu6u14a4ior98qt2q1u77b7big7kaho0od1t8kax'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={value}
                    init={{
                         height: 500,
                         menubar: false,
                         plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
                         ],
                         toolbar: 'undo redo | blocks | ' +
                              'bold italic forecolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | help' + 'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                              'forecolor backcolor emoticons |',
                         images_upload_handler: handleImageUpload, // Đường dẫn URL của endpoint để xử lý việc tải ảnh lên
                         block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6',
                         content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
               />
          </>
     );

}
