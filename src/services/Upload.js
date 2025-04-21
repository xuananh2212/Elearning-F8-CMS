import { axiosInstance } from "@/configs/axios.config";

class UploadService {
  static uploadFileVideo(file) {
    return axiosInstance.post("/upload/v1/video", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      allowSpacing: true,
    });
  }
}

export default UploadService;
