<template>
    <div>
        <div class="muora-container">
            <div class="muora-main">
                <el-card class="box-card">
                    <!-- <ul v-infinite-scroll="getAnswer" :infinite-scroll-disabled="disabled"> -->
                    <ul v-infinite-scroll="getAnswer" :infinite-scroll-disabled="disabled">
                        <li class="ask_list_item" v-for="(item,index) in answerList" :key="index">
                            <p class="fw-600 f-18 c-1 cursor_pointer" @click="jumpTo('/question/detail',item.askId._id)">
                                {{item.askId.title}}
                            </p>

                            <div v-if="!item.readAll" class="f-15 lh-26 c-1 mt-10" style="letter-spacing:1px;">
                                <div v-if="item.coverImg">
                                    <div style="padding-left:210px;height:105px;position:relative">
                                        <img class="fit-cover" style="width:190px; height:105px;position:absolute;left:0;top:0;border-radius:4px" :src="item.coverImg"/>
                                        <!-- <img style="width:190px; height:105px;position:absolute;left:0;top:0" :src="item.coverImg"> -->
                                        <span>{{item.answererName}}：{{item.begin}}...</span>
                                        <button class="readTxtBtn" @click="readFullText(index)">阅读全文<i class="el-icon-arrow-down"></i></button>
                                    </div>
                                </div>
                                <div v-else>
                                    {{item.begin}}
                                    <button class="readTxtBtn" @click="readFullText(index)">阅读全文<i class="el-icon-arrow-down"></i></button>
                                </div>
                            </div>

                            <div v-else>
                                <!-- {{item.answererId}} -->
                                <div class="mt-10 flex" style="height:24px;line-height:24px">
                                    <div class="flex cursor_pointer" @click="item.answererId._id==userId ? jumpTo('/personal') : jumpTo('/people',item.answererId._id)">
                                        <el-avatar shape="square" :size="24" :src="item.answererId.avatar"></el-avatar>
                                        <div class="ml-10 f-15 fw-600">{{item.answererId.username}}</div>
                                    </div>
                                    <div class="f-14">，{{item.answererId.intro}}</div>
                                </div>

                                <div class="mt-10">
                                    <p v-show="item.agreeCount" class="mb-8 c-5 f-14">{{item.agreeCount}} 人赞同了该回答</p>
                                    <article v-html="item.content"></article>
                                </div>

                                <div class="mt-15 f-14 lh-14 c-3">
                                    发布于 {{item.createTime}}
                                </div>

                                
                                
                            </div>
                            

                            <div class="mt-15 flex align-center f-14">
                                <el-button v-if="isAgree(item.agree)" type="primary" size="mini" icon="el-icon-caret-top" plain @click="agreeAnswer(item._id,index)">赞同<span v-show="item.agreeCount" >{{item.agreeCount}}</span></el-button>
                                <el-button v-else type="primary" size="mini" icon="el-icon-check" @click="agreeAnswer(item._id,index)">已赞同<span v-show="item.agreeCount"> {{item.agreeCount}}</span></el-button>
                                
                                <div v-if="commentIndex === index" class="commentBox cursor_pointer ml-25" @click="undoComment(index)">
                                    <span class="comment"></span>收起评论
                                </div>
                                <div v-else class="commentBox cursor_pointer ml-25" @click="getAnswerComment(item._id,index)">
                                    <span class="comment"></span>{{item.commentCount?`${item.commentCount} 条评论`:'添加评论'}}
                                </div>

                                <div class="collectBox cursor_pointer ml-30" @click="collectAnswer(item._id,index)">
                                    <span class="collect"></span>{{item.isCollect===1?'已收藏':'收藏'}}
                                </div>

                                <div class="likeBox cursor_pointer ml-30" @click="likeAnswer(item._id,index)">
                                    <span class="like"></span>{{ isLikeAnswer(item.like)?'取消喜欢':'喜欢' }}
                                </div>

                                <div v-show="item.readAll" class="ml-auto mr-20 c-5 cursor_pointer" @click="closeReadFullText(index)">收起<i class="el-icon-arrow-up"></i></div>

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
                                    
                                    
                                    <el-pagination
                                    class="text-c"
                                    :hide-on-single-page="item.commentCount<=item.commentPageSize"
                                    layout="prev, pager, next"
                                    :pager-count="5"
                                    :page-size="item.commentPageSize"
                                    :total="item.commentCount"
                                    @current-change="currentChange">
                                    </el-pagination>
                                    
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
                        </li>

                        <div v-if="askLoading" class="text-c f-14 lh-24 pt-10 pb-10 c-3 border-t">加载中...</div>
                        <div v-if="noMore" class="text-c lh-24 f-14 pt-10 pb-10 c-3 border-t">没有更多了</div>

                    </ul>
                </el-card>
            </div>

            
            <GlobalSider/>
            
            
        </div>
    </div>
</template>

