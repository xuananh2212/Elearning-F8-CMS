import Action from "@/components/Action";
import Search from "@/components/Search";
import Image from "next/image";
export default function Header() {
  return (
    <div className="h-[66px] flex justify-between bg-[#fff] items-center px-7 border-b-[1px] border-solid border-[#e8ebed] sticky top-0 right-0 z-20">
      <div>
        <div className="flex gap-2 items-center">
          <Image
            className="rounded-lg"
            src="/images/logo.png"
            width={40}
            height={40}
            alt="logo"
          />
          <span className="text-[#242424] font-black text-l">KMA Admin</span>
        </div>
      </div>
      <Search />
      <Action />
    </div>
  );
}
