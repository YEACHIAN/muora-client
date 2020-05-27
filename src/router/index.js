/*
 * @Author: 银角大王 
 * @Date: 2020-03-17 12:49:26 
 * @Description:  
 */
import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import { getCookie } from '@/lib'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    const token = getCookie('tz')
    if (to.meta.title) document.title = to.meta.title
    //路由元信息auth:true，则做登录校验
    if(to.matched.some(x=>x.meta.auth)){
        if(token){ 
            if( Object.keys(from.query).length === 0 ){ //判断路由来源是否有query，处理不是目的跳转的情况
                next()
            }else{
                let redirect = from.query.redirect //如果来源路由有query
                if(to.fullPath === redirect){ // 解决next无限循环的问题
                    next()
                }else{
                    next({path:redirect})// 跳转到目的路由
                }
            }
        }else{
            // 该页面不需要权限，但是以防万一，防止无限循环
            if (to.name === 'login') {
                next()
            } else {
                next({
                    path:"/login",
                    query: {redirect: to.fullPath} // 将目的路由地址存入login的query中
                })
            }
            
        }
    }else{
        next()
    }
})

router.afterEach(() => {
    window.scrollTo(0,0)
})

export default router
