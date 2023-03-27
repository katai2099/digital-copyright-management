import axios, { AxiosError } from "axios";
import { SERVER_URL } from "../models/common";

export function axiosRequest(
  address: string,
  requestType: "GET" | "PUT" | "POST",
  queryString?: string,
  data?: Record<string, any>,
  formData?: FormData
): Promise<any> {
  const requestAddress = `${SERVER_URL}${address}`;

  return Promise.resolve()
    .then(() => {
      switch (requestType) {
        case "GET":
          return axios.get(requestAddress);
        case "POST": {
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
          return axios.post(requestAddress, formData, config);
        }
        case "PUT":
          return axios.put(requestAddress);
      }
    })
    .then((response) => Promise.resolve(response))
    .catch((err: AxiosError) => {
      console.log(err);
      return Promise.reject(err);
    });
}
