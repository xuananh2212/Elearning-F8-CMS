import Link from "next/link";
import Image from "next/image";
import Search from "@/components/Search";
import Action from "@/components/Action"
export default function Header() {
     return (
          <div className='h-[66px] flex justify-between bg-[#fff] items-center px-7 border-b-[1px] border-solid border-[#e8ebed] sticky top-0 right-0 z-20'>
               <div>
                    <Link
                         className='flex gap-2 items-center'
                         href='/'

                    >
                         <Image
                              className='rounded-lg'
                              src="http://res.cloudinary.com/daxftrleb/image/upload/v1709733165/e-learning/xpasxyscc4jh0tz7rlzu.png"
                              width={40}
                              height={40}
                              alt="logo"
                         />
                         <span className="text-[#242424] font-black text-l">F8 Admin</span>
                    </Link>
               </div>
               <Search />
               <Action />
          </div>
     )
}
