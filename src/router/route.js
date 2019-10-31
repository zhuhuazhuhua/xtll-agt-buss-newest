
import Layout from 'src/pages/layout/layout';

// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('src/pages/login/login')
};

// 错误页面
export const errorRouter = {
  path: '/error/:code',
  name: 'error',
  meta: {
    title: 'error'
  },
  component: () =>
    import('src/pages/error/index')
};

// 作为main组件子页面展示  但不在左侧菜单显示的路由卸载otherRoter里
export const otherRouter = {
  path: '',
  name: 'otherRouter',
  redirect: '/home/agt',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [
    {
      path: 'credential',
      name: 'credential',
      title: '我的资质',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/credential/credential')
    },
    {
      path: 'power',
      name: 'power',
      title: '权限管理',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/power/power')
    },
    {
      path: 'goods',
      name: 'goods',
      title: '商品信息',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/goods/goods')
    },
    {
      path: 'exam',
      name: 'exam',
      title: '在售商品',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/goods/exam')
    },
    {
      path: 'sale',
      name: 'sale',
      title: '商品审核',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/goods/sale')
    },
    {
      path: 'order',
      name: 'order',
      title: '商品管理',
      meta: {
        requireAuth: true
      },
      component: () => import('src/pages/order/order')
    },
    {
      path: 'home',
      name: 'home',
      title: '管理员',
      redirect: '/home/sorts/passed',
      meta: {
        requireAuth: true
      },
      component: Layout,
      children: [
        {
          path: 'agt',
          name: 'agt',
          title: '管理员',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/agt')
        },
        {
          path: 'sorts/passed',
          name: 'passed',
          title: '正式商户',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/sorts/passed')
        },
        {
          path: 'sorts/internal',
          name: 'internal',
          title: '商户内审进度查询',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/sorts/internal')
        },
        {
          path: 'sorts/external',
          name: 'external',
          title: '商户外审(总部)进度查询',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/sorts/external')
        },
        {
          path: 'buss',
          name: 'buss',
          title: '商户账号管理',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/buss')
        },
        {
          path: 'information',
          name: 'information',
          title: '物料上传',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/information')
        },
        {
          path: 'set',
          name: 'set',
          title: '商品详情',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/home/set')
        }
      ]
    },
    {
      path: '/agtFinancial',
      name: 'agtFinancial',
      title: '代理商财务系统',
      redirect: '/agtFinancial/buss',
      meta: {
        requireAuth: true
      },
      component: Layout,
      children: [
        {
          path: 'buss',
          name: 'buss',
          title: '代理商下的商户金流列表',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/agtFinancial/buss')
        }
      ]
    },
    {
      path: '/bussFinancial',
      name: 'bussFinancial',
      title: '商户财务系统',
      redirect: '/bussFinancial/goods',
      meta: {
        requireAuth: true
      },
      component: Layout,
      children: [
        {
          path: 'goods',
          name: 'goods',
          title: '商户金流',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/bussFinancial/goods')
        },
        {
          path: 'order',
          name: 'order',
          title: '订单金流',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/bussFinancial/order')
        },
        {
          path: 'Withdraw',
          name: 'Withdraw',
          title: '提现',
          meta: {
            requireAuth: true
          },
          component: () => import('src/pages/bussFinancial/withdraw')
        }
      ]
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里

export const routers = [
  loginRouter,
  errorRouter,
  otherRouter
];
