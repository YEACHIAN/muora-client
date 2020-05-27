<template>
  <div class="pl-20 pr-20">
    <ul v-if="askCount" v-infinite-scroll="getMyAsk" :infinite-scroll-disabled="disabled">
      <li class="ask_list_item" v-for="(item,index) in askList" :key="index">
        <p class="fw-600 f-18 c-1 cursor_pointer" @click="jumpTo('/question/detail',item._id)">
          {{item.title}}
        </p>
        <div class="flex mt-20">
          <el-button type="primary" icon="el-icon-edit" size="small" plain  @click="jumpTo('/question/detail',item._id)">写回答</el-button>

          <el-button :disabled="true" type="primary" size="small">{{item.collectCount?item.collectCount:0}} 人关注</el-button>
          
          <div class="ask_info c-3">
            {{item.answer_count}} 个回答 · {{item.read}} 次浏览
          </div>
        </div>
      </li>
      <div v-if="askLoading" class="text-c f-14 lh-24 pt-10 pb-10 c-3 border-t">加载中...</div>
      <div v-if="noMore" class="text-c lh-24 f-14 pt-10 pb-10 c-3 border-t">没有更多了</div>
    </ul>

    <div v-else class="bin_box">
        <img src="@/assets/img/person_asks.png">
        <div class="c-3 text-c f-14 mt-15">
          还没有问题
        </div>
    </div>
  </div>
</template>


<script>
export default {
  
  data(){
    return{
      counter:1,
      pageSize:10,
      currentPage:1,
      askLoading:false,
      askList:[],
      askCount:0
    }
  },
  computed:{
    noMore () {
      return !this.askLoading && this.askList.length >= this.askCount 
    },
    disabled () {
      
      return this.askLoading || this.noMore
    }
  },
  mounted(){
    this.getMyAsk()
  },
  methods:{
    getMyAsk(){
      this.askLoading = true
      this.axios.get('/mine/myAsk',{
        params:{
          pageSize:this.pageSize,
          currentPage:this.currentPage,
        }
      }).then(res=>{
        this.askLoading = false
        if(res){
          this.askList = this.askList.concat(res.list)
          this.askCount = res.count
          this.currentPage++
        }
      },err=>this.askLoading = false)
    },
    jumpTo(path,_id){
      this.$router.push({ path, query:{_id} })
    },
  }
}
</script>
