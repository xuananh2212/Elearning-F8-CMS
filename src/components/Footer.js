import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <div className="bg-[#181821] text-[#a9b3bb] pt-16 pb-10">
      <section className="max-w-[1100px] w-full mx-auto flex justify-between">
        <section className="px-3">
          <div>
            <Link className="flex gap-2 items-center" href="/">
              <Image
                className="rounded-lg"
                src="/images/logo.png"
                width={40}
                height={40}
                alt="logo"
              />
              <span className="text-[#fff] font-black text-l">
                KMA - Hỗ trợ học tập
              </span>
            </Link>
          </div>
          <p className="text-[#a9b3bb] leading-[22px] text-[14px] my-[14px] max-w-[257px]">
            Điện thoại:
            <Link href="tel:0246.329.1102">0246.329.1102</Link>
            <br />
            Email:
            <Link href="mailto:contact@fullstack.edu.vn">
              xuantuananh2212@gmail.com
            </Link>
            <br />
            Chiến thắng, Thanh trì, Hà nội
          </p>
          <div>
            <Link
              href={
                "https://www.dmca.com/Protection/Status.aspx?id=1b325c69-aeb7-4e32-8784-a0009613323a&refurl=https%3a%2f%2ffullstack.edu.vn%2f&rlo=true"
              }
            >
              <Image
                className="mt-[20px]"
                src="http://res.cloudinary.com/daxftrleb/image/upload/v1710005436/e-learning/qqcfpb8pbggrmqkodeko.png"
                width={121}
                height={24}
                alt="DMCA Protected"
              />
            </Link>
          </div>
        </section>
        <section className="px-3">
          <div className="flex justify-center">
            <div>
              <h2 className="text-[#fff] text-[18px] leading-[16px] mt-[10px] mb-4 font-semibold">
                KMA
              </h2>
              <ul className="my-[10px]">
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Giới thiệu</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}> Liên hệ</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Điều khoản</Link>
                </li>
                <li className="mb-2 text-[14px]">
                  <Link href={"#"}>Bảo mật</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Cơ hội việc làm</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="px-3">
          <div className="flex justify-center">
            <div>
              <h2 className="text-[#fff] text-[18px] leading-[16px] mt-[10px] mb-4 font-semibold">
                KMA
              </h2>
              <ul className="my-[10px]">
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Giới thiệu</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}> Liên hệ</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Điều khoản</Link>
                </li>
                <li className="mb-2 text-[14px]">
                  <Link href={"#"}>Bảo mật</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Cơ hội việc làm</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="px-3">
          <div className="flex justify-center">
            <div>
              <h2 className="text-[#fff] text-[18px] leading-[16px] mt-[10px] mb-4 font-semibold">
                KMA
              </h2>
              <ul className="my-[10px]">
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Giới thiệu</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}> Liên hệ</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Điều khoản</Link>
                </li>
                <li className="mb-2 text-[14px]">
                  <Link href={"#"}>Bảo mật</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Cơ hội việc làm</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="px-3">
          <div className="flex justify-center">
            <div>
              <h2 className="text-[#fff] text-[18px] leading-[16px] mt-[10px] mb-4 font-semibold">
                KMA
              </h2>
              <ul className="my-[10px]">
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Giới thiệu</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}> Liên hệ</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Điều khoản</Link>
                </li>
                <li className="mb-2 text-[14px]">
                  <Link href={"#"}>Bảo mật</Link>
                </li>
                <li className="mb-2 text-[14px] leading-[22px]">
                  <Link href={"#"}>Cơ hội việc làm</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
