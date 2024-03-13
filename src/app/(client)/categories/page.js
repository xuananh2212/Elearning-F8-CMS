export const metadata = {
     title: 'Danh Mục',
     description: 'Danh Mục',
}
import Categories from "@/pages/Categories";
export default function page() {
     return (
          <>
               <h1 className="text-[#242424] text-[28px] font-black">Quản lý danh mục</h1>
               <Categories />
          </>
     )
}
