<template>
  <div class="cityList">
      <div class="cascade">
       <el-tree :props="props1"
                :load="loadNode1"
                class="treeDemo"
                lazy
                @node-click="treeClick"
                :expand-on-click-node="false"
                node-key="id"
                ref="refTree"></el-tree>
      </div>
      <div class="search">
        <span class="keyword">输入关键字:</span>
        <!-- <el-autocomplete class="inputBox" clearable placeholder="请输入关键字" :fetch-suggestions="querySearch" @select="handleSelect" suffix-icon="el-icon-search" v-model="input" :trigger-on-focus="false"></el-autocomplete> -->
        <el-input class="inputBox"
                  v-model="input"
                  placeholder="请输入关键字"
                  clearable
                  suffix-icon="el-icon-search"></el-input>
        <el-button class="searchButton"
                   type="primary"
                   icon="el-icon-search"
                   @click="searchClick"></el-button>
      </div>
      <!-- 区域列表 -->
      <template v-if="geography == 1">
      <template v-if="data.isLeaf == 2">
        <el-button class="add_country"
                   type="primary"
                   @click="addState = true">添加</el-button>
      </template>
        <el-table class="table_list"
                  :data="tableData"
                  border
                  :header-row-style="tableHead"
                  :cell-style="tableHeight"
                  :header-cell-style="getRowClass"
                  style="width: 1130px;">
          <el-table-column prop="id"
                           label="ID"
                           align="center"
                           width="60px"></el-table-column>
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.isLeaf == 2">
                <el-tooltip placement="right" effect="light">
                  <div slot="content">点击查看<br/>下级分类</div>
                  <el-button @click="subordinate(scope.row)" type="text">{{ scope.row.country }}</el-button>
                </el-tooltip>
              </template>
              <template v-else-if="scope.row.isLeaf == 1">
                <span type="text">{{ scope.row.country }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="continent" :label="earth" align="center" width="80px">{{countryPopup.select}}</el-table-column>
          <!--<el-table-column prop="continent" label="所属国家" align="center" width="80px">{{countryPopup.select}}</el-table-column>-->
          <!--<el-table-column prop="continent" label="所属区域" align="center" width="80px">{{countryPopup.select}}</el-table-column>-->
          <el-table-column prop="englishName" label="英文名" align="center"></el-table-column>
          <el-table-column prop="pinyin" label="中文全拼" align="center"></el-table-column>
          <el-table-column prop="initials" label="首字母" align="center" width="70px"></el-table-column>
          <el-table-column prop="initial" label="首拼" align="center"></el-table-column>
          <el-table-column prop="code" label="代码" align="center" width="80px"></el-table-column>
          <el-table-column label="操作" align="center" width="230pxs">
          <template slot-scope="scope">
            <div class="table_button_left">
              <el-button class="table_button" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button class="table_button" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <template v-if="scope.row.isLeaf == 2">
              <el-button class="table_button1" type="success" @click="addStates(scope.$index, scope.row)">添加</el-button>
              </template>
            </div>
          </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </template>
      <!-- 区域列表END -->

      <!-- 添加区域弹框 -->
      <el-dialog class="add_country_popup" custom-class="city_list" title="添加" :visible.sync="addState" width="600px">
        <el-form :model="countryPopup" status-icon :rules="countryRules" ref="countryPopup">
          <el-form-item :label="changelable" :label-width="formLabelWidth" v-show="flags1">
            <span class="country_span">{{countryPopup.select}}</span>
          </el-form-item>
          <el-form-item label="区域名称:" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="countryPopup.countryName" clearable></el-input>
          </el-form-item>
          <!--<el-form-item label="地区名称:" :label-width="formLabelWidth" prop="countryName">-->
            <!--<el-input class="country_input" v-model="countryPopup.countryName" clearable></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="备用名:" :label-width="formLabelWidth" prop="spareName" v-show="flag3">
            <el-input class="country_input" v-model="countryPopup.spareName" clearable></el-input>
          </el-form-item>
          <el-form-item label="url:" :label-width="formLabelWidth" prop="url" v-show="flag3">
            <el-input class="country_input" v-model="countryPopup.url" clearable></el-input>
          </el-form-item>
          <el-form-item label="末级区域:" :label-width="formLabelWidth">
            <el-radio-group class="virtualDepartment" v-model="countryPopup.isLeaf">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="countryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="countryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="countryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="首拼:" :label-width="formLabelWidth">
            <el-input class="country_input" v-model="countryPopup.initial" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="countryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="countryClose">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('countryPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加区域END -->

      <!-- 编辑区域弹框 -->
      <el-dialog class="edit_country_popup" custom-class="city_list" :title="changeTitle" :visible.sync="editState" width="600px">
        <el-form :model="editCountryPopup" status-icon :rules="editCountryRules" ref="editCountryPopup">
          <el-form-item label="ID:" :label-width="formLabelWidth" prop="id">
            <span class="country_span">{{editCountryPopup.id}}</span>
          </el-form-item>
          <el-form-item :label="earth" :label-width="formLabelWidth">
            <span class="country_span">{{editCountryPopup.select}}</span>
          </el-form-item>
          <el-form-item :label="araname" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="editCountryPopup.countryName" clearable></el-input>
          </el-form-item>
          <el-form-item label="备用名:" :label-width="formLabelWidth" prop="spareName" v-show="flag3" >
            <el-input class="country_input" v-model="editCountryPopup.spareName" clearable></el-input>
          </el-form-item>
          <el-form-item label="url:" :label-width="formLabelWidth" prop="url" v-show="flag3">
          <el-input class="country_input" v-model="editCountryPopup.url" clearable></el-input>
        </el-form-item>
          <el-form-item label="末级区域:" :label-width="formLabelWidth">
            <el-radio-group class="virtualDepartment" v-model="editCountryPopup.isLeaf">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="editCountryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="editCountryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="editCountryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="首拼:" :label-width="formLabelWidth">
            <el-input class="country_input" v-model="editCountryPopup.initial" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="editCountryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="editState = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('editCountryPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑区域END -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        araname:'',
        earth:"",
        changeTitle:"",
        changelable:"",
        changeName:"",
        flag3:true,
        searchInput: '', // 搜索
        list:[],
        lists: [], //子级
        vague: [], // 模糊搜索数组
        props1: {
          label: 'name',
          isLeaf: 'leaf'
        },
        data: '', // 存单击数据
        total: 1, // 分页总条数
        theContinent: '', // 所属地区id
        node: '', // 获取tree子级数据
        resolve: '', // 获取tree子级方法
        level: '', // 层级数据
        // 数据表格
        tableData: [],
        flags1:true,
        flags2:false,
        flag:false,
        // 添加区域数据
        countryPopup: {
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          initial: '',
          code: '',
          select: '',
          parentID: '',
          isLeaf: '2',
          spareName: '',
          url: '',

          // titles:"国家编辑"
        },
        // 编辑区域数据
        editCountryPopup: {
          id: '',
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          initial: '',
          code: '',
          select: '',
          isLeaf: '',
          parentID: '',
          spareName: '',
          url: '',
          // titles:""
          country:''
        },
        // 添加区域正则判断
        countryRules: {
          countryName: [
            { required: true, message: '请填写区域名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 编辑区域正则判断
        editCountryRules: {
          countryName: [
            { required: true, message: '请填写区域名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        input: '',// 搜索框
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '34px'}, // 各表格高度
        pagesize:10, // 每页的数据条数
        currentPage:1, // 默认开始页面
        geography: '', // 判断国家 省份 城市
        addState: false, // 添加国家弹框
        formLabelWidth: '160px', // 弹窗item宽度
        editState: false, // 编辑国家弹框
        clickId: '',
        isSearch: false // 判断是否搜索
      }
    },
    methods: {
      loadNode1(node, resolve) {
        this.node = node.data;
        window.localStorage.setItem('node', this.node);
        this.resolve = resolve
        this.level = node.level
        /*添加第一级*/
        if (node.level === 0) {
          this.earth = '所属大洲'

          this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",{
              "object": {
                "parentID": -1,
              }
            }).then(obj => {
              console.log(obj,"list");
              for (let i = 0; i < obj.data.objects.length; i++) {
                this.list.push({
                  name:obj.data.objects[i].areaName,
                  key: i,
                  id: obj.data.objects[i].id,
                  isLeaf: obj.data.objects[i].isLeaf, // 是否是末级
                  Hierarchy: 0 // 层级
                })
              }
              resolve(this.list);
            }).catch(obj => {
              console.log(obj)
            })
        }
        if (node.level >= 1) {
          this.getSon(
            node.data.key,
            node.data.label,
            node.data.id,
            node.data.isLeaf,
            resolve,
            node.level
          );
        }
      },
      /*获取子集的方法*/
      getSon(key, label, id, isLeaf, resolve, level){
        this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",
          {
            "object": {
              "parentID": id,
            }
          }).then(res => {
          this.lists = []
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.objects.length; i++) {
              if (res.data.objects[i].isDeleted == 0) {
                if (res.data.objects[i].isLeaf == 2) {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: false,
                    Hierarchy: level
                  })
                } else {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: true,
                    Hierarchy: level
                  })
                }
              }
            }
          }
          setTimeout(() => {
            resolve(this.lists);
          }, 200);
        }).catch(error => {
          console.log(error);
        });
      },
      // 单击tree节点
      treeClick(data,name){
        // this.tableData = [];
        console.log(data,'节点的数据')
        this.isSearch = false;
        this.geography = 1
        this.data = data
        this.countryPopup.select = data.name
        this.countryPopup.parentID = data.id
        this.editCountryPopup.parentID = data.id
        this.editCountryPopup.select = data.name
        if (data.Hierarchy == 0) {
          // 所属地区
          this.theContinent = data.id
          this.changeTitle="国家编辑"
          this.earth ="所属大洲"
          this.araname ="国家名称:"
          this.flag3 =false
          this.changelable ="所属大洲"//????
        }

        if (data.Hierarchy >=1){
          this.changelable ="所属区域"
          this.changeTitle="区域编辑"
          this.earth ="所属国家"
          this.araname ="区域名称:"
          this.flag3=true

        }
        if (data.Hierarchy ==2){
          this.earth ="所属地区"
          this.araname ="区域名称:"
          this.changelable ="所属区域"
        }
        if (data.isLeaf == 1) {
          // this.flags1 =false;
          // this.flags2=true;
          // this.changeTitle="区域编辑"
        this.tableData = [];
          this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforget',{
            id: data.id
          }).then(res => {
            console.log(res,33333);
            this.tableData.push({
              id: res.data.object.id,
              country: res.data.object.areaName,
              continent: res.data.object.earth,
              // continent:data.name,
              englishName: res.data.object.englishName,
              pinyin: (res.data.object.chineseFull).toLowerCase(),
              initials: res.data.object.firstChar,
              code: res.data.object.areaCode,
              value: res.data.object.areaName,
              isLeaf: res.data.object.isLeaf,
              initial: res.data.object.initial,
              parentID: res.data.object.parentID
            })
            this.geography = 1
            this.currentPage = 1
            this.total = 1
          }).catch(err => {
            console.log(err)
          })
        } else {
          if (this.clickId != data.id) {
              this.currentPage = 1
            }
          this.clickId = data.id
          this.initData(data.id)
          // this.changeTitle="地区编辑"
        }
      },
      initData(id, name) {
        this.$http.post(this.GLOBAL.serverSrc +'/universal/area/api/areainforpage',{
          "object": {
            "parentID": id,
            "areaName": name
          },
          //7号修改过
          pageIndex: this.currentPage,
          pageSize:this.pagesize,
        }).then(res => {
          if (res.data.isSuccess == false) {
            this.tableData = [];
            this.total =0;
            if (this.currentPage != 1) {
              this.currentPage = 0
              this.treeClick(data)
            }
          } else {
            this.tableData = res.data.objects
            console.log(res,1111)
            this.total = res.data.total
            this.geography = 1
            this.tableData.forEach((item, i) => {
                item.id = res.data.objects[i].id,
                item.country = res.data.objects[i].areaName,
                item.continent = res.data.objects[i].earth,
                item.englishName = res.data.objects[i].englishName,
                item.pinyin = (res.data.objects[i].chineseFull).toLowerCase(),
                item.initials = res.data.objects[i].firstChar,
                item.code = res.data.objects[i].areaCode,
                item.value = res.data.objects[i].areaName,
                item.isLeaf = res.data.objects[i].isLeaf,
                item.initial = res.data.objects[i].initial,
                item.parentID = res.data.objects[i].parentID
            })
          }
        })
      },
      searchClick() {
        this.initData(0, this.input);
        this.isSearch = true;
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
      // 取消
      countryClose() {
        let select = this.countryPopup.select;
        this.countryPopup = {
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          initial: '',
          code: '',
          select: select,
          parentID: '',
          isLeaf: '2',
          spareName: '',
          url: ''
        };
        this.addState = false;

      },
      // 添加 编辑 地区保存成功 点击确定
      countryForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (formName == 'countryPopup') {
              this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforinsert', {
                object: {
                  areaName: this.countryPopup.countryName,
                  englishName: this.countryPopup.englishName,
                  chineseFull: (this.countryPopup.pinyin).toLowerCase(),
                  firstChar: this.countryPopup.initials,
                  areaCode: this.countryPopup.code,
                  parentID: this.countryPopup.parentID,
                  isLeaf: Number(this.countryPopup.isLeaf),
                  initial: this.countryPopup.initial,
                  // createTime: "2018-09-11",
                  earth: '-1',
                  // earth:this.countryPopup.select,
                  markName: this.countryPopup.spareName,
                  url: this.countryPopup.url
                }
              }).then(res => {
                  if (res.data.isSuccess == false) {
                    this.$message.error('该名称以存在');
                    return false;
                  } else {
                    this.treeClick(this.data);
                    this.addState = false;
                    this.$message.success('添加成功！');
                    if(this.node) {
                      this.getSon(
                        this.node.key,
                        this.node.label,
                        this.node.id,
                        this.node.isLeaf,
                        this.resolve,
                        this.level
                      );
                    }else {
                      this.getSon(
                        this.node.key,
                        this.node.label,
                        this.node.id,
                        this.node.isLeaf,
                        this.resolve,
                        this.level
                      );
                    }

                    // this.$refs['countryPopup'].resetFields();
                    this.countryPopup.initial = '';
                  }
                }).catch(err => {
                  console.log(err)
                })
            } else if (formName == 'editCountryPopup') {

              this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforsave', {
                object: {
                  id: this.editCountryPopup.id,
                  areaName: this.editCountryPopup.countryName,
                  englishName: this.editCountryPopup.englishName,
                  chineseFull: this.editCountryPopup.pinyin,
                  firstChar: this.editCountryPopup.initials,
                  areaCode: this.editCountryPopup.code,
                  isLeaf: Number(this.editCountryPopup.isLeaf),
                  initial: this.editCountryPopup.initial,
                  parentID: this.editCountryPopup.parentID,
                  earth: '-1',
                  // earth:this.editCountryPopup.select,
                  markName: this.editCountryPopup.spareName,
                  url: this.editCountryPopup.url
                }
              }).then(res => {
                if(!this.isSearch) {
                  this.treeClick(this.data)
                } else {
                  this.initData(0, this.input)
                }

                this.editState = false;
                this.$message.success('修改成功！');
                console.log(this.node,11111)
                this.getSon(
                  this.node.key,
                  this.node.label,
                  this.node.id,
                  this.node.isLeaf,
                  this.resolve,
                  this.level
                );
                // this.$refs['editCountryPopup'].resetFields()
              }).catch(err => {
                console.log(err)
              })
            }
          }
        })
      },
      // 添加国家弹窗
      addStates(key, data){
        this.changelable ="所属区域"
        this.countryPopup.select = data.country
        this.countryPopup.parentID = data.id
        this.editCountryPopup.parentID = data.id
        this.addState = true
        //??????


      },
      // 编辑国家
      handleEdit(key, data){
        this.changelable ="所属区域"
        console.log(data,"编辑")
        this.editState = true;
        this.editCountryPopup.parentID = data.parentID
        this.editCountryPopup.id = data.id;
        this.editCountryPopup.code = data.code;
        this.editCountryPopup.countryName = data.country;
        this.editCountryPopup.englishName = data.englishName;
        this.editCountryPopup.initials = data.initials;
        this.editCountryPopup.initial = data.initial;
        this.editCountryPopup.pinyin = data.pinyin;
        // this.editCountryPopup.select = this.theContinent;
        this.editCountryPopup.isLeaf = String(data.isLeaf);
        this.editCountryPopup.spareName = data.markName;
        this.editCountryPopup.url = data.url;

      },
      // 删除国家
      handleDelete(key, data){
        this.changelable ="所属区域"
        console.log(data,521)
        this.$confirm('是否删除' + data.value, '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete_country',
          confirmButtonClass: 'delete_country_determine',
          cancelButtonClass: 'delete_country_determine1'
        }).then(() => {
          // 为2非末级
          if (data.isLeaf == 2) {
            console.log(data.areaName,5555)
            this.changeTitle="区域编辑"
            this.$http.post(this.GLOBAL.serverSrc +'/universal/area/api/areainforlist',{
              object: {
                parentID: data.id
              }
            }).then(res => {
              if (res.data.isSuccess == false) {
                this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainfordelete',{
                  id: data.id
                }).then(res => {
                  this.tableData.splice(key, 1)
                  this.$refs.refTree.remove(data)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }).catch(err => {
                  console.log(err)
                })
              } else {
                this.$alert('<p>该地区下存在城市或省份 , 不能删除 ;</p><p>请清空城市或省份在删除 !</p>', '信息', {
                  confirmButtonText: '确定',
                  customClass: 'delete_country',
                  dangerouslyUseHTMLString: true,
                  confirmButtonClass: 'delete_country_determine',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainfordelete',{
              id: data.id
            }).then(res => {
              this.tableData.splice(key, 1)
              this.$refs.refTree.remove(data)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 点击按钮查看下级
      subordinate(data){
        console.log(data,"层级")
        let table = {}
        table.name = data.country
        table.id = data.id
        table.isLeaf = data.isLeaf
        this.treeClick(table)
        this.changelable ="所属区域"
        this.changeTitle="区域编辑"
        this.earth="所属国家"
        this.araname ="区域名称:"
        this.flag3=true
      },
      // 分页显示条数的改变
      pagesizes(page) {
        this.currentPage = 1;
        this.pagesize = page;
        if(!this.isSearch) {
         this.treeClick(this.data)
        }
      },
      // 分页当前页的改变
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        if(!this.isSearch) {
         this.treeClick(this.data)
        }
      },
    }
  }
</script>

<style scoped>
.cascade{
  float: left;
  margin-top:72px;
  user-select: none;
  border: solid 2px #e6e6e6;
  position: absolute;
  width: 240px;
  height: 60%;
  overflow: auto;
  box-shadow:1px 1px 1px #EDEDED,1px -1px 1px #EDEDED,-1px 1px 1px #EDEDED,-1px -1px 1px #EDEDED;
}
.treeDemo{
  margin-top: 20px;
}
.popper__arrow{ background: red !important;}
.inputBox{ width: 300px;left:16px;}
.searchButton{ margin-left:22px; }
.search{float: left; margin-top:72px;margin-left:405px;}
.table_list{ top: 10px;margin-bottom: 150px;left:261px;}
.table_button{float: left; width: 50px; height: 22px; padding: 0;}
.table_button_right{ float: right; margin: 0 20px 0 0;}
.table_button1{float: left;  width: 70px; height: 22px; padding: 0;}
.add_country{width:100px;float: left;margin-left:-615px;margin-top:72px;}
.page{ float: right;}
.pages{ height: 50px;margin-bottom: 50px;margin-top:-120px;width:1400px;}
.country_input{ width: 300px; margin: 0 95px 0 0;}
.country_select{ width: 300px; margin: 0 95px 0 0;}
.dialog-footer{ text-align: center;}
.Determine{ margin: 20px; width: 100px;}
.country_span{ float: left; margin: 0 0 0 30px;}
.edit_city_popup{ margin: -90px 0 0 0;}
.cityList>>>.el-tree-node__label{ font-size: 16px;}
.virtualDepartment { position: relative; float: left; left: 20px; margin-top: 13px; }
</style>
