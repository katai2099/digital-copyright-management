import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SERVER_URL } from "../constant";

function fillAxiosConfig(
  url: string,
  requestType: string,
  queryString?: string,
  postData?: any,
  formData?: any
): AxiosRequestConfig {
  const config: AxiosRequestConfig = {
    baseURL: SERVER_URL,
    url: url,
    params: queryString,
    method: requestType,
    headers: {
      "Content-Type": postData ? "application/json" : "multipart/form-data",
    },
    data: postData ? postData : formData,
  };
  return config;
}

// export function postRequest<T>(
//   requestAddress: string,
//   postData: any,
//   formDataKey?: string
// ): Promise<T> {
//   const bodyFormData = new FormData();
//   if (formDataKey) bodyFormData.append(formDataKey, postData);
//   return new Promise<T>((resolve, reject) => {
//     const config: AxiosRequestConfig = {
//       url: requestAddress,
//       method: "POST",
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       data: bodyFormData,
//     };
//     axios(config)
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// }

export function postRequest<T>(
  requestAddress: string,
  postData: any,
  formData: any
): Promise<T> {
  return axiosRequest(requestAddress, "POST", undefined, postData, formData)
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getRequest<T>(
  requestAddress: string,
  queryString?: string
): Promise<T> {
  return axiosRequest(requestAddress, "GET", queryString)
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
}

function axiosRequest(
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
          const config = fillAxiosConfig(address, "GET", queryString);
          return axios(config);
        case "POST": {
          const config = fillAxiosConfig(
            address,
            "POST",
            undefined,
            data,
            formData
          );
          return axios(config);
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
