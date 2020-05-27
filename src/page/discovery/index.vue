<template>
    <div >
      <div class="muora-container">
        <div class="muora-main">
          <el-card class="box-card">
            <!-- <div > -->
              <ul v-infinite-scroll="getContent" :infinite-scroll-disabled="disabled">
                <li class="art_list_box" v-for="(list,index) in articleList" :key="index" >
                  <div v-if="list.cover_img" class="Home-mainItem have-img">
                    <div class="content">
                      <p class="title c-1 cursor_pointer" @click="jumpTo('/article',list._id)">{{list.title}}</p>
                      <p class="inner c-2">{{list.begin}}</p>
                      <div class="info home_page flex">
                        <span class="author cursor_pointer mr-15" >{{list.author_name}}</span>

                        <div class="commentBox cursor_pointer mr-15" @click="jumpTo('/article',list._id)">
                          <span class="comment"></span>{{list.comment_count?`${list.comment_count} 条评论`:'添加评论'}}
                        </div>
                        <div class="collectBox cursor_pointer mr-15" @click="collectArticle(list._id,index)">
                          <span class="collect"></span>{{list.isCollect===1?'已收藏':'收藏'}}
                        </div>
                        <div class="likeBox cursor_pointer" @click="likeArticle(list._id,index)">
                          <span class="like"></span>{{ isLike(list.like)?'取消喜欢':'喜欢'}}
                        </div>
                      </div>
                    </div>
                    <div class="cover">
                      <img  class="fit-cover"  style="width: 100%; height: 100%" :src="list.cover_img"/>
                    </div>
                  </div>

                  <div v-else class="Home-mainItem">
                    <div class="content">
                      <p class="title c-1 cursor_pointer" @click="jumpTo('/article',list._id)">{{list.title}}</p>
                      <p class="inner c-2">{{list.begin}}</p>
                      <div class="info home_page flex">
                        <span class="author cursor_pointer mr-15">{{list.author_name}}</span>
                        <div class="commentBox cursor_pointer mr-15" @click="jumpTo('/article',list._id)">
                          <span class="comment"></span>{{list.comment_count?`${list.comment_count} 条评论`:'添加评论'}}
                        </div>
                        <div class="collectBox cursor_pointer mr-15" @click="collectArticle(list._id,index)">
                          <span class="collect"></span>{{list.isCollect===1?'已收藏':'收藏'}}
                        </div>
                        <div class="likeBox cursor_pointer" @click="likeArticle(list._id,index)">
                          <span class="like"></span>{{ isLike(list.like)?'取消喜欢':'喜欢'}}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </li>
              </ul>
              <div v-if="articleLoading" class="text-c lh-24 f-14 pt-10 pb-10 c-3">加载中...</div>
              <div v-if="noMore" class="text-c lh-24 f-14 pt-10 pb-10 c-3">没有更多了</div>
            <!-- </div> -->
            
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
    props: {
      userId: { type: String }
    },
    data(){
      return{
        articleList:[],
        articleCount: 0,
        articleLoading:false,
        cover_img:require('../../../static/img/user_cover.jpg'),
        pageSize:10,
        currentPage:1,
      }
    },


    computed: {
      isLike(like){
        return (like) => like.includes(this.userId)
      },
      noMore () {
        return !this.articleLoading && this.articleList.length >= this.articleCount 
      },
      disabled () {
        return this.articleLoading || this.noMore
      }
    },
    mounted() {
      this.getContent()
    },
    methods:{
      jumpTo(pageName,_id){
        this.$router.push({
          path:pageName,
          query:{_id}
        })
      },
      
      getContent(){
        this.articleLoading = true
        this.axios.get('/article',{
          params:{
            pageSize:this.pageSize,
            currentPage:this.currentPage
          }
        }).then(res=>{
          this.articleLoading = false
          if(res){
            this.articleList = this.articleList.concat(res.list)
            this.articleCount = res.count
            this.currentPage++
          }
        },err => this.articleLoading = false )
      },

      // 评论点赞
      likeArticle(article_id,index){
        this.axios.post('/article/like',{article_id})
        .then(res=>{
          if(res===1) {
            this.articleList[index].like.push(this.userId)
            this.articleList[index].likeCount++
          }else{
            for(let i=0;i<this.articleList[index].like.length;i++){
              if (this.articleList[index].like[i] == this.userId) this.articleList[index].like.splice(i, 1)
            }
            this.articleList[index].likeCount--
          }
        })
      },
      
      collectArticle(article_id,index){
        this.axios.post('/article/collect',{article_id})
        .then(res=>{
          if(res) this.articleList[index].isCollect = res
        })
      }


    }
}
</script>

<style lang="less">

// .art_list_box:first-child{
//   border-top:none;
// }
.home_page{
  .comment:hover{
    color: #777;
    .img-box{
      background-image: url('../../assets/img/comment1.png');
    }
  }

  .like:hover{
    color: #777;
    .img-box{
      background-image: url('../../assets/img/like1.png');
    }
  }
}



</style>