import { axiosInstance } from "@/configs/axios.config";

export class TopicService {
  // SUPPLIER AND CUSTOMER
  static addTopic(params) {
    return axiosInstance.post("topic/v1", params);
  }
}

export default TopicService;
