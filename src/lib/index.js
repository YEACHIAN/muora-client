/*
 * @Author: 银角大王 
 * @Date: 2020-03-17 14:41:02 
 * @Description: 功能封装
 */

import Cookie from 'js-cookie'
import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'

/**
 * 时间转换
 * @param {Number} before 
 */
export function computeTime(before) {//传入当前时间和之前之间的毫秒数
    if(!before) console.error('computeTime时间转换')
    let bef = new Date(before).getTime()
    let mid = new Date().getTime() - bef
    let time = mid / 86400000

    if (time>365) time = parseInt(time/365) + '年前'
    else if (time > 30) time = parseInt(time/30) + '个月前'
    else if (time > 1) time = parseInt(time) + '天前'
    else if (mid / 3600000 > 1) time = parseInt(mid / 3600000) + '小时前'
    else if(mid / 60000 > 1) time = parseInt(mid / 60000) + '分钟前'
    else time = '刚刚'
    
    return time
 }

 // 获取用户信息
export async function getUserInfo(){
    return await axios.get(`/mine/getMineInfo`)
}

//获取客户端cookie，或判断该cookie是否存在
export function getCookie(key){
    return Cookie.get(key) ? Cookie.get(key) : ''
}

// 生成9~13位随机字符串 极大概率是11位
export function createNonce () {
// (35).toString(36) === 'z'
// 所以 36进制 囊括了 0~9 a~z 虽然没有大写 最大也就36进制
// toString() 基数参数必须在2到36之间 否则会报错
    return Math.random().toString(36).substr(2, 15) 
}

/**
 * 获取相对应的服务器域名
 * 本地是 127.0.0.1:8080 (开发环境)
 * 线上是 xxxxxxxxxx.com (生产环境)
 */
export function getServerDomain () {
    return this.isLocal() ? '127.0.0.1:8080' : 'xxxx.com'
}

// 将标准时间转换成YYYY-MM-DD HH:mm:ss
export function timeFormatter (time) {
    // 先用new Date测试是不是符合标准时间避免moment警告，然后再用moment转换时间
    // 给new Date传undefined返回Invalid Date而不是当前时间
    if (new Date(time).toString().toLowerCase().includes('invalid')) return false

    // 如果为undefined那么随便填一个(null或''或'asdasd')显示‘Invalid date’也比显示当前时间好
    const res = moment(time || '').format('YYYY-MM-DD HH:mm:ss')
    return res.toString().toLowerCase().includes('invalid') ? false : res
}

// 验证是否为有效手机号码 返回Boolean
export function validateTelephone(value){
    return /^1[3456789]\d{9}$/.test(value)
}

// 验证密码是否有效 支持字母、数字、字母  必须包含字母。返回Boolean
export function validatePassword(value){
    return /^.*(?=.{6,16})(?=.*\d)(?=.*[a-z]).*$/.test(value)
}

export function textToHtml(text){
    return text.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
}

// 自定义加密
export function compile(code){    
    let c=String.fromCharCode(code.charCodeAt(0)+code.length)
    for(let i=1;i<code.length;i++){  
        c += String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1))
    }  
    return escape(c)
} 

// 自定义解密
export function uncompile(code) {  
    code = unescape(code);  
    let c=String.fromCharCode(code.charCodeAt(0)-code.length)
    for(let i=1;i<code.length;i++){  
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1))
    }  
    return c
}  
