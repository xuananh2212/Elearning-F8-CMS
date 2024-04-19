import axios from "axios";
export const config = (props) => {
     return {
          headers: {
               "Authorization": `Bearer${props}`
          }
     }
};
export const request = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API,

});
