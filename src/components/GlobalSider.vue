<template>
    <div>
        <div class="right-sider" :class="{'fixed' : fixed}">
            <el-card class="box-card">
                <div class="GlobalWrite">
                    <span class="navItem writeNav" @click="$router.push('/write_essay')">
                        <i class="el-icon-edit-outline navIcon"></i>
                        <div class="navTitle c-1 f-14">写文章</div>
                    </span>
                    <span class="navItem writeNav">
                        <i class="el-icon-setting navIcon"></i>
                        <div class="navTitle c-1 f-14">写想法</div>
                    </span>
                    <span class="navItem writeNav" @click="$router.push('/write_ask')">
                        <i class="el-icon-s-operation navIcon"></i>
                        <div class="navTitle c-1 f-14">提问</div>
                    </span>
                </div>
            </el-card>

            <el-card class="box-card mt-10">
                <div class="GlobalWrite">
                    <span class="navItem followNav border-r" @click="myFollowDialog = true">
                        <p class="f-14 c-5 mb-5">关注了</p>
                        <div class="navTitle c-1 f-18 fw-600">{{linkObj.myLinkUserCount?linkObj.myLinkUserCount:0}}</div>
                    </span>
                    <span class="navItem followNav" @click="followMeDialog = true">
                        <p class="f-14 c-5 mb-5">关注者</p>
                        <div class="navTitle c-1 f-18 fw-600">{{linkObj.linkMeCount?linkObj.linkMeCount:0}}</div>
                    </span>
                </div>
            </el-card>

            <el-card v-loading="linkCountLoading" class="box-card mt-10">
                <ul class="GlobalRelated">
                    <li>
                        <div class="">
                            <div class="logo logo1"></div>
                        </div>
                        <div>收藏的回答</div>
                        <div class="GlobalRelated-Number">
                            <p>{{linkObj&&linkObj.linkAnswerCount?linkObj.linkAnswerCount:0}}</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <div class="logo logo2"></div>
                        </div>
                        <div>关注的问题</div>
                        <div class="GlobalRelated-Number">
                            <p>{{linkObj&&linkObj.linkAskCount?linkObj.linkAskCount:0}}</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <div class="logo logo3"></div>
                        </div>
                        <div>收藏的文章</div>
                        <div class="GlobalRelated-Number">
                            <p>{{linkObj&&linkObj.linkArticleCount?linkObj.linkArticleCount:0}}</p>
                        </div>
                    </li>
                </ul>
            </el-card>
        </div>


        <el-dialog
        class="followDialog"
        title="我关注的"
        :visible.sync="myFollowDialog"
        width="688px">
        </el-dialog>

        <el-dialog
        class="followDialog"
        title="关注我的"
        :visible.sync="followMeDialog"
        width="688px">
            <ul class="dialogUl">
                <li>
                    
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        fixed:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            linkObj:{},
            linkCountLoading:false,
            followMeDialog:false,
            myFollowDialog:false,
            followMeDialog:false
        }
    },
    mounted(){
        this.getLinkCount()
    },
    methods:{
        getLinkCount(){
            this.linkCountLoading = true
            this.axios.get('/mine/linkCount')
            .then(res=>{
                if(res) this.linkObj = res
                this.linkCountLoading = false
            })
        },

        openFollow(){

        }
    }
}
</script>

<style lang="less">
.right-sider{
    width: 297px;
    .el-card__body{
        padding: 0!important;
    }
    .GlobalWrite{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        overflow: visible;
        .navItem{
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            cursor: pointer;
            -webkit-box-flex: 0;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            .navIcon{
                color: #8590a6;
                margin-bottom: 10px;
                font-size: 18px;
            }
        }

        .writeNav{
            height: 94px;
            -ms-flex: 0 0 99px;
            flex: 0 0 99px;
        }
        .followNav{
            height: 90px;
            -ms-flex: 0 0 148px;
            flex: 0 0 148px;
        }


        .navItem:hover{
            background-color: #f9f9f9;
        }
    }

    .GlobalRelated{
        padding: 8px 0;
        li{
            font-size: 14px;
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            color: #8590A6;
            display: flex;
            align-items:center;
            cursor: pointer;
            .logo{
                display: inline-block;
                width: 14px;
                height: 14px;
                
                background-size:100% 100%;
                background-repeat:no-repeat;
                margin-right: 8px;
                vertical-align: -1px;
            }
            .logo1{
                background-image: url('../assets/img/collect.png');
            }
            .logo2{
                background-image: url('../assets/img/ask_logo.png');
                width: 15px;
                height: 15px;
                vertical-align: -2px;
            }
            .logo3{
                background-image: url('../assets/img/article_logo.png');
                width: 15px;
                height: 15px;
                vertical-align: -2px;
            }
            .GlobalRelated-Number{
                margin-left: auto;
                display: flex;
                align-items:center;
                p{
                    font-size: 12px;
                    padding: 6px 9px;
                    height: 15px;
                    line-height: 15px;
                    background-color: #f6f6f6;
                    border-radius: 3px;
                }
            }
        }
        li:hover{
            background-color: #f6f6f6;
            .GlobalRelated-Number{
                p{
                    background-color: #fff;
                }
            }
        }
    }

}

.followDialog{
    .el-dialog__body{
        padding: 0;
    }
}

</style>