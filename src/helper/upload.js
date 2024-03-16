import { endPointApi } from "@/helper/endPointApi";
const { UPLOAD_IMAGE } = endPointApi;
export const requestUploadImage = async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${UPLOAD_IMAGE}`, {
          method: 'POST',
          body: props

     });
     const data = await res.json();
     return data;
}