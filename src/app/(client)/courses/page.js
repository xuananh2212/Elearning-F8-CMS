export const metadata = {
     title: 'Khoá Học',
     description: '...',
}
import Courses from "@/pages/Courses";
export default function page() {
     return (
          <div>
               <h1 className='text-[#242424] text-[28px] font-black'>Quản lý khoá học</h1>
               <Courses />
          </div>
     )
}
