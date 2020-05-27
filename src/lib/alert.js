import { Message, Loading } from 'element-ui'

export function errorMessage( x ){
    Message({
        message: x,
        type: 'error',
        center:true,
        showClose:true,
        duration:1500
    })
}

export function successMessage( x ){
    Message({
        message: x,
        type: 'success',
        center:true,
        showClose:true,
        duration:1500
    })
}

