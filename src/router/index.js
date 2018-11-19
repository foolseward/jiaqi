import Vue from 'vue'
import Router from 'vue-router'
import userList from '@/page/account/userList/userList'
import organList from '@/page/account/organList/organList'
import role from '@/page/account/role/role'
import perList from '@/page/account/perList/perList'
import accountInfor from '@/page/perCenter/accountInfor/accountInfor'
import positionList from '@/page/account/positionList/positionList'
import login from '@/page/login/login'
import addRole from '@/page/account/role/addRole'
import addUser from '@/page/account/userList/addUser/addUser'
import cityList from '@/page/contentInfo/cityList/cityList'
import customArea from '@/page/contentInfo/customArea/customArea'
import scenicList from '@/page/contentInfo/scenicList/scenicList'
import labelList from '@/page/contentInfo/labelList/labelList'
import materialList from '@/page/contentInfo/materialList/materialList'
import hotelList from '@/page/contentInfo/hotelList/hotelList'
import supplierInfo from '@/page/contentInfo/supplierInfo/supplierInfo'
import productList from '@/page/productManagement/productList/productList'
import baseInfo from '@/page/productManagement/listInfo/listInfo'
import travelTemplate from '@/page/productManagement/travelTemplate/travelTemplate'
import regimentPlan from '@/page/productManagement/regimentPlan/regimentPlan'
import planList from '@/page/productManagement/regimentPlan/children/planList'
import placeOrder from '@/page/productManagement/regimentPlan/children/placeOrder'
import sharedInventory from '@/page/productManagement/sharedInventory/sharedInventory'
import changePro from '@/page/productManagement/changePro/changePro'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/', redirect: 'login',
    }, {
      path: '/userList',
      component: userList,
      name: '用户列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/organList',
      component: organList,
      name: '组织列表',
      meta: {
        keepAlive: true,
        title:'组织列表',
        auth:true}
    }, {
      path: '/role',
      component: role,
      name: '角色模板',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/addRole',
      component: addRole,
      name: "添加角色权限模板",
      meta: {
        keepAlive: true,
        auth:true}
    },
    {
      path: '/perList',
      component: perList,
      name: '权限列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/accountInfor',
      component: accountInfor,
      name: '个人中心',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/login',
      component: login,
      meta: {
        keepAlive: false}
    }, {
      path: '/positionList',
      component: positionList,
      name: '职位列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/userList',
      component: userList,
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/userList/addUser',
      component: addUser,
      name: '用户添加',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/cityList',
      component: cityList,
      name: '区域列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/customArea',
      component: customArea,
      name: '自定义地区',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/scenicList',
      component: scenicList,
      name: '景点列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/labelList',
      component: labelList,
      name: '标签列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/materialList',
      component: materialList,
      name: '素材列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/hotelList',
      component: hotelList,
      name: '酒店列表',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/supplierInfo',
      component: supplierInfo,
      name: '供应商信息',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/productList',
      component: productList,
      name: '产品列表',
      meta: {
        keepAlive: true,
        auth:true}
    },{
      path: '/listInfo',
      component: baseInfo,
      name: '添加跟团游',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/travelTemplate',
      component: travelTemplate,
      name: '出行模板',
      meta: {
        keepAlive: true,
        auth:true}
    }, {
      path: '/regimentPlan',
      component: regimentPlan,
      name: '团期计划',
      children: [
        {
          path: 'planList',
          name: '团期计划',
          component: planList,
          meta: {
            keepAlive: true,
            auth:true},
          },
        {
          path: 'placeOrder',
          name: '团期计划',
          component: placeOrder,
          meta: {
            keepAlive: true,
            auth:true},
        }
      ]
    }, {
      path: '/sharedInventory',
      component: sharedInventory,
      name: '共享库存',
      meta: {
        keepAlive: true,
        auth:true}
    },{
      path: '/changePro',
      component: changePro,
      meta: {
        keepAlive: true,
        auth:true}
    },{
      path: '*',
      redirect:'/userList'
    }
  ],
})
