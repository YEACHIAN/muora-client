<template>
  <el-container>
    <el-main class="main">
      <el-container id="container">
        <div v-loading="regLoading" class="content">
          <div class="head">注&emsp;册</div>

          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm reg-form">
            <el-form-item prop="name">
              <el-input  placeholder="请输入你的姓名" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="gender">
              <el-select v-model="ruleForm.gender" placeholder="请选择你的性别" style="width:100%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="age">
              <el-input  placeholder="请输入你的年龄" maxlength="2" v-model.number="ruleForm.age"></el-input>
            </el-form-item>

            <el-form-item prop="intro">
              <el-input  placeholder="一句话介绍你自己" v-model="ruleForm.intro"></el-input>
            </el-form-item>

            <el-form-item prop="username">
              <el-tooltip class="item" effect="dark" content="" placement="right">
                <div slot="content">
                  <p class="mb-5">·&emsp;用户名·2-12个字符</p>
                  <p>·&emsp;一旦设置成功无法修改</p>
                </div>
                <el-input  placeholder="设置用户名" maxlength="12" v-model="ruleForm.username"></el-input>
              </el-tooltip>
            </el-form-item>
            
            <el-form-item prop="pass">
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
                  <p class="mb-5">·&emsp;6-16个字符</p>
                  <p class="mb-5">·&emsp;密码不能和用户名相同</p>
                  <p>·&emsp;必须包含字母和数字</p>
                </div>
                <el-input type="password" maxlength='16'  placeholder="设置你的登录密码" v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password"  placeholder="请再次输入你的密码" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" style="width:47%">注册</el-button>
              <el-button type="danger" plain @click="resetForm('ruleForm')" style="width:47%;margin-left:4%">重置</el-button>
              <div class="reg-block">
                已有账号？ <a href="login">请登录></a>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import { validateName, validateAge, validateUserName, validatePassword, validatePassword2 } from '@/lib/validate'
import { successMessage } from '@/lib/alert'

export default {
  data() {
    const checkName     = (rule, value, callback) => validateName(rule, value, callback)

    const checkAge      = (rule, value, callback) => validateAge(rule, value, callback)

    const checkUserName = (rule, value, callback) => validateUserName(rule, value, callback)

    const validatePass  = (rule, value, callback) => validatePassword(rule, value, callback,this.ruleForm.username)
    
    const validatePass2 = (rule, value, callback) => validatePassword2(rule, value, callback,this.ruleForm.pass);

    return {

      regLoading: false,

      usernameStatus: '',

      ruleForm: { name:'', gender:'', age: '', username:'', pass: '', checkPass: '', intro:'' },

      rules: {
        name:      [ { required: true, message: '姓名不能为空', trigger: 'blur' },   { validator: checkName, trigger: 'blur' } ],

        gender:    [ { required: true,message:'请选择你的性别',  trigger: 'change' } ],

        intro:     [ { required: true,message:'不能为空',  trigger: 'change' } ],

        age:       [ { required: true, message: '年龄不能为空', trigger: 'blur' },   { validator: checkAge, trigger: 'blur' } ],

        username:  [ { required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: checkUserName, trigger: 'blur' } ],

        pass:      [ { required: true, message: '密码不能为空', trigger: 'blur' },   { validator: validatePass, trigger: 'blur' } ],

        checkPass: [ { required: true, message: '请再次输入密码', trigger: 'blur' }, { validator: validatePass2, trigger: 'blur' } ]
      },

      timer: null,

      countDown: 0
    };
  },

  methods:{
    submitForm(formName) {

      this.$refs[formName].validate(valid => {

        if (!valid) return
        else{

          this.regLoading = true

          const { name, gender, age, username, pass, intro } = this.ruleForm

          const params = { name, gender, age, username, password:pass,intro }

          this.axios.post('/user/create', params )
          .then( res => {

            this.regLoading = false

            if(res) {
              successMessage('注册成功！')
              this.$router.push('/login')
            }
             
          }, err => this.regLoading = false )

        }
      });
    },
    
    resetForm(formName) {
      this.$refs[formName].resetFields(); //清空表单
    }
  }
}
</script>

<style scoped>
html{ font-weight: 400; }
.logo{
  color: #888;
  font-size: 35px;
  line-height: 60px;
}
.main{
  padding: 50px 0;
}
#container{
    position: relative;
    width: 800px;
    background: #fff;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 0 15px #EBEEF5;
    padding: 30px 0;
}
.content{
    width: 320px;
    margin: 0 auto;
    text-align: center;
}
.head{
  font-weight: 700;
  padding-top: 20px;
  font-size: 30px;
  color: #409EFF;
  letter-spacing: 1px;
  line-height: 36px;
}
.mb-5{ margin-bottom: 5px }

.reg-form{
  padding-top: 30px;
  color: #373d41;
  font-size: 12px;
}

.reg-block{
  text-align: right;
  color: #9b9ea0
}
.reg-block a{
  display: inline-block;
  font-size: 14px;
  color: #409EFF
}
</style>