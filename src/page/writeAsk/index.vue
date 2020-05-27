<template>
    <div>
        
        <div class="write_essay">
            
            <keep-alive>
                <div class="write_box mt-15">
                    <div class="title_box">
                        <el-input class="write_title" v-model="title" placeholder="写下你的问题"></el-input>
                        <el-button class="submit_btn" type="primary" :disabled="!title" size="medium" plain @click="submit">发布问题</el-button>
                    </div>
                    
                    <UE ref="ue" minHeight="200" placeholder="准确地描述问题更容易得到解答,可不填"/>
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
    components:{
        UE
    },
    data() {
        return {
            title:null,
            
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
            let begin = ue.getText(0, 75)
            let content = ue.container.firstChild.innerHTML
            let params = {
                title: this.title,
                content: content,
                word_count,
                begin
            }
            this.axios.post('/ask',params)
            .then(res => {
                if(res){
                    successMessage('发布问题成功！')
                    this.$router.push('/question')
                }
            })
        },

    }
}
</script>

<style lang="less">
    
    
    
</style>