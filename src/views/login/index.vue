<template>
    <div class="login-box">
        <el-container class="login-container">
            <div class="content">

                <div class="admin-logo-title">
                    <b style="color:#409EFF;font-family:ADELE">MUORA</b>
                </div>

                <el-form  :model="form" :rules="rules" ref="form"  style="width:350px;margin:35px auto 0" >
                <!-- <el-form-item prop="username" :rules="{ required: true, message: '账号不能为空'}"> -->
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名/代号" v-model="form.username" clearable>
                    <template slot="prepend">账号</template>
                    </el-input>
                </el-form-item>

                <!-- <el-form-item prop="password" :rules="{ required: true, message: '密码不能为空'}"> -->
                <el-form-item prop="password" :rules="{ required: true, message: '密码不能为空'}">
                    <el-input type="password"  placeholder="请输入密码" v-model="form.password" clearable>
                    <template slot="prepend">密码</template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" style="width:100%"  @click="login('form')">登陆</el-button>
                    <div class="login-block">
                        <a href="/forget">忘记密码</a>
                        <a href="/regist">点击注册</a>
                    </div>
                </el-form-item>

                </el-form>

            </div>
        </el-container>

    </div>
</template>

<script>
import { getCookie } from '@/lib'
export default {
    data(){
        return{
            form: {
                username: '',
                password: '',
            },
            rules: {
                username: { required: true, message: '用户名不能为空', trigger: 'blur' },
                password: { required: true, message: '密码不能为空', trigger: 'blur' },
            }
        }
    },

    methods:{
        login(form){
            this.$refs[form].validate(valid => {

                if (!valid) return
                else {

                    let params = { username: this.form.username, password: this.form.password }
                    
                    this.axios.post( '/user/login', params )
                    .then(res => {
                        if(res === true) {
                            this.$router.push({path:'/'})
                        }
                    },err => 0)
                    
                }
            })

        }
    }
}
</script>

<style lang="less">
.login-box{
    padding-top: 100px;
    .login-container{
        position: relative;
        width: 700px;
        background: #fff;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 0 15px #EBEEF5;
        padding: 60px 0;
        .content{
            margin: 0 auto;
            text-align: center;
            .login-block{
                text-align: right;
                a {
                    display: inline-block;
                    margin-left: 10px;
                    font-size: 14px;
                    color: #9b9ea0
                }
            }
        }
    }
}


.admin-logo-title{
  color: #888;
  margin-bottom: 30px;
  font-size: 70px
}


</style>