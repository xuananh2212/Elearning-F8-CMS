export const metadata = {
     title: 'Danh Mục',
     description: 'Danh Mục',
}
import Categories from "@/pages/categories/Categories";
export default function page() {
     return (
          <div className="mt-5">
               <h1 className="text-[#242424] text-[28px] font-black">Quản Lý Danh Mục</h1>
               <Categories />
          </div>
     )
}
