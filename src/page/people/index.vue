<template>
    <div>
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
                            <el-avatar shape="square" :size="160" :src="peopleInfo.avatar"></el-avatar>
                        </div>
                    </div>
                    <div class="PersonalHader-content">
                        <div class="PersonalHader-contentHead">
                            <h1 class="in-block">
                                <span class="PersonalHader-name c-1">{{peopleInfo.username?peopleInfo.username:'xxxx'}}</span>
                            </h1>
                            <!-- <span class="PersonalHader-headline">node工程师</span> -->
                        </div>
                        <div class="c-2 PersonalHader-headline">
                            <i class="el-icon-postcard f-14"></i>
                            <span class="f-14 ml-5">{{peopleInfo.intro}}</span> 
                        </div>
                        <div class="c-2 PersonalHader-headline mt-5">
                            <i class="el-icon-chat-dot-round f-14"></i>
                            <span class="PersonalHader-headline f-14 ml-5">{{peopleInfo.explan?peopleInfo.explan:'积硅步以至千里，积怠惰以致深渊。'}}</span>
                        </div>
                        <div class="PersonalHader-button" @click="linkUser">
                            <el-button v-if="isLinkUser===-1" type="primary" icon="el-icon-plus" size="medium">关注{{peopleInfo.gender&&peopleInfo.gender=='女'?'她':'他'}}</el-button>
                            <el-button v-else type="info" icon="el-icon-minus" size="medium">取消关注</el-button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            avatar:'',
            username:'',
            intro:'',
            explan:'',
            peopleId:'',
            peopleInfo:{},
            isLinkUser:-1
        }
    },
    mounted(){
        this.peopleId = this.$route.query._id
        this.getPeopleInfo()
        this.getIsLinkUser()
    },

    methods:{
        getPeopleInfo(){
            this.axios.get(`/user/${this.peopleId}`)
            .then(res=>{
                this.peopleInfo = res
            })
        },

        getIsLinkUser(){
            this.axios.get(`/mine/isLinkUser/${this.peopleId}`)
            .then(res=>{
                this.isLinkUser = res
            })
        },


        linkUser(){
            this.axios.get(`/mine/linkUser/${this.peopleId}`)
            .then(res=>{
                this.isLinkUser = res
            })
        }
    }

}
</script>