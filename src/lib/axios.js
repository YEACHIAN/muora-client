/*
 * @Author: 银角大王 
 * @Date: 2020-03-18 10:11:58 
 * @Description:  请求拦截器
 */

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { errorMessage } from './alert'
import { getCookie } from './index'

axios.defaults.baseURL='/api'


axios.defaults.headers.Authorization = getCookie('tz') || null
axios.interceptors.request.use(config => {
  let token = getCookie('tz') || null
  if (token) config.headers.Authorization = 'Bearer ' + token
  else delete config.headers.Authorization
  return config
}, error => Promise.reject(error))


axios.interceptors.response.use(res => {

  if (res.data) {
    let vm = res.data
    if (vm.error) {

      errorMessage(vm.error)

      return Promise.reject(vm.error)

    } else {
      let loginCode = [4001,5001,5002]
      if(vm.code === 0) return Promise.resolve(vm.data)
      else if(loginCode.includes(vm.code)){
        errorMessage(vm.msg)
        setTimeout(() => {
          location.href = '/login'
          clearTimeout()
        }, 14000);
      }
      else errorMessage(vm.msg)
    }
  }
}, err => {
    let status_code = err.response && err.response.status ? err.response.status+'' : 0

    errorMessage(status_code)
    
    return Promise.reject( status_code ? status_code : err )

})


Vue.use(VueAxios, axios)
export default axios