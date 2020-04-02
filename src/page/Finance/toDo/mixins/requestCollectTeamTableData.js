/*
*
* 收款里的跟团（含请求表格数据，和一些通用方法）列表页
*
* */

import moment from 'moment'
import { mapMutations } from 'vuex'

// 通过父组件传过来的属性进行转换，搜索用（在请求数据方法里面再次转换）
let changeComName = {
  nameIIICollectionTeamDirect: 'nameIIICollectionTeamDirect', // 无收入
  nameIIICollectionTeamSame: 'nameIIICollectionTeamSame', // 预付款
};

export default {
  data () {
    return {
      listLoading: false,
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0, // 翻页-数据总量
      applyPeopleChoose: {}, //选择搜索的申请人
    }
  },
  mounted () {
  },
  methods: {
    moment,
    ...mapMutations('toDo', [
      'showCountCollectTeamDirect',
      'showCountCollectTeamSame',
      'showCountCollectTeamInner',
      'showCountCollectTeamReimburse',
    ]),
    // 搜索
    HandleSearchApproveCollect (paramsModule) {
      this.approvalCollectTeamTable (changeComName[ paramsModule ]);
    },
    // 重置
    HandleResetApprovalCollect (paramsFrom, paramsModule){
      this.$refs[ paramsFrom ].resetFields();
      this.approvalCollectTeamTable(changeComName[ paramsModule ]);
    },
    // 申请人查询方法
    queryCreate (queryString, cb) {
      this.applyPeopleIpt = [];
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlist", {
        object: {
          name: queryString
        }
      }).then(res => {
        let { objects } = res.data;
        for (let i = 0; i < objects.length; i++) {
          this.applyPeopleIpt.push({
            value: objects[i].name,
            userCode: objects[i].userCode
          });
        }
        let results = queryString ? this.applyPeopleIpt.filter(this.createStateFilter(queryString)) : [];
        cb(results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 后台已做筛选  无需再过滤
    createStateFilter (queryString) {
      return state => {
        return state.value;
      };
    },
    // 申请人下拉框选中返回的数据
    handleSelect (item) {
      this.ruleFormSearch.userCode = item;
    },
    // size改变
    handleSizeChange (val) {
      this.pageSize = val;
      this.approvalCollectTeamTable(this.whichCollectTeamTab);
    },
    // 翻页
    handleCurrentChange (val) {
      this.pageIndex = val;
      this.approvalCollectTeamTable(this.whichCollectTeamTab);
    },
    // 请求收款跟团下所有表格的数据
    approvalCollectTeamTable (paramsTab) {
      // 根组件调用时会传过来tab的名字，依次为直客、同业、内部收款、报销还款
      let selCollectType = {
        nameIIICollectionTeamDirect: 1,
        nameIIICollectionTeamSame: 2,
        nameIIICollectionTeamInner: 5,
        nameIIICollectionTeamReimburse: 6,
      }
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        object: {
          checkType: this.ruleFormSearch.checkType ? this.ruleFormSearch.checkType : 0,
          collectionTime: "2019-05-16",
          startTime: this.ruleFormSearch.startTime ? moment(this.ruleFormSearch.startTime).format('YYYY-MM-DD 00:00:00') : "2000-05-16",
          endTime: this.ruleFormSearch.endTime ? moment(this.ruleFormSearch.endTime).format('YYYY-MM-DD 23:59:59') : '2099-05-16',
          groupCode: this.ruleFormSearch.plan !== "" ?this.ruleFormSearch.plan : "",
          planID: 0,
          orderID: 0,
          orderNumber: "",
          collectionNumber: this.ruleFormSearch.collectionAccountSel !== [] ? this.ruleFormSearch.collectionAccountSel.toString() : "",
          price: 0,
          dept: 0,
          createUser: this.ruleFormSearch.userCode !== "" ? this.ruleFormSearch.userCode : "",
          createTime: "2019-05-16 01:02:40",
          code: "",
          serialNumber: "",
          abstract: "",
          isDeleted: 0,
          collectionType: selCollectType[ paramsTab ],
          localCompID: 0 // 直客0, 同业变成同业社id
        }
      }).then( obj => {
        let keepObj = obj.data.objects;
        let keepTotal = obj.data.total;
        // 依据传入的参数赋值数据给相应的组件
        let selCollectTableFn = {
          nameIIICollectionTeamDirect (param) {
            _this.totalCount = keepTotal;
            _this.showCountCollectTeamDirect(keepTotal); // 直客计数
            return param ? _this.approvalTeamDirectData = keepObj : _this.approvalTeamDirectData = [];
          },
          nameIIICollectionTeamSame (param) {
            _this.totalCount = keepTotal;
            _this.showCountCollectTeamSame(keepTotal); // 同业计数
            return param ? _this.approvalTeamSameData = keepObj : _this.approvalTeamSameData = [];
          },
          nameIIICollectionTeamInner (param) {
            _this.showCountCollectTeamInner(keepObj ? keepObj.length : 0); // 内部收款计数
            return param ? _this.approvalTeamInnerData = keepObj : _this.approvalTeamInnerData = [];
          },
          nameIIICollectionTeamReimburse (param) {
            _this.showCountCollectTeamReimburse(keepObj ? keepObj.length : 0); // 内部收款计数
            return param ? _this.approvalTeamReimburseData = keepObj : _this.approvalTeamReimburseData = [];
          },
        };
        if (obj.data.isSuccess) {
          selCollectTableFn[ paramsTab ](true);
          /*_this.approvalTeamDirectData.forEach(function(item, index, arr) {
            item.collectionTime = item.collectionTime.split("T")[0];
            item.createTime = item.createTime.split("T")[0];
          });*/
          _this.listLoading = false;
        } else {
          _this.totalCount = 0;
          _this.listLoading = false;
          selCollectTableFn[ paramsTab ](false);
        }
      })
      .catch( obj => {
        console.log(obj);
      });
    },
    // 表格行样式
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px';
      } else {
        return '';
      }
    },
  }
}