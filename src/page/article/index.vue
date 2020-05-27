<template>
  <div>
    <div class="muora-container" v-loading="articleLoading">
      <div class="muora-main">
        <el-card class="box-card">
          <section class="pt-20 pb-20">
            <h1 class="f-24 fw-600 c-1 mb-20">
              {{article.title}}
            </h1>

            <div class="author-title mb-10">
              <span class="cursor_pointer">
                <!-- <img :src="article" alt=""> -->
                <el-avatar shape="circle" :size="40" :src="article.avatar"></el-avatar>
              </span>
              <div class="ml-10">
                <div class="f-14 lh-14 c-2 mb-8">
                  <span class="cursor_pointer">{{article.author_name}}</span>
                </div>
                <div class="flex f-12 lh-12 c-3">
                  {{article.time}}&emsp;字数 {{article.wordCount}}&emsp;阅读 {{article.read}}
                </div>
              </div>
            </div>
            <article v-html="article.content?article.content:''">
            </article>
          </section>
        </el-card>

        <el-card class="box-card mt-10 pb-20">
          <section class="art-comment">
            <div class="flex mb-30">
              <!-- <img  :src="avatar"> -->
              <div class="mr-10" style="width:40px">
                <el-avatar shape="circle" :size="40" :src="avatar"></el-avatar>
              </div>
             
              <div style="width:100%">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="写下你的评论..."
                  v-model="commentContent"
                  @focus="commentFocus">
                </el-input>
                
                <div v-show="submitActive" class="text-r mt-15" style="width:100%;">
                  <el-button type="primary" size="mini" round :disabled="!commentContent" :loading="commentLoading" @click="submiComment">发 布</el-button>
                  <el-button class="ml-5" size="mini" round @click="cancelReply">取 消</el-button>
                </div>
              </div>
            </div>
            
            <h3>
              <div class="comment-count">
                <span class="f-18 mr-10 lh-18 c-1" style="height:20px">全部评论</span>
                <span class="fw-400 f-14">{{this.commentCount}}</span>
              </div>
            </h3>
      
            <div class="comment-item" v-for="(c,i) in commentList" :key="i">
              <div class="mr-10" style="width:24px">
                <el-avatar shape="square" :size="24" :src="c.avatar"></el-avatar>
              </div>
              <div style="width:619px">
                <div class="flex between lh-24">
                  <div class="fw-500 f-14 c-2 cursor_pointer">{{c.userName}}</div>
                  <div class="f-12 c-3">{{c.time}}</div>
                </div>
                
                <!-- <div class="f-14 c-2 lh-22 mt-5" style="width:602px">
                  {{c.content}}
                </div> -->
                <p class="f-14 c-2 lh-22 mt-5" v-html="c.content"></p>
                <div class="flex f-14 mt-10 lh-20" style="color:#B0B0B0">
                  <!-- <div class="mr-15 cursor_pointer like" :class="isLike(c.like)?'islike':'nolike'" @click="likeComment(c._id,i)">
                    <i class="in-block like-ico mr-5"></i>{{c.likeCount?c.likeCount:'赞'}}
                  </div> -->
                  <div class="likeCommentBox cursor_pointer" :class="isLike(c.like)?'isMeLikeComment':''" @click="likeComment(c._id,i)">
                      <span class="likeComment"></span>{{c.likeCount?c.likeCount:'赞'}}
                  </div>
                  <!-- <div class="mr-15 cursor_pointer reply" @click="openFirstInput(i,c)">
                    <span class="reply-ico in-block mr-5"></span>回复
                  </div> -->
                  <div class="replyBox cursor_pointer ml-15" @click="openFirstInput(i,c)">
                    <span class="reply"></span>回复
                  </div>
                </div>

                <div class="reply_box flex" v-for="(reply,replyIndex) in c.reply" :key="replyIndex">
                  <div class="mr-10" style="width:24px">
                    <el-avatar shape="square" :size="24" :src="reply.avatar"></el-avatar>
                  </div>
                  <div style="width:584px">
                    <div class="flex between lh-24">
                      <div class="fw-500 f-14 c-2">
                        <span>{{reply.from_name}}</span>
                        <span class="c-3"><span v-if="reply.from_id==article.author_id">(作者)</span> 回复 </span>
                        <span>{{reply.to_name}}</span>
                      </div>
                      <div class="f-12 c-3 lh-22">{{reply.time}}</div>
                    </div>
                    <p class="f-14 c-2 lh-22 mt-5" v-html="reply.content"></p>
                    <div class="flex f-14 mt-10 lh-20" style="color:#999">
                      <div class="replyBox cursor_pointer" @click="openSecondInput(i,reply)">
                        <span class="reply"></span>回复
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div v-if="replyIndex === i" class="mt-15" style="width:619px">
                  <el-input
                    type="textarea"
                    :rows="3"
                    :placeholder="`回复 ${replyInfo.to_name}`"
                    v-model="replyContent"
                    ref="replyInput">
                  </el-input>
                  
                  <div v-show="true" class="text-r mt-10" style="width:100%;">
                    <el-button type="success" size="mini" :disabled="!replyContent" round :loading="commentLoading" @click="submitReply()">发 布</el-button>
                    <el-button class="ml-5" size="mini" round @click="cancelReply">取 消</el-button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { successMessage } from '@/lib/alert'
