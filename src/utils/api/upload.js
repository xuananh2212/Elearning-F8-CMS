import { endPointApi } from "@/helper/endPointApi";
import { request } from "../http";
const { UPLOAD_IMAGE } = endPointApi;
export const requestUploadImage = async (props) => {
     const res = await request.post(`${UPLOAD_IMAGE}`, props);
     return res.data;
}