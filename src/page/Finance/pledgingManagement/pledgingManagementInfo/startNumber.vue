<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog :title="frameTitle1" :visible="dialogFormVisible" width=40% @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 220px;">
          <el-form-item :label="frameTitle2" prop="number" label-width="150px" style="float:left;margin-left: -40px;">
            <el-input v-model="ruleForm.number" class="input" placeholder="请输入" maxlength="80" show-word-limit></el-input>
          </el-form-item><br /><br />
          <div class="footer">
            <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">修 改</el-button>
            <el-button class="el-button" type="danger" @click="closeAdd">取 消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "importOrder",
  components: {},
  props: {
    dialogFormVisible: false,
    frameTitle1: '',
    frameTitle2: '',
  },
  data() {
    return {
      ruleForm: {
        number: 'T311123',
      },
      rules: {
        number: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    frameTitle1: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    closeAdd() {
      this.$emit('close', false);
    },
    submitForm(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let str = '';
          if(this.frameTitle1 == "发票号"){
            str = "/addinvoice";
          }else if(this.frameTitle1 == "收款编码号"){
            str = "/addreceiv";
          }
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/params/parameter" + str, {
            "value": this.ruleForm.number
          }, ).then(function(response) {
            if (response.data.code == '200') {
              console.log(response);
              that.$message.success("添加成功！");
              that.$emit('close', false);
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning("添加失败~");
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    loadData(){
      if(this.frameTitle1 == "发票号"){
        this.ruleForm.number = this.$parent.invoiceStart;
      }else if(this.frameTitle1 == "收款编码号"){
        this.ruleForm.number = this.$parent.receivStart;
      }
    }
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 50px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 450px;
}

.upload-demo {
  width: 550px;
}

</style>
