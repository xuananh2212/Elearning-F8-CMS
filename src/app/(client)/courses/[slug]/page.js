export const metadata = {
     title: 'Chi tiết khoá học',
     description: '...',
}
import { request } from '@/utils/http';
import { endPointApi } from '@/helper/endPointApi';
import { notFound } from 'next/navigation';
const { COURSES } = endPointApi;
import CourseDetails from '@/pages/CourseDetails';
export default async function page({ params }) {

     try {
          const { slug } = params;
          const response = await request.get(`${COURSES}/${slug}`);
          const { course } = response.data;
          return (
               <CourseDetails course={course} />
          )
     } catch (e) {
          return notFound();
     }
}
