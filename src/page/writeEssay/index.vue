<template>
    <div>
        
        <div class="write_essay">
            
            <keep-alive>
                <div class="write_box mt-15" :style="`min-height:${fullHeight-130}px`">
                    <el-upload
                    class="avatar-uploader pl-15 pr-15"
                    action="/api/upload"
                    :headers="{ 'Authorization' : 'Bearer ' + token }"
                    :show-file-list="false"
                    :on-success="avaSuccess"
                    :on-error="avaError">
                        <img v-if="cover_img" :src="cover_img" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="title_box">
                        <el-input class="write_title" v-model="title" maxlength="40" placeholder="请输入标题（最多40个字）"></el-input>
                        <el-button class="submit_btn" type="primary" :disabled="!title" size="medium" plain @click="submit">发布文章</el-button>
                    </div>
                    
                    <UE ref="ue" minHeight="200" placeholder="写回答..."/>
                </div>
            </keep-alive>
        </div>

    </div>
</template>

<script>
import UE from '@/components/UE'
import { errorMessage, successMessage } from '@/lib/alert'
import { getCookie } from '@/lib'
export default {
    name: 'FuncFormsEdit',
    components:{
        UE
    },
    props: {
      fullHeight: { type: Number }
    },
    data() {
        return {
            title:null,
            content: null,
            token:getCookie('tz'),
            cover_img:null,
        }
    },
    mounted(){
    },
    methods: {
        submit(){ 
            //  让外网图片也能打得开
            // let reg = /http(s*):\/\//g
            // let content = this.editor.container.firstChild.innerHTML.replace(reg,'https://images.weserv.nl/?url=')
            let ue = this.$refs.ue.editor
            let word_count = ue.getLength()-1
            if(word_count<9) return errorMessage('正文至少输入 9 个字')
            let begin = ue.getText(0, 75)
            let content = ue.container.firstChild.innerHTML
            let params = {
                title: this.title,
                content: content,
                cover_img: this.cover_img,
                word_count,
                begin
            }
            this.axios.post('/article',params)
            .then(res => {
                if(res){
                    successMessage('文章发布成功！')
                    this.$router.push('/discovery')
                }
            })
        },
        // 头图上传成功回调
        avaSuccess(res, file, fileList){
            this.cover_img = res.data
            successMessage('图片上传成功')
        },

        // 头图上传失败回调
        avaError(err, file, fileList){
            errorMessage('图片上传失败')
        }
       
    },
}
</script>

<style lang="less">
    
    // 上传头图样式
    .avatar-uploader .el-upload {
        width: 100%;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        width: 100%;
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        display: block;
    }
</style>