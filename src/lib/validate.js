/*
 * @Author: 银角大王 
 * @Date: 2020-03-17 15:34:54 
 * @Description:  数据校验
 */

import axios from 'axios'

export function validateName(rule, value, callback,data){
    let mid = function(){
        if(!(/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,5}$/.test(value))) return callback(new Error('请填写正确的姓名')) 
        else  callback()
    };
    if(value != data) mid() 
    else callback()
}

//年龄校验
export function validateAge(rule, value, callback){
    let mid = function(){
        if (!value) return callback(new Error('年龄不能为空'))
        else if (!(/^\d\d$/.test(value))||value<18) callback(new Error('请输入合法年龄'))
        else callback()
    };
    mid();
}

//用户名
export function validateUserName(rule, value, callback,data){
    let mid = function(){
        if(isNaN(parseFloat(value)) === false) return callback(new Error('用户名不能以数字开头'))
        else if(value.length<2) return callback(new Error('用户名最少需要2位字符'))
        else{
            callback()
        } 
    };
    if(value!=data) mid()
    else callback()
}

//密码
export function validatePassword(rule, value, callback,data){//data为用户名
    let mid = ()=> {
        if(!(/^.*(?=.{6,16})(?=.*\d)(?=.*[a-z]).*$/.test(value))) callback(new Error('请输入正确的密码格式'))
        else if(value == data) callback(new Error('密码不能和用户名相同'))
        else callback()
    };
    mid();
} 

//再次输入密码 Data为第一次输入的密码
export function validatePassword2(rule, value, callback,data){//d
    let mid = ()=> { 
        if (value !== data) callback(new Error('两次输入密码不一致!'))
        else callback()
    };
    mid();
} 