import store from '@/store'
import { getToken } from '@/utils/auth'
import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  const { code, message } = response.data
  if (code !== 0) {
    ElMessage.error(message)
    return Promise.reject(message)
  }
  return response.data
}, (error: AxiosError) => {
  const res = error?.response
  if (res && res.status === 401) {
    store.dispatch('user/resetToken').then(() => {
      // window.location.reload()
    })
  }
  ElMessage.error(error.message)
  return Promise.reject(error)
})

export default request
