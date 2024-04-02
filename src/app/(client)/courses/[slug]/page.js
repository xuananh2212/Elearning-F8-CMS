export const metadata = {
     title: 'Chi tiết khoá học',
     description: '...',
}
import { request } from '@/utils/http';
import { endPointApi } from '@/helper/endPointApi';
import { notFound } from 'next/navigation';
const { COURSES } = endPointApi;
export default async function page({ params }) {
     try {
          const { slug } = params;
          const response = await request.get(`${COURSES}/${slug}`);
          const { course } = response.data;
          return (
               <div className='p-3'>
                    <h1 className='text-[#242424] text-[28px] font-black'>{course?.title}</h1>
               </div>
          )
     } catch (e) {
          return notFound();
     }
}
