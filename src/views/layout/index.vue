<template>
    <el-container>
        <el-header class="layout-header">
            <div class="p-r" style="width:1000px;height:60px;padding:0 16px;margin:0 auto;">
                <div class="logo in-block">
                    <i :class="['el-icon-s-help','f-26','cursor_pointer']"  @click="$router.push('/')"></i>
                </div>
                <div v-if="!isEffect">
                    <!-- <transition name="fade" mode="out-in"> -->
                    <el-input class="header-inp in-block " v-model="search" size="small" placeholder="请输入查询内容"></el-input>
                    <div class="title in-block f-14">
                        <span 
                        v-for="(item,index) in pageList"
                        :class="{active:index==pageIndex}"
                        @click="$router.push(item.path)" 
                        :key="index">
                            {{item.name}}
                        </span>
                    </div>
                    <!-- </transition> -->
                </div>
                <div v-else>
                    <!-- <transition name="fade" mode="out-in"> -->
                    <div class="pageName">{{pageName}}</div>
                    <!-- </transition> -->
                </div>
                <!-- <div class="title in-block f-14" :class="[ openAni&&isEffect?'to-right':'', openAni&&!isEffect?'to-left':'']"> -->
                
                
                
                <div class="avatar cursor_pointer" @click="$router.push('/personal')">
                    <el-dropdown>
                        <el-avatar shape="square" :size="32" :src="basicInfo&&basicInfo.avatar"></el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
           
        </el-header>

        <div style="height:60px"></div>

        <el-main v-loading="getUserLoading" class="pd-0" >
            <!-- <transition name="fade" mode="out-in"> -->
                <router-view 
                :userId="userId" 
                :username="basicInfo.username" 
                :avatar="basicInfo.avatar" 
                :intro="basicInfo.intro"
                :explan="basicInfo.explan?basicInfo.explan:'积硅步以至千里，积怠惰以致深渊。'">
                </router-view>
            <!-- </transition> -->
        </el-main>


    </el-container>
</template>

<script>
import { getCookie,uncompile } from '@/lib'
export default {
    data(){
        return{
            search:'',
            // fullHeight: document.documentElement.clientHeight,
            isEffect: false,
            pageName:'',
            // openAni:false,
            handleRouter: ['WriteEssay','WriteAsk'], //需要单独处理的路由
            pageIndex: 0,
            userId: uncompile(getCookie('_device_id')),
            basicInfo:{},
            getUserLoading:true,
            pageList: [
                {
                    name: '首页',
                    path:'/'
                },
                {
                    name: '发现',
                    path:'/discovery'
                },
                {
                    name: '等你来答',
                    path:'/question'
                }
            ]
        }
    },
    mounted(){
        this.getUserInfo()
        //实时获取当前视口高度
        // window.onresize = () => {
        //     return (() => {
        //         window.fullHeight = document.documentElement.clientHeight;
        //         this.fullHeight = window.fullHeight;
        //     })()
        // }

        
        this.getRouteInfo()
    },
    methods:{
        getUserInfo(){
            this.axios.get(`/mine/basicInfo`)
            .then(res=>{
                if(res){
                    this.basicInfo = res
                    this.getUserLoading = false
                }
            })
        },
        getRouteInfo(){
            let routeInfo = this.$route
            this.pageIndex = this.pageList.findIndex(x=> x.path == routeInfo.path)
            if(this.handleRouter.includes(routeInfo.name)){
                this.isEffect = true
                this.pageName = routeInfo.meta.title
            }
        },

        loginOut(){
            this.axios.post('/user/loginOut').then(res=>{
                if(res) {
                    this.$router.push({ path:'/login' })
                }
            })
        }
    },
    watch:{
        $route:{
            handler(to,from){
                if(this.handleRouter.includes(to.name)){
                    this.isEffect = true
                    this.pageName = to.meta.title
                } 
                else this.isEffect = false

                this.pageIndex = this.pageList.findIndex(x=> x.path == to.path)
            },
        }
    }
}
</script>

<style lang="less" >
.layout-header{
    background-color: #24292e;
    position: fixed;
    width: 100%;
    z-index: 1000;
    .logo{
        position: absolute;
        top: 17px;
        height: 26px;
        .el-icon-s-help{
            color: #b0b0b0;
        }
        // .el-icon-help.active{
        //     color: #fff;
        // }
        .el-icon-s-help:hover{
            color: #fff;
        }
    }   
    .header-inp{
        position: absolute;
        width: 300px;
        left: 60px;
        top: 14px;
        .el-input__inner{
            color:#eee;
            background-color:rgba(255, 255, 255, 0.1);
            border: 0;
        }
    }
    .title{
        color: #b0b0b0;
        line-height: 32px;
        position: absolute;
        left: 385px;
        top:14px;
        span{
            display: inline-block;
            margin-right: 20px;
            line-height: 32px;
            cursor:pointer;
            
        }
        .active{ color:#fff }
        span:hover{
            color: #fff;
        }
    }
    .to-right{
        animation:toRight .5s infinite;
        -webkit-animation:toRight .5s forwards;
    }

    @keyframes toRight{
        0%{
            left:385px;
            opacity: 1;
        }
        // 50%{
        //     opacity: 0.3;
        // }
        100%{
            left:415px;
            opacity: 0;
        }
    }

    .to-left{
        animation:toLeft 1s infinite;
        -webkit-animation:toLeft 1s forwards;
    }

    @keyframes toLeft{
        0%{
            left:325px;
            opacity: 0;
        }
        50%{
            left:325px;
            opacity: 0;
        }
        100%{
            left:385px;
            opacity: 1;
        }
    }

    .pageName{
        color: #fff;
        position: absolute;
        left: 70px;
        font-size: 15px;
        line-height: 60px;
        // font-weight: 600;
    }
    .avatar{
        width: 32px;
        height: 32px;
        border-radius: 4px;
        overflow: hidden;
        position: absolute;
        top: 14px;
        right: 20px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

</style>