export const metadata = {
  title: "Chi tiết khoá học",
  description: "...",
};
import { notFound } from "next/navigation";
import CourseDetails from "./components/CourseDetails";
export default function page({ params }) {
  try {
    const { slug } = params;
    return <CourseDetails slug={slug} />;
  } catch (e) {
    return notFound();
  }
}
