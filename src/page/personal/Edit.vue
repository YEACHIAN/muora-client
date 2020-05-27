<template>
    <div>
        <!-- <div class="muora-container">
            <el-card class="box-card">
                <div>

                </div>
            </el-card>
        </div> -->

        <div class="PersonalHader">
            <div class="card">
                <div class="UserCover">
                <!-- <el-image  fit="cover"></el-image> -->
                    <img class="fit-cover" style="width: 100%; height: 100%" :src="'/static/img/user_cover1.jpg'">
                </div>
                <div class="PersonalHader-wrapper">
                    <div class="PersonalHader-main">
                        <div class="PersonalHader-avatar">
                            <div class="UserAvatar">
                                <el-upload
                                class="avatar-uploader"
                                action="/api/upload"
                                :headers="{ 'Authorization' : 'Bearer ' + token }"
                                :show-file-list="false"
                                :on-success="avaSuccess"
                                :on-error="avaError">
                                    <el-avatar shape="square" :size="160" :src="info.avatar"></el-avatar>
                                    <!-- <img :src="info.avatar?info.avatar:'/static/img/user_cover.jpg'"  class="avatar"> -->
                                </el-upload>
                            </div>
                            <!-- <div class="UserAvatar">
                                <img :src="info.avatar?info.avatar:'/static/img/user_cover.jpg'" width="160px" height="160px">
                            </div> -->
                        </div>
                        <div class="PersonalHader-content">
                            <div class="flex">
                                <h1 class="in-block">
                                    <span class="c-1 f-26 lh-30">{{username}}</span>
                                </h1>
                                <span class="ml-auto f-14 lh-30 c-5 cursor_pointer" @click="$router.push('/personal')">
                                    返回我的主页<i class="el-icon-arrow-right" style="vertical-align:-1px"></i>
                                </span>
                            </div>
                            
                            <ul class="mt-10">
                                <li class="infoColumn">
                                    <h3 class="infoLabel">性别</h3>
                                    <div class="infoContent">
                                        <el-radio v-model="info.gender" label="男">男</el-radio>
                                        <el-radio v-model="info.gender" label="女">女</el-radio>
                                    </div>
                                </li>

                                <li class="infoColumn">
                                    <h3 class="infoLabel">一句话介绍</h3>
                                    <div class="infoContent">
                                        <el-input v-model="info.intro" size="medium" placeholder="一句话介绍你自己"></el-input>
                                    </div>
                                </li>

                                <li class="infoColumn">
                                    <h3 class="infoLabel">个人简介</h3>
                                    <div class="infoContent">
                                        <el-input v-model="info.explan" size="medium" placeholder="积硅步以至千里，积怠惰以致深渊。"></el-input>
                                    </div>
                                </li>
                            </ul>
                            
                            <div class="mt-20" style="padding-left:180px">
                                <el-button class="mr-20" type="primary" @click="submit">保&emsp;存</el-button>
                                <el-button type="danger" plain @click="reset">重&emsp;置</el-button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
                
    </div>
</template>

<script>
import { errorMessage,successMessage } from '@/lib/alert'
import { getCookie } from '@/lib'
export default {
    props:{
        username: { type: String }
    },
    data(){
        return{
            token:getCookie('tz'),
            info:{},
            info_bf:{}
        }
    },
    mounted(){
        this.getMyInfo()
    },
    methods:{
        getMyInfo(){
            this.axios.get('/mine/basicInfo')
            .then(res=>{
                if(res) {
                    this.info = { ...res }
                    this.info_bf = { ...res }
                }
            })
        },

        // 保存
        submit(){
            let params = {
                gender: this.info.gender,
                intro: this.info.intro,
                explan: this.info.explan,
                avatar:this.info.avatar
            }
            var reg = new RegExp('^[ ]+$');
            if(!params.intro||reg.test(params.intro)) errorMessage('介绍不能为空')
            if(!params.explan||reg.test(params.explan)) delete params.explan

            this.axios.post(`/user/update`,params)
            .then(res=>{
                successMessage('保存成功')
                setTimeout(()=>{
                    window.location.href = '/personal'
                },300)
            })
        },

        // 重置
        reset(){
            this.info = { ...this.info_bf }
        },

        avaSuccess(res, file, fileList){
            this.info.avatar = res.data
            console.log(this.info.avatar)
            this.$forceUpdate()
        },

        // 头图上传失败回调
        avaError(err, file, fileList){
            errorMessage('头像上传失败')
        }
    }
}
</script>

<style lang="less">

.infoColumn{
    padding: 30px 0;
    border-bottom: 1px solid #ebebeb;
    font-size: 15px;
    position: relative;
    .infoLabel{
        color: #444;
        position: absolute;
        line-height: 36px;
    }
    .infoContent{
        padding: 0 160px 0 140px;
        line-height: 36px;
    }
}

.PersonalHader-avatar{
    .avatar-uploader .el-upload {
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 160px;
    height: 160px;
    display: block;
  }
}
</style>