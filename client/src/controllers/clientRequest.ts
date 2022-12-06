import axios, {  AxiosRequestConfig} from "axios"

export function postRequest<T>(requestAddress: string,postData : any) : Promise<T>{
    const bodyFormData = new FormData();
    bodyFormData.append('image',postData);
    return new Promise<T>((resolve,reject) => {
        const config : AxiosRequestConfig = {
            url : requestAddress,
            method : "POST",
            headers : {
               'Content-Type' : 'multipart/form-data'
            },
            data : bodyFormData,
        }
        axios(config)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error.message)
        })
    })
}