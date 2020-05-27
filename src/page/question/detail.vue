<template>
    <div>
        <div class="QuestionHeader">
            <div class="QuestionHeader-content">
                <div class="QuestionHeader-main">
                    <div>
                        <h1 class="f-22 lh-30 c-1 fw-600 mb-10">
                            {{ask.data?ask.data.title:''}}
                        </h1>
                        <article v-if="ask.data&&ask.data.word_count" v-html="ask.data.content"></article>
                    </div>
                    <div class="mt-10">
                        <el-button v-if="!ask.isLink||ask.isLink==-1" type="primary" size="small" @click="collectQuest()">关注问题</el-button>
                        <el-button v-else type="info" size="small" @click="collectQuest()">取消关注</el-button>
                        <el-button type="primary" size="small" icon="el-icon-edit" plain @click="isWrite = !isWrite">写回答</el-button>
                    </div>
                </div>
                <div class="QuestionHeader-side">
                    <div class="flex">
                        <div class="pl-5 pr-5 border-r cursor_pointer ques_hover" style="width:100px">
                            <p class="f-14 lh-20 c-2 mb-10">关注者</p>
                            <p class="fw-18 c-1 fw-600">{{ask.linkCount?ask.linkCount:0}}</p>
                        </div>
                        <div class="pl-5 pr-5 border-r" style="width:100px">
                            <p class="f-14 lh-20 c-2 mb-10">被浏览</p>
                            <p class="fw-18 c-1 fw-600">{{ask.data?ask.data.read:0}}</p>
                        </div>
                        <div class="pl-5 pr-5" style="width:110px">
                            <p class="f-14 lh-20 c-2 mb-10">提问者</p>
                            <p class="fw-18 c-1 fw-600">{{ask.data&&ask.data.questioner_name?ask.data.questioner_name:''}}</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="muora-container">
            <div class="muora-main">
                <el-card v-if="isWrite" class="box-card pt-10 pb-10 p-r mb-10">
                    <el-button class="p-a" style="top:12px;right:20px" type="primary" size="small" @click="submitAnswer">提交回答</el-button>
                    <UE ref="ue" minHeight="200" placeholder="写回答..."/>
                </el-card>

                <el-card v-if="answer.count" class="box-card pb-10">
                    <div class="answerList">
                        <div class="listHeader">
                            <h4>{{answer.count}} 个回答</h4>
                        </div>

                        <div class="listItem" v-for="(item,index) in answer.list" :key="index">
                            <div class="author-title">

                                <div class="cursor_pointer" style="height:38px">
                                    <!-- <img :src="article" alt=""> -->
                                    <el-avatar shape="square" :size="38" :src="item.answererId.avatar?item.answererId.avatar:''"></el-avatar>
                                </div>

                                <div class="ml-15">
                                    <div v-if="item.answererId&&item.answererId.username" class="f-15 lh-15 c-1 fw-600 cursor_pointer mb-8">
                                        {{item.answererId.username}}
                                    </div>
                                    <div class="flex f-14 lh-14 c-2">
                                        {{item.answererId.intro}}
                                    </div>
                                </div>

                            </div>
                            
                            <div class="mt-15">
                                <p v-show="item.agreeCount" class="mb-5 c-3 f-14">{{item.agreeCount}} 人赞同了该回答</p>
                                <article v-html="item.content"></article>
                            </div>

                            <div class="mt-15 f-14 lh-14 c-3">
                                发布于 {{item.createTime}}
                            </div>

                            <div class="mt-15 flex align-center">
                                <el-button v-if="isAgree(item.agree)" type="primary" size="small" icon="el-icon-caret-top" plain @click="agreeAnswer(item._id,index)">赞同<span v-show="item.agreeCount" >{{item.agreeCount}}</span></el-button>
                                <el-button v-else type="primary" size="small" icon="el-icon-check" @click="agreeAnswer(item._id,index)">已赞同<span v-show="item.agreeCount"> {{item.agreeCount}}</span></el-button>
                                
                                <div v-if="commentIndex === index" class="commentBox cursor_pointer ml-40" @click="undoComment(index)">
                                    <span class="comment"></span>收起评论
                                </div>
                                <div v-else class="commentBox cursor_pointer ml-40" @click="getAnswerComment(item._id,index)">
                                    <span class="comment"></span>{{item.commentCount?`${item.commentCount} 条评论`:'添加评论'}}
                                </div>

                                <div class="collectBox cursor_pointer ml-30" @click="collectAnswer(item._id,index)">
                                    <span class="collect"></span>{{item.isCollect===1?'已收藏':'收藏'}}
                                </div>

                                <div class="likeBox cursor_pointer ml-30" @click="likeAnswer(item._id,index)">
                                    <span class="like"></span>{{ isLikeAnswer(item.like)?'取消喜欢':'喜欢' }}
                                </div>

                            </div>

                            <el-card v-if="commentIndex === index" v-loading="commentLoading" class="box-card mt-12 pb-15">
                                <div class="answerList">
                                    <div class="listHeader">
                                        <h4>{{item.commentCount?`${item.commentCount} 条评论`:'还没有评论'}}</h4>
                                    </div>

                                    <div class="comment-item" v-for="(c,i) in item.commentList" :key="i">
                                        <div class="mr-10" style="width:24px">
                                            <el-avatar shape="square" :size="24" :src="c.avatar"></el-avatar>
                                        </div>
                                        <div >
                                            <div class="flex between lh-24" style="width:579px">
                                                <div class="fw-500 f-14 c-2 cursor_pointer">{{c.userName}}</div>
                                                <div class="f-12 c-3">{{c.time}}</div>
                                            </div>
                                            
                                            <p class="f-14 c-2 lh-22 mt-5" v-html="c.content"></p>
                                            <div class="flex f-14 mt-10 lh-20" style="color:#B0B0B0">
                                                <!-- <div class="mr-15 cursor_pointer like" :class="isLikeComment(c.like)?'islike':'nolike'" @click="likeComment(c._id,i)">
                                                    <i class="in-block like-ico mr-5"></i>{{c.likeCount?c.likeCount:'赞'}}
                                                </div> -->

                                                <div class="likeCommentBox cursor_pointer" :class="isMeLikeComment(c.like)?'isMeLikeComment':''" @click="likeComment(index,c._id,i)">
                                                    <span class="likeComment"></span>{{c.likeCount?c.likeCount:'赞'}}
                                                </div>

                                                <div class="replyBox cursor_pointer ml-15" @click="openFirstInput(i,c)">
                                                    <span class="reply"></span>回复
                                                </div>
                                            </div>
                                            
                                            <div class="reply_box flex" v-for="(reply,reply_index) in c.reply" :key="reply_index">
                                                <div class="mr-10" style="width:24px">
                                                    <el-avatar shape="square" :size="24" :src="reply.avatar"></el-avatar>
                                                </div>
                                                <div >
                                                    <div class="flex between lh-24" style="width:545px">
                                                        <div class="fw-500 f-14 c-2">
                                                            <span>{{reply.from_name}}</span>
                                                            <span class="c-3"><span v-if="reply.from_id==item.answererId">(作者)</span> 回复 </span>
                                                            <span>{{reply.to_name}}</span>
                                                        </div>
                                                        <div class="f-12 c-3">{{reply.time}}</div>
                                                    </div>
                                                    <p class="f-14 c-2 lh-22 mt-5" v-html="reply.content"></p>
                                                    <div class="flex f-14 mt-10 lh-20" style="color:#999">
                                                        <div class="replyBox cursor_pointer" @click="openSecondInput(i,reply)">
                                                            <span class="reply"></span>回复
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </div>

                                            <div v-if="replyIndex === i" class="mt-15">
                                                <el-input
                                                    type="textarea"
                                                    :rows="3"
                                                    :placeholder="`回复 ${replyInfo.to_name}`"
                                                    v-model="replyContent"
                                                    ref="replyInput">
                                                </el-input>
                                                
                                                <div v-show="true" class="text-r mt-10" style="width:100%;">
                                                    <el-button type="success" size="mini" :disabled="!replyContent" round @click="submitReply(index,i)">发 布</el-button>
                                                    <el-button class="ml-5" size="mini" round @click="closeReply">取 消</el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- <div v-if="item.commentCount<item.pageSize" class="text-c"> -->
                                        <el-pagination
                                        class="text-c"
                                        :hide-on-single-page="item.commentCount<=item.pageSize"
                                        layout="prev, pager, next"
                                        :pager-count="5"
                                        :page-size="item.pageSize"
                                        :total="item.commentCount"
                                        @current-change="currentChange">
                                        </el-pagination>
                                    <!-- </div> -->
                                    
                                    <div class="p-r" style="padding-right:90px">
                                        <el-input
                                            type="textarea"
                                            placeholder="写下你的评论..." 
                                            :rows="1"
                                            :autosize="true"
                                            resize="none"
                                            size="small"
                                            v-model="commentContent">
                                        </el-input>

                                        <el-button class="p-a" style="right:0;bottom:0" :disabled="!commentContent" icon="el-icon-upload2" type="primary" size="small" @click="submitComment(item._id,index)">发布</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import UE from '@/components/UE'
