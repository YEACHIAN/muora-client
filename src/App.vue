<template>
  <div id="app">
    <el-scrollbar>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import './assets/style/public.css';
@import './assets/style/transform.css';
@import './assets/style/common.css';
@import './assets/style/page.less';

.el-scrollbar {
    height: 100%;
    // .el-scrollbar__bar{
    //     right: 2px;
    // }
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
}
</style>