import { textToHtml,getCookie,uncompile,computeTime } from '@/lib'
export default {
  props: {
    avatar: { type: String },
    userId: { type: String }
  },

  data(){
    return {
      articleLoading:true,
      commentContent:'',
      commentLoading:false,
      article_id:'',
      article:{},
      submitActive:false,
      commentList:[],
      commentCount:0, // 评论总条数
      currentComment:1, // 当前评论页
      replyContent:'',
      replyIndex:null,
      replyInfo:{}
    }
  },
  
  computed:{
    isLike(like){
      return (like) => like.includes(this.userId)
    }
  },
  created(){
    this.article_id = this.$route.query._id
  },
  mounted(){
    this.getArticle()
  },
  methods:{
    // 获取文章
    getArticle(){
      this.axios.get(`article/${this.article_id}`)
      .then(res=>{
        this.getComment()
        this.article = res
        this.article.wordCount = res.content.replace(/<[^<>]+>/g,"").length
        this.article.time = this.$moment(res.createdAt).format('YYYY-MM-DD')
        this.articleLoading = false
      })
    },

    commentFocus(){
      this.submitActive = true
    },

    // 评论发布
    submiComment(){
      this.commentLoading = true
      this.commentContent = textToHtml(this.commentContent)
      let params = {
        type: '1',
        typeId: this.article_id,
        content: this.commentContent
      }
      this.axios.post('/comment',params)
      .then(res=>{
        this.commentLoading = false 
        if(res) {
          console.log(res)
          successMessage('评论发布成功')
          res.time = computeTime(res.createdAt)
          res.avatar = this.avatar
          res.reply = []
          this.commentCount++
          this.commentContent = ''
          this.submitActive = false
          this.commentList.unshift(res)
        }
      },err=> this.commentLoading = false)
    },

    //获取评论
    getComment(){
      this.axios.get('/comment',{
        params:{
          typeId:this.article_id,
          currentPage: this.currentComment,
          pageSize:5
        }
      }).then(res=>{
        if(res&&res.count){
          for(let x of res.list){
            x.time =  computeTime(x.createdAt)
            if(x.reply && x.reply.length){
              for(let t of x.reply){
                t.time = computeTime(t.createdAt)
              }
            }
            
          }
          this.commentList = this.commentList.concat(res.list)
          this.commentCount = res.count
        }
      })
    },
    
    // 评论点赞
    likeComment(comment_id,index){
      this.axios.post('/comment/like',{comment_id})
      .then(res=>{
        if(res===1) {
          this.commentList[index].like.push(this.userId)
          this.commentList[index].likeCount++
        }else{
          for(let i=0;i<this.commentList[index].like.length;i++){
            if (this.commentList[index].like[i] == this.userId) this.commentList[index].like.splice(i, 1)
          }
          this.commentList[index].likeCount--
        }
      })
    },

    // 点击一级回复
    openFirstInput(i,c){
      this.replyIndex = i
      this.replyContent = ''
      this.replyInfo = {
        comment_id:c._id,
        reply_id:c._id,
        to_id:c.userId,
        to_name:c.userName,
      }
      let timer = setTimeout(()=>{
        this.$refs.replyInput[0].focus() //使输入框获取焦点
        clearTimeout(timer)
      },100)
    },

    openSecondInput(i,c){
      this.replyIndex = i
      this.replyContent = ''
      this.replyInfo = {
        comment_id:c.comment_id,
        reply_id:c._id,
        to_id:c.from_id,
        to_name:c.from_name
      }
      let timer = setTimeout(()=>{
        this.$refs.replyInput[0].focus() //使输入框获取焦点
        clearTimeout(timer)
      },100)
    },
    
    // 取消评论
    cancelReply(){
      this.submitActive=false // 回复文章的评论框
      this.commentContent = '' // 清空文章回复框

      this.replyIndex = null //关闭一级回复框
      this.replyContent = ''//清空框内容
      this.replyInfo = {}
    },

    // c => 被评论的所有信息
    submitReply(){
      this.replyContent = textToHtml(this.replyContent)
      let params = {
        content:this.replyContent,
        comment_id:this.replyInfo.comment_id,
        reply_id:this.replyInfo.reply_id,
        to_id:this.replyInfo.to_id,
        to_name:this.replyInfo.to_name
      }
      this.axios.post('/comment/create_reply',params)
      .then(res=>{
        if(res){
          res.time = computeTime(res.createdAt)
          this.commentList[this.replyIndex].reply.push(res)
          this.cancelReply()
        }
      })
    }

  }
}
</script>

<style lang="less">

.art-comment{
  padding-top: 20px;
  .el-textarea__inner{
    background-color: #fafafa;
  }

  h3{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-left: 12px;
    border-left: 4px solid #ec7259;
    font-size: 18px;
    font-weight: 500;
    height: 20px;
    line-height: 20px;
    .comment-count{
      display: flex;
      align-items: center;
    }
  }

  
  
}

.comment-item {
    display: flex;
    align-items: flex-start;
    padding: 18px 0 16px 0;
    // border-bottom: 1px solid #eee;
    .avatar{
      width: 24px;
      height: 24px;
      display: block;
      border: none;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .like-ico{
      width:16px;
      height:17px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      vertical-align: -3px;
    }
    .islike{
      color: #ec7259;
      i{
        background-image: url('../../assets/img/comment_like1.png');
      }
    }
    .nolike{
      i{
        background-image: url('../../assets/img/comment_like.png');
      }
    }
    .reply-ico{
      width:15px;
      height:15px;
      background-image: url('../../assets/img/comment.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      vertical-align: -3px;
    }
    .like:hover{
      color: #ec7259;
      .like-ico{
        background-image: url('../../assets/img/comment_like1.png');
      }
    }
    .reply:hover{
      color: #777;
      .reply-ico{
        background-image: url('../../assets/img/comment1.png');
      }
    }

  }

  // .comment-item:nth-child(1) {
  //   border: none;
  // }
</style>