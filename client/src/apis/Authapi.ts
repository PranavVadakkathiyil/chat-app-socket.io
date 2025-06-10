import axios from "@/lib/axios";
 const registerUser = async(formData:FormData)=>{
    return axios.post('/user/register',formData)
}
 const loginUser = async(data:{email:string,password:string})=>{
    return axios.post('/user/login',data)
}

export {registerUser,loginUser}