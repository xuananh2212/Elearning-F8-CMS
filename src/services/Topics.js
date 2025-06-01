import { axiosInstance } from "@/configs/axios.config";

export class TopicService {
  // SUPPLIER AND CUSTOMER
  static addTopic(params) {
    return axiosInstance.post("topic/v1", params);
  }
  static deleteTopic(id) {
    return axiosInstance.delete(`topic/v1/${id}`);
  }
}

export default TopicService;
