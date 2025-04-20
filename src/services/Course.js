import { axiosInstance } from "@/configs/axios.config";
import { endPointApi } from "@/helper/endPointApi";
const { COURSES } = endPointApi;
export class CourseService {
  static getCourseDetail(slug) {
    return axiosInstance.get(`/${COURSES}/${slug}`);
  }
}

export default CourseService;
