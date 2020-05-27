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
                <!-- <img :src="avatar?avatar:'/static/img/user_cover.jpg'" width="160px" height="160px"> -->
                <el-avatar shape="square" :size="160" :src="avatar"></el-avatar>
              </div>
            </div>
            <div class="PersonalHader-content">
              <div class="PersonalHader-contentHead">
                <h1 class="in-block">
                  <span class="PersonalHader-name c-1">{{username?username:'xxxx'}}</span>
                </h1>
                <!-- <span class="PersonalHader-headline">node工程师</span> -->
              </div>
              <div class="c-2 PersonalHader-headline">
                <i class="el-icon-postcard f-14"></i>
                <span class="f-14 ml-5">{{intro}}</span> 
              </div>
              <div class="c-2 PersonalHader-headline mt-5">
                <i class="el-icon-chat-dot-round f-14"></i>
                <span class="PersonalHader-headline f-14 ml-5">{{explan}}</span>
              </div>
              <div class="PersonalHader-button">
                <el-button size="medium" plain @click="$router.push('/personal/edit')">编辑个人资料</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="PersonalMain">
      <div class="PersonalMain-column card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="我的文章" name="arts">
            <PersonArts ref="PersonArts"/>
          </el-tab-pane>
          <el-tab-pane label="我的提问" name="asks">
            <PersonAsks ref="PersonAsks"/>
          </el-tab-pane>
          <el-tab-pane label="我的回答" name="answers">
            <PersonAnswers ref="PersonAnswers"/>
          </el-tab-pane>
          <el-tab-pane label="我的想法" name="idea">
            <PersonIdea ref="PersonIdea"/>
          </el-tab-pane>
        </el-tabs>
      </div>

      <GlobalSider :fixed="false"/>
      
    </div>
  </div>
</template>

<script>
import PersonArts from './Arts'
import PersonAsks from './Asks'
import PersonAnswers from './Answers'
import PersonIdea from './Idea'
import GlobalSider from '@/components/GlobalSider'
import {getCookie,uncompile} from '@/lib'
export default {
  components:{
    PersonArts,
    PersonAsks,
    PersonAnswers,
    PersonIdea,
    GlobalSider
  },
  props:{
    username: { type: String },
    avatar: { type: String },
    intro: { type: String },
    explan: { type: String },
  },
  data(){
    return{
      cover_img:require('../../../static/img/user_cover.jpg'),
      userId:uncompile(getCookie('_device_id')),
      activeName: 'arts',
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="less">


.PersonalMain{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 1000px;
  padding: 0 16px;
  margin: 10px auto;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  .PersonalMain-column{
    width: 694px;
    margin-right: 10px;
    .el-tabs__item{
      padding: 0 15px;
    }
    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left:25px;
    }
    .el-tabs__nav-wrap::after{ height:1px; }
    .el-tabs__header{
      margin-bottom: 0;
    }
  }
  
}
</style>
