<template>
  <div>
    <div class="muora-container">
      <div class="muora-main">
        <el-card class="box-card">
          <ul v-infinite-scroll="getAskList" :infinite-scroll-disabled="disabled">
            <li class="ask_list_item" v-for="(item,index) in askList" :key="index">
              <p class="fw-600 f-18 c-1 cursor_pointer" @click="jumpTo('/question/detail',item._id)">
                {{item.title}}
              </p>
              <div class="flex mt-20">
                <el-button type="primary" icon="el-icon-edit" size="small" plain  @click="jumpTo('/question/detail',item._id)">写回答</el-button>

                <el-button v-if="!item.isLink||item.isLink==-1" :disabled="item.questioner_id == userId" type="primary" size="small" @click="collectQuest(item._id,index)">关注问题</el-button>
                <el-button v-else type="success" size="small" icon="el-icon-check" @click="collectQuest(item._id,index)">已关注</el-button>
                
                <div class="ask_info c-3">
                  {{item.answer_count?item.answer_count:0}} 个回答 · {{item.read?item.read:0}} 次浏览
                </div>
              </div>
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
import GlobalSider from '@/components/GlobalSider'
export default {
  components:{
    GlobalSider
  },
  props:{
    userId: { type: String },
  },
  data(){
    return{
      askList:[],
      askLoading:false,
      askCount:0,
      currentPage:1,
      pageSize:2,
    }
  },
  computed: {
    isLike(like){
      return (like) => like.includes(this.userId)
    },
    noMore () {
      return !this.askLoading && this.askList.length >= this.askCount 
    },
    disabled () {
      return this.askLoading || this.noMore
    }
  },
  mounted(){
    this.getAskList()
  },
  methods:{
    getAskList(){
      this.askLoading = true
      let params = {
        currentPage:this.currentPage,
        pageSize:this.pageSize
      }
      this.axios.get('/ask',{ params })
      .then(res=>{
        this.askLoading = false
        if(res.count && res.list && res.list.length){
          this.askList = this.askList.concat(res.list)
          this.askCount = res.count
          this.currentPage++
        }
      },err => this.askLoading = false)
    },

    jumpTo(path,_id){
      this.$router.push({ path, query:{_id} })
    },

    // 收藏问题
    collectQuest(askId,i){
        
        this.axios.get(`/ask/collectQuest/${askId}`)
        .then(res => {
            if(res){
                this.askList[i].isLink = res
            }
        })
    },
  }
}
</script>

<style lang="less">

</style>
