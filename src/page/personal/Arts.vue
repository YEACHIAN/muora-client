<template>
  <div class="pl-20 pr-20">
    <ul v-if="articleCount" v-infinite-scroll="getArts" :infinite-scroll-disabled="disabled">
      <li class="art_list_box" v-for="(list,index) in artsList" :key="index" >
        <div v-if="list.cover_img" class="Home-mainItem have-img">
          <div class="content">
            <p class="title c-1 cursor_pointer" @click="jumpTo('/article',list._id)">{{list.title}}</p>
            <p class="inner c-2">{{list.begin}}...</p>
            <div class="info flex">
              <div class="commentBox cursor_pointer mr-15" @click="jumpTo('/article',list._id)">
                <span class="comment"></span>{{list.commentCount?list.commentCount:0}}
              </div>
              <div class="collectBox cursor_pointer mr-15">
                <span class="collect"></span>{{list.collectCount?list.collectCount:0}}
              </div>
              <div class="likeBox cursor_pointer">
                <span class="like"></span>{{ list.likeCount?list.likeCount:0}}
              </div>
            </div>
          </div>
          <div class="cover">
            <!-- <el-image style="width: 100%; height: 100%" :src="list.cover_img" fit="cover"></el-image> -->
            <img class="fit-cover" style="width: 100%; height: 100%" :src="list.cover_img">
          </div>
        </div>
        <div v-else class="Home-mainItem">
          <div class="content">
            <p class="title c-1 cursor_pointer" @click="jumpTo('/article',list._id)">{{list.title}}</p>
            <p class="inner c-2">{{list.begin}}...</p>
            <div class="info flex">
              <div class="commentBox cursor_pointer mr-15" @click="jumpTo('/article',list._id)">
                <span class="comment"></span>{{list.comment_count?list.comment_count:0}}
              </div>
              <div class="collectBox cursor_pointer mr-15">
                <span class="collect"></span>{{list.collectCount?list.collectCount:0}}
              </div>
              <div class="likeBox cursor_pointer">
                <span class="like"></span>{{ list.likeCount?list.likeCount:0}}
              </div>
            </div>
          </div>
          
        </div>
      </li>
      <div v-show="articleLoading" class="text-c f-14 lh-24 pt-10 pb-10 c-3">加载中...</div>
      <div v-show="noMore" class="text-c lh-20 f-14 pt-10 pb-10 c-3">没有更多了</div>
    </ul>
    <!-- <div v-if="articleLoading" class="text-c f-14 lh-24 pt-10 pb-10 c-3">加载中...</div> -->
              <!-- <div v-if="noMore" class="text-c lh-20 f-14 pt-10 pb-10 c-3">没有更多了</div> -->
    


    <div v-else class="bin_box">
        <img src="@/assets/img/person_arts.png">
        <div class="c-3 text-c f-14 mt-15">
          还没有文章，开始<span class="c-blue cursor_pointer" @click="$router.push('/write_essay')">写第一篇文章</span>
        </div>
    </div>

    
  </div>
</template>

<script>
import NoMore from '@/components/NoMore'
export default {
  components:{
    NoMore
  },
  data(){
    return{
      artsList:[],
      articleCount:0,
      articleLoading:false,
      pageSize:10,
      currentPage:1,
    }
  },
  computed:{
    noMore () {
      return this.artsList.length >= this.articleCount 
    },
    disabled () {
      return this.articleLoading || this.noMore
    }
  },
  mounted(){
    this.getArts()
  },
  methods:{
    getArts(){
      this.articleLoading = true
      this.axios.get('/mine/myArticle',{
        params:{
          pageSize:this.pageSize,
          currentPage:this.currentPage,
        }
      })
      .then(res=>{
        this.articleLoading = false
        if(res&&res.count){
          this.artsList = this.artsList.concat(res.list)
          this.articleCount = res.count
          this.currentPage++
        }
      },err=> this.articleLoading = false)
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