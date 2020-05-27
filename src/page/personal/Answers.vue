<template>
    <div>

        <ul v-if="answerCount" class="pl-20 pr-20" v-infinite-scroll="getAnswer" :infinite-scroll-disabled="disabled">
            <li class="ask_list_item" v-for="(item,index) in answerList" :key="index">
                <p class="fw-600 f-18 c-1 cursor_pointer" @click="jumpTo('/question/detail',item.askId._id)">
                {{item.askId.title}}
                </p>
                <div v-if="!item.readAll" class="f-15 lh-26 c-1 mt-10" style="letter-spacing:1px;">
                    <div v-if="item.coverImg">
                        <div style="padding-left:210px;height:105px;position:relative">
                            <!-- <el-image style="width:190px; height:105px;position:absolute;left:0;top:0;border-radius:4px" fit="cover" :src="item.coverImg"></el-image> -->
                            <img class="fit-cover" style="width:190px; height:105px;position:absolute;left:0;top:0;border-radius:4px" :src="item.coverImg">
                            <span>{{item.begin}}...</span>
                        </div>
                    </div>
                    <div v-else>
                        {{item.begin}}
                    </div>
                </div>

                <div class="info flex mt-10">
                    <span class="f-14 c-5 mr-15">{{item.agreeCount}}人赞同</span>
                    <div class="commentBox cursor_pointer mr-15">
                        <span class="comment"></span>{{item.commentCount?item.commentCount:0}}
                    </div>
                    <div class="collectBox cursor_pointer mr-15">
                        <span class="collect"></span>{{item.collectCount?item.collectCount:0}}
                    </div>
                    <div class="likeBox cursor_pointer">
                        <span class="like"></span>{{ item.likeCount?item.likeCount:0}}
                    </div>
                </div>
            </li>
        </ul>

        <div v-else class="bin_box">
            <img src="@/assets/img/person_answer.png">
            <div class="c-3 text-c f-14 mt-15">
                还没有回答
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        pageSize: 10,
        currentPage: 1,
        answerList: [],
        answerCount: 0,
        answerLoading: false
        };
    },
    computed: {
        noMore() {
            return this.answerList.length >= this.answerCount;
        },
        disabled() {
            return this.answerLoading || this.noMore;
        }
    },
    mounted() {
        this.getAnswer();
    },
    methods: {
        getAnswer() {
            this.answerLoading = true
            this.axios.get("/mine/myAnswer", {
                params: {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage
                }
            }).then(res => {
                if (res && res.count) {
                    this.answerList = this.answerList.concat(res.list);
                    this.answerCount = res.count;
                    this.currentPage++;
                }
                this.answerLoading = false
            }).catch(err=> this.answerLoading = false)
        },

        jumpTo(pageName,_id){
            this.$router.push({
                path:pageName,
                query:{_id}
            })
        }
    }
}
</script>