/*
 * @Author: 银角大王 
 * @Date: 2020-03-17 12:02:29 
 * @Description:  
 */

const frameIn = [
    {
        path:'/',
        component:() => import('@/views/layout'),
        children:[
            { path:'',  name:'Home',   meta:{title:'首页', auth:true }, component:() => import('@/page/home')},
            { path:'/discovery', name:'Discovery', meta:{title:'发现', auth:true }, component:() => import('@/page/discovery') },
            { path:'/question', name:'Question', meta:{title:'提问', auth:true }, component:() => import('@/page/question') },
            { path:'/question/detail', name:'QuestionDetail', meta:{ auth:true }, component:() => import('@/page/question/detail') },
            { path:'/write_essay', name:'WriteEssay', meta:{title:'写文章', auth:true }, component:() => import('@/page/writeEssay') },
            { path:'/write_ask', name:'WriteAsk', meta:{title:'写问题', auth:true }, component:() => import('@/page/writeAsk') },
            { path:'/article',  name:'Article', meta:{ auth:true }, component:() => import('@/page/article') },
            { path:'/personal', name: 'Personal', meta: {title:'个人中心', auth:true }, component:() => import('@/page/personal') }, 
            { path:'/personal/edit',  name:'PersonalEdit', meta:{ auth:true }, component:() => import('@/page/personal/Edit') },
            { path:'/people',  name:'People', meta:{ auth:true }, component:() => import('@/page/people') },
            
        ]
    }
]

const frameOut = [
    { path: '/login', name: 'login', meta:{title:'登陆' },  component:() => import('@/views/login') },
    { path: '/regist', name: 'regist', meta:{title:'注册' },  component:() => import('@/views/regist') },
]

//404页面
const errorPage = []

export default [ ...frameIn, ...frameOut, ...errorPage]