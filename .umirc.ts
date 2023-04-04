import { defineConfig } from '@umijs/max';
import { PRIMARY_COLOR } from './src/constants';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  // https://umijs.org/docs/api/config#favicons
  favicons: ['/assets/uam-logo.png'],
  // 布局配置
  layout: {
    title: 'UAM-统一访问控制中心',
    locale: false,
  },
  // antd自定义主题
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': PRIMARY_COLOR,
  },
  // https://umijs.org/docs/api/config#proxy
  proxy: {
    '/uam': {
      target: 'http://127.0.0.1:8888/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // mock: false,
  routes: [
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      hideInMenu: true,
      name: '欢迎',
      path: '/welcome',
      component: '@/pages/Welcome',
    },
    {
      hideInMenu: true,
      name: '登录',
      path: '/login',
      component: '@/pages/Login',
      layout: false,
    },
    {
      hideInMenu: true,
      name: '注册',
      path: '/register',
      component: '@/pages/Register',
      layout: false,
    },

    {
      path: '/user',
      redirect: '/user/center',
    },
    {
      hideInMenu: true,
      name: '个人中心',
      path: '/user/center',
      component: '@/pages/UserCenter',
    },

    {
      name: '客户端',
      path: '/clients',
      component: '@/pages/ClientManage',
      access: 'accessPageClient',
    },
    {
      name: '用户',
      path: '/users',
      component: '@/pages/UserManage',
      access: 'accessPageUser',
    },
    {
      name: '组',
      path: '/groups',
      component: '@/pages/GroupManage',
      access: 'accessPageGroup',
    },
    {
      name: '角色',
      path: '/roles',
      component: '@/pages/RoleManage',
      access: 'accessPageRole',
    },
    {
      name: '权限',
      path: '/permissions',
      component: '@/pages/PermissionManage',
      access: 'accessPagePermission',
    },
    { path: '/*', component: '@/pages/404' },
  ],
  npmClient: 'pnpm',
});
