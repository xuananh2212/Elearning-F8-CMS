import { axiosInstance } from "@/configs/axios.config";

export class LessonService {
  // SUPPLIER AND CUSTOMER
  static addLesson(params) {
    return axiosInstance.post("lesson/v1", params);
  }
  static updateLesson(params) {
    return axiosInstance.post(`lesson/v1/${params?.id}`, params);
  }
  static deleteLesson(id) {
    return axiosInstance.delete(`lesson/v1/${id}`);
  }
  static addLessonVideo(params) {
    return axiosInstance.post("lessonVideo/v1", params);
  }
  static updateLessonVideo(params) {
    return axiosInstance.post(`lessonVideo/v1/${params?.id}`, params);
  }
  static addLessonDocument(params) {
    return axiosInstance.post("lessonDocument/v1", params);
  }
  static updateLessonDocument(params) {
    return axiosInstance.post(`lessonDocument/v1/${params?.id}`, params);
  }

  static addLessonQuiz(params) {
    return axiosInstance.post("lessonQuiz/v1", params);
  }
  static deleteLessonVideo(id) {
    return axiosInstance.delete(`lessonVideo/v1/${id}`);
  }
  static deleteLessonDocument(id) {
    return axiosInstance.delete(`lessonDocument/v1/${id}`);
  }
  static deleteLessonQuiz(id) {
    return axiosInstance.delete(`lessonQuiz/v1/${id}`);
  }
  static addQuestionsBatch(params) {
    return axiosInstance.post("lessonQuiz/v1/question/many", params);
  }
  static updateQuestionsBatch(params) {
    return axiosInstance.post("lessonQuiz/v1/question/edit-many", params);
  }
}

export default LessonService;
