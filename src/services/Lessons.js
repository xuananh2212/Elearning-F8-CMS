import { axiosInstance } from "@/configs/axios.config";

export class LessonService {
  // SUPPLIER AND CUSTOMER
  static addLesson(params) {
    return axiosInstance.post("lesson/v1", params);
  }
  static addLessonVideo(params) {
    return axiosInstance.post("lessonVideo/v1", params);
  }
  static addLessonDocument(params) {
    return axiosInstance.post("lessondocument/v1", params);
  }
  static addLessonQuiz(params) {
    return axiosInstance.post("lessonQuiz/v1", params);
  }
  static addQuestionsBatch(params) {
    return axiosInstance.post("lessonQuiz/v1/question/many", params);
  }
}

export default LessonService;
