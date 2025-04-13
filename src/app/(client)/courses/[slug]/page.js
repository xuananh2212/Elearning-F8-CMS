export const metadata = {
     title: 'Chi tiết khoá học',
     description: '...',
}
import { endPointApi } from '@/helper/endPointApi';
import { request } from '@/utils/http';
import { notFound } from 'next/navigation';
import CourseDetails from './components/CourseDetails';
const { COURSES } = endPointApi;
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