import { errorMessage, successMessage } from '@/lib/alert'
import { textToHtml, computeTime } from '@/lib'
export default {
    components:{
        UE
    },
    props:{
        userId: { type: String },
        username:{type:String},
        avatar:{type:String},
        intro:{type:String}
    },
    data(){
        return{
            isWrite:false,
            askId:'',
            ask:{},
            answer:{},
            currentPage:1,
            pageSize:5,
            commentContent:'',
            replyIndex:null,
            replyContent:'',
            commentIndex:null,
            commentLoading:false,
            currentAnswerId:'',
            currentAnswerIndex:null
        }
    },
    computed: {
        isAgree(agree){
            return (agree) => !agree.includes(this.userId)
        },
        isLikeAnswer(like){
            if(!like) return false
            return (like) => like.includes(this.userId)
        },
        isLikeComment(like){
            if(!like) return false
            return (like) => like.includes(this.userId)
        },
        isMeLikeComment(like){
            if(!like) return false
            return (like) => like.includes(this.userId)
        },
    },
    mounted(){
        this.askId = this.$route.query._id
        this.getQuestion()
        this.getAnswer()
    },
    methods:{
        getQuestion(){
            this.axios.get(`/ask/${this.askId}`)
            .then(res=>{
                if(res&&res.data){
                    this.ask = res
                    console.log("getQuestion -> this.ask", this.ask)
                }
            })
        },

        getAnswer(){
            this.axios.get('/answer/designAsk',{
                params:{
                    askId:this.askId,
                    currentPage:this.currentPage,
                    pageSize:this.pageSize
                }
            })
            .then(res=>{
                if(res){
                    for(let r of res.list){
                        r.createTime = this.$moment(r.createdAt).format("YYYY-MM-DD")
                    }
                    this.answer = res
                    console.log(this.answer)
                    this.currentPage++
                }
            })
        },

        // 收藏问题
        collectQuest(){
            
            this.axios.get(`/ask/collectQuest/${this.askId}`)
            .then(res => {
                if(res){
                    this.ask.isLink = res
                    this.ask.linkCount += res
                }
            })
        },
        
        // 提交回答
        submitAnswer(){
            let ue = this.$refs.ue.editor
            let word_count = ue.getLength()-1
            let begin = ue.getText(0, 86)
            let content = ue.container.firstChild.innerHTML
            let coverArr = []
            let coverImg=''
            content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match,capture)=> {
                coverArr.push(capture)
            });
            // 默认封面图为第一张图
            if(coverArr.length) coverImg = coverArr[0]
            if(!word_count&&!coverImg) return errorMessage('回答不能为空')
            let params = {
                askId: this.askId,
                content: content,
                word_count,
                begin,
                coverImg
            }
            this.axios.post('/answer',params)
            .then(res => {
                if(res){
                    res.createTime = this.$moment(res.createdAt).format("YYYY-MM-DD")
                    this.answer.list.unshift(res)
                    this.answer.count++
                    this.isWrite = false
                    successMessage('提交回答成功！')
                }
            })
        },

        // 赞同 / 取消赞同
        agreeAnswer(answerId,index){
            this.axios.post('/answer/agree',{answerId})
            .then(res=>{
                if(res===1) {
                    this.answer.list[index].agree.push(this.userId)
                    this.answer.list[index].agreeCount++
                }else{
                    for(let i=0;i<this.answer.list[index].agree.length;i++){
                        if (this.answer.list[index].agree[i] == this.userId) this.answer.list[index].agree.splice(i, 1)
                    }
                    this.answer.list[index].agreeCount--
                }
            })
        },

        // 喜欢 / 取消喜欢 回答
        likeAnswer(answerId,index){
            this.axios.post('/answer/like',{answerId})
            .then(res=>{
                if(res===1) {
                    this.answer.list[index].like.push(this.userId)
                    this.answer.list[index].likeCount++
                }else{
                    for(let i=0;i<this.answer.list[index].like.length;i++){
                        if (this.answer.list[index].like[i] == this.userId) this.answer.list[index].like.splice(i, 1)
                    }
                    this.answer.list[index].likeCount--
                }
            })
        },

        // 收藏文章
        collectAnswer(answerId,index){
            this.axios.post('/answer/collect',{answerId})
            .then(res=>{
                this.answer.list[index].isCollect = res
            })
        },
        

        // 清空评论信息
        closeComment(index){
            this.commentContent = ''
            this.answer.list[index].commentList = []
            this.answer.list[index].currentPage = 1,
            this.commentIndex = null
        },

        //清空回复信息
        closeReply(){
            this.replyIndex = null
            this.replyInfo = {}
            this.replyContent = ''
        },

        // 收起评论
        undoComment(index){
            this.closeComment(index)
            this.closeReply()
        },

        // 获取回复 评论
        getAnswerComment(answerId,index){
            this.commentLoading = true
            
            if(this.commentIndex != index) {
                this.closeComment(index)
                this.commentIndex = index
            }
            this.currentAnswerIndex = index
            this.currentAnswerId = answerId

            if(!this.answer.list[index].commentList) this.answer.list[index].commentList = []
            if(!this.answer.list[index].currentPage) this.answer.list[index].currentPage = 1
            this.answer.list[index].pageSize = 10
            this.axios.get('/comment',{
                params:{
                    typeId:answerId,
                    currentPage: this.answer.list[index].currentPage,
                    pageSize: this.answer.list[index].pageSize
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
                    this.answer.list[index].commentList = res.list
                    this.answer.list[index].commentCount = res.count
                    // this.answer.list[index].currentPage++
                }
                this.$forceUpdate()
                this.commentLoading = false
            },err=> this.commentLoading = false)
        },

        // 提交评论
        submitComment(answerId,index){
            if(!this.answer.list[index].commentList) this.answer.list[index].commentList = []
            this.commentContent = textToHtml(this.commentContent)
            let params = {
                type: '2',
                typeId: answerId,
                content: this.commentContent
            }
            this.axios.post('/comment',params)
            .then(res=>{
                if(res) {
                    successMessage('评论发布成功')
                    res.time = computeTime(res.createdAt)
                    res.avatar = this.avatar
                    res.reply = []
                    this.answer.list[index].commentCount++
                    this.commentContent = ''
                    this.answer.list[index].commentList.unshift(res)
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


        /**
         * 评论点赞
         * @param {Number} ai answerIndex
         * @param {String} comment_id commentId
         * @param {Number} ci commentIndex
         */
        likeComment(ai,comment_id,ci){
            this.axios.post('/comment/like',{comment_id})
            .then(res=>{
                if(res===1) {
                    this.answer.list[ai].commentList[ci].like.push(this.userId)
                    this.answer.list[ai].commentList[ci].likeCount++
                }else{
                    for(let i=0;i<this.answer.list[ai].commentList[ci].like.length;i++){
                        if (this.answer.list[ai].commentList[ci].like[i] == this.userId) this.answer.list[ai].commentList[ci].like.splice(i, 1)
                    }
                    this.answer.list[ai].commentList[ci].likeCount--
                }
                this.$forceUpdate()
            })
        },


        submitReply(answerIndex,commentIndex){
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
                    this.answer.list[answerIndex].commentList[commentIndex].reply.push(res)
                    this.closeReply()
                }
            })
        },

        // 翻页
        currentChange(e){
            this.answer.list[this.currentAnswerIndex].currentPage = e
            this.getAnswerComment(this.currentAnswerId,this.currentAnswerIndex)
        }
    }
}
</script>

<style lang="less">
.QuestionHeader {
    position: relative;
    overflow: hidden;
    background: #fff;
    margin: 0 auto;
    -webkit-box-shadow: 0 1px 3px rgba(26,26,26,.1);
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    padding: 16px 0;
    
    .QuestionHeader-content{
        width: 1032px;
        padding: 0 16px;
        margin: 0 auto;
        display: flex;
        .QuestionHeader-main{
            width: 670px;
            padding-left: 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        .QuestionHeader-side {
            width: 330px;
            text-align: center;
            .ques_hover:hover{
                p{color: red;}
            }
        }
    }
    
}








</style>