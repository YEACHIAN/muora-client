<template>
    <div>
        <quill-editor 
            v-model="content" 
            :style="`min-height:${minHeight}px`"
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" 
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>

        <el-upload
            class="none"
            action="/api/upload"
            :headers="{ 'Authorization' : 'Bearer ' + token }"
            :on-success="artImgSuccess"
            :on-error="artImgError"
            multiple>
            <el-button size="small" type="primary"></el-button>
        </el-upload>
    </div>
</template>

<script>
import toolbarOptions from '@/lib/toolbarOptions'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { getCookie } from '@/lib'
export default {
    name:'UE',
    props:{
        placeholder:{ type:String },
        minHeight:{ type:String }
    },
    data(){
        return{
            token:getCookie('tz'),
            content:'',
            editorOption: {
                placeholder: this.placeholder,
                modules: {
                    
                    toolbar: {
                        container: toolbarOptions,  // 工具栏
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    // 调用iview图片上传
                                    document.querySelector('.el-upload .el-button').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    },
                    syntax: {
                        highlight: text => hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
                    }
                }
            }
        }
    },
    mounted(){
        this.editor = this.$refs.myQuillEditor.quill
    },
    methods:{

        // 文章图片上传成功回调
        artImgSuccess(res, file, fileList){
            let length = this.editor.getSelection().index
            this.editor.insertEmbed(length, 'image', res.data) // 插入图片 
            this.editor.setSelection(length + 1) // 调整光标到最后
        },

        // 文章图片上传失败回调
        artImgError(err, file, fileList){
            errorMessage('插入图片失败')
        },

         // 准备编辑器
        onEditorReady(editor) {

        },

        // 失去焦点事件
        onEditorBlur(){}, 

        // 获得焦点事件
        onEditorFocus(){},

        // 内容改变事件 
        onEditorChange(){}, 

        // 把实体格式字符串转义成HTML格式的字符串
        escapeStringHTML(str) {
            str = str.replace(/&lt;/g,'<')
            str = str.replace(/&gt;/g,'>')
            return str
        }
    }
}
</script>

<style lang="less">
.ql-toolbar.ql-snow{
  border: none;
}
.ql-container.ql-snow{
  border: none;
}

.ql-editor.ql-blank::before{
  color: #999999;
}
.ql-editor{
    height: 100%;
}
.quill-editor .ql-container .ql-editor {
  *{
    margin-bottom: 10px;
  }
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  p{
    img{
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>