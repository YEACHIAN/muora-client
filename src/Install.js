/*
 * @Author: 银角大王 
 * @Date: 2020-03-17 11:55:38 
 * @Description:  依赖注入
 */

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import '@/lib/axios'
import Lockr from 'lockr'
import Cookie from 'js-cookie'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'
// import './mock'

export default {
    install(Vue) {
        Vue.prototype.$lockr = Lockr

        Vue.prototype.$cookie = Cookie

        Vue.prototype.$moment = moment

        Vue.use(Element)

        Vue.use(VueRouter)

        Vue.use(VueQuillEditor)
    }
    
}