<script>
import { computeTime,textToHtml } from '@/lib'
import { successMessage } from '@/lib/alert'
import GlobalSider from '@/components/GlobalSider'
export default {
    components:{
        GlobalSider
    },
    props:{
        userId: { type: String },
        avatar: { type: String }
    },
    data(){
        return{
            answerList:[],
            answerCount:0,
            pageSize:3,
            currentPage:1,
            commentIndex:null,
            commentLoading:false,
            commentContent:'',
            currentAnswerId:null,
            currentAnswerIndex:null,
            replyIndex:null,
            replyContent:'',
            replyInfo:{},
            askLoading:false
        }
    },
    computed: {
        isAgree(agree){
            return (agree) => !agree.includes(this.userId)
        },
        isMeLikeComment(like){
            if(!like) return false
            return (like) => like.includes(this.userId)
        },
        isLikeAnswer(like){
            if(!like) return false
            return (like) => like.includes(this.userId)
        },
        noMore () {
            return !this.askLoading && this.answerList.length >= this.answerCount
        },
        disabled () {
            return this.askLoading || this.noMore
        }
    },
    mounted(){
        this.getAnswer()
    },
    methods:{
        getAnswer(){
            this.askLoading = true
            this.axios.get('/answer',{
                params:{
                    pageSize:this.pageSize,
                    currentPage:this.currentPage
                }
            })
            .then(res=>{
                if(res){
                    for(let r of res.list){
                        r.createTime = this.$moment(r.createdAt).format("YYYY-MM-DD")
                    }
                    this.answerList = this.answerList.concat(res.list)
                    this.answerCount = res.count
                    this.currentPage++
                }
                this.askLoading = false
            }).catch(err => this.askLoading = false)
        },


        readFullText(index){
            this.answerList[index].readAll = true
            this.$forceUpdate()
        },

        closeReadFullText(index){
            this.answerList[index].readAll = false
            this.$forceUpdate()
        },


        jumpTo(path,_id){
            this.$router.push({ path, query:{_id} })
        },

        // 清空评论信息
        closeComment(index){
            this.commentContent = ''
            this.answerList[index].commentList = []
            this.answerList[index].currentPage = 1,
            this.commentIndex = null
        },

        // 收起评论
        undoComment(index){
            this.closeComment(index)
            this.closeReply()
        },

        // 获取当前Answer评论
        getAnswerComment(answerId,index){
            this.commentLoading = true
            if(this.commentIndex != index) {
                this.closeComment(index)
                this.commentIndex = index
            }

            this.currentAnswerIndex = index
            this.currentAnswerId = answerId

            if(!this.answerList[index].commentList) this.answerList[index].commentList = []
            if(!this.answerList[index].commentCurrentPage) this.answerList[index].commentCurrentPage = 1
            this.answerList[index].commentPageSize = 10
            this.axios.get('/comment',{
                params:{
                    typeId:answerId,
                    currentPage: this.answerList[index].commentCurrentPage,
                    pageSize: this.answerList[index].commentPageSize
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
                    this.answerList[index].commentList = res.list
                    this.answerList[index].commentCount = res.count
                }
                this.$forceUpdate()
                this.commentLoading = false
            },err => this.commentLoading = false)
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

        // 点击二级回复
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

        //清空回复信息
        closeReply(){
            this.replyIndex = null
            this.replyInfo = {}
            this.replyContent = ''
        },
        

        // 赞同 / 取消赞同
        agreeAnswer(answerId,index){
            this.axios.post('/answer/agree',{answerId})
            .then(res=>{
                if(res===1) {
                    this.answerList[index].agree.push(this.userId)
                    this.answerList[index].agreeCount++
                }else{
                    for(let i=0;i<this.answerList[index].agree.length;i++){
                        if (this.answerList[index].agree[i] == this.userId) this.answerList[index].agree.splice(i, 1)
                    }
                    this.answerList[index].agreeCount--
                }
            })
        },

        // 翻页
        currentChange(e){
            this.answerList[this.currentAnswerIndex].commentCurrentPage = e
            this.getAnswerComment(this.currentAnswerId,this.currentAnswerIndex)
        },

        // 提交评论
        submitComment(answerId,index){
            if(!this.answerList[index].commentList) this.answerList[index].commentList = []
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
                    this.answerList[index].commentCount++
                    this.commentContent = ''
                    this.answerList[index].commentList.unshift(res)
                }
            })
        },

        // 提交评论
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
                    this.answerList[answerIndex].commentList[commentIndex].reply.push(res)
                    this.closeReply()
                }
            })
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
                    this.answerList[ai].commentList[ci].like.push(this.userId)
                    this.answerList[ai].commentList[ci].likeCount++
                }else{
                    for(let i=0;i<this.answerList[ai].commentList[ci].like.length;i++){
                        if (this.answerList[ai].commentList[ci].like[i] == this.userId) this.answerList[ai].commentList[ci].like.splice(i, 1)
                    }
                    this.answerList[ai].commentList[ci].likeCount--
                }
                this.$forceUpdate()
            })
        },

        // 收藏文章
        collectAnswer(answerId,index){
            this.axios.post('/answer/collect',{answerId})
            .then(res=>{
                this.answerList[index].isCollect = res
            })
        },

        // 喜欢 / 取消喜欢 回答
        likeAnswer(answerId,index){
            this.axios.post('/answer/like',{answerId})
            .then(res=>{
                if(res===1) {
                    this.answerList[index].like.push(this.userId)
                    this.answerList[index].likeCount++
                }else{
                    for(let i=0;i<this.answerList[index].like.length;i++){
                        if (this.answerList[index].like[i] == this.userId) this.answerList[index].like.splice(i, 1)
                    }
                    this.answerList[index].likeCount--
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.readTxtBtn{
    height: auto;
    padding: 0;
    line-height: inherit;
    background-color: transparent;
    border: none;
    border-radius: 0;
    display: inline-block;
    font-size: 15px;
    color: #175199;
    outline: none;
    cursor: pointer;
    i{
        vertical-align: -1px;
    }
}
.readTxtBtn:hover{
    color: #777;
}

</style>