<template>
  <div class="vivo" style="position:relative" id="uploadStyle">
    <!--申请预付款-->
    <el-dialog title="发票" :visible="dialogFormVisible" width=80% @close="closeAdd">
      <div class="approval">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票抬头" prop="title" label-width="120px">
                <el-input v-model="ruleForm.title" :disabled="approvalStatus" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纳税人识别号：" prop="number" label-width="150px">
                <el-input v-model="ruleForm.number" :disabled="approvalStatus" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号:" prop="phone" label-width="150px">
                <el-input v-model="ruleForm.phone" :disabled="approvalStatus" class="inputWidth" maxlength="11" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址：" prop="address" label-width="120px">
                <el-input v-model="ruleForm.address" :disabled="approvalStatus" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行：" prop="bank" label-width="150px">
                <el-input v-model="ruleForm.bank" :disabled="approvalStatus" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">-->
              <!--<el-form-item label="凭证:" prop="voucher" label-width="150px">-->
                <!--<el-upload class="upload-demo" :disabled="true" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">-->
                  <!--<el-button size="small" type="primary">点击上传</el-button>-->
                <!--</el-upload>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="凭证:" prop="voucher" label-width="120px">
                <el-upload class="upload-demo" :disabled="approvalStatus" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="fileList">
                  <el-button size="small" type="primary" :disabled="approvalStatus">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="proce_amount" label="未处理金额" align="center">
          </el-table-column>
          <el-table-column prop="approval_money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="approvalStatus" placeholder="申请金额" @blur="addMoney"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="submitForm('ruleForm')" type="primary" size="small" class="table_details" v-if="!approvalStatus">修改</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "invoice",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      totalMoney: '222.00',
      currentRow: true,
      ruleForm: {
        title: '',
        number: '',
        phone: '',
        address: '',
        bank: '',
        voucher: '',
      },
      rules: {
        title: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^[1][345789]\d{9}$/, message: '手机号码不符合规范' }
        ],
      },
      fileList: [],
      tableData: [],
      approvalStatus: true
    }
  },
  computed: {
    // 计算属性的 getter
    headers(){
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  watch: {
    info: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id']
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    closeAdd() {
      this.$emit('close', false);
    },
    addMoney(){
      let total = 0;
      this.tableData.forEach(function (item, index, arr) {
        console.log(item.approval_money);
        if(item.approval_money){
          total += parseFloat(item.approval_money);
        }
      });
//      alert(total);
      this.totalMoney = total;
    },
    submitForm(ruleForm) {
      const that = this;
      let canSave = true;
      let num = 0;
      this.tableData.forEach(function (item, index, arr) {
        if(item.approval_money){
          num++;
        }
      });
      if(num == 0){
        that.$message({
          type: 'warning',
          message: '所有订单申请金额均为空！'
        });
        canSave = false;
      }
      if(canSave){
        let orderList = [];
        this.tableData.forEach(function (item, index, arr) {
          if(item.approval_money){
            let itemOrder = {
              "order_no": item.order_sn,
              "money": item.approval_money
            };
            orderList.push(itemOrder);
          }
        });
        console.log(this.fileList);
        const files = [];
        if(this.fileList.length != 0){
          this.fileList.forEach(function (item, index, arr) {
            let itemFile;
            if(item.url){
              itemFile = {
                "url": item.url,
                "name": item.name
              };
            }else{
              itemFile = {
                "url": item.response.data.url,
                "name": item.response.data.name
              };
            }
            files.push(itemFile);
          });
        }

        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            if(num == this.tableData.length){
              that.postData(files, orderList);
            }else{
              this.$confirm('存在订单未填写开票金额，点击保存 则自动移除以上订单。', '提示', {
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                that.postData(files, orderList);
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消保存'
                });
              });
            }
          }
        });
      }
    },
    postData(files, orderList){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/addinvoice", {
        "id": this.info.id,
        "tour_no": this.$parent.param,
        "create_uid": sessionStorage.getItem("id"),
        "title": this.ruleForm.title,
        "pay_taxes_no": this.ruleForm.number,
        "phone": this.ruleForm.phone,
        "address": this.ruleForm.address,
        "bank": this.ruleForm.bank,
        "file": files,
        "order_list": orderList,
        "org_id": sessionStorage.getItem('orgID')
      }, ).then(function(response) {
//        alert(JSON.stringify(response));
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '修改成功！'
          });
          that.ruleForm = {
            title: '',
            number: '',
            phone: '',
            address: '',
            bank: '',
            voucher: '',
          };
          that.totalMoney = 0;
          that.fileList = '';
          that.$emit('close', false);
        } else {
          if(response.data.message){
            that.$message.success(response.data.message);
          }else{
            that.$message.success("保存失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(response, file, fileList){
      console.log(response);
      this.fileList = fileList;
    },
    handleError(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    UploadUrl(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
    },
    loadData(){
      const id = this.info.id;
//      alert(id);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
        "id": id
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.ruleForm = {
            title: response.data.data.title,
            number: response.data.data.pay_taxes_no,
            phone: response.data.data.phone,
            address: response.data.data.address,
            bank: response.data.data.bank,
          };
          that.fileList = response.data.data.file;
          that.tableData = response.data.data.order_list;
          if(response.data.data.approval_status == 1 && response.data.data.bill_status == 1){
            that.approvalStatus = false;
          }else if(response.data.data.approval_status == 2){
            that.approvalStatus = false;
          }else if(response.data.data.approval_status == 3){
            that.approvalStatus = true;
          }else{
            that.approvalStatus = true;
          }
          let total = 0;
          response.data.data.order_list.forEach(function (item, index, arr) {
            total += parseFloat(item.approval_money);
          });
          that.totalMoney = total;
//          that.approvalStatus = false;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {},
  mounted() {}
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 300px;
}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

.approval {
  /*height: 150px;*/
  line-height: 30px;
  width: 95%;
  margin: -15px 30px 30px 30px;
}

.table_trip {
  width: 95%;
  margin: 30px 30px;
}

.upload-demo {
  width: 1000px;

  .el-upload-list {
    width: 1000px;
  }

  .el-upload-list__item {
    width: 300px;
    display: inline-block;
  }

  .el-upload-list--text {
    width: 1000px;
  }
}

</style>
