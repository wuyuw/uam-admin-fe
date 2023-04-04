import uamLogo from '@/assets/uam-logo.png';
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { STATUS_FORBIDDEN, STATUS_NOLOGIN, STATUS_OK } from '@/constants';
import { BasicLayoutProps } from '@ant-design/pro-layout';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  RequestConfig,
} from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import { getUserInfo } from './services/core';

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const resp = await getUserInfo();
    if (resp.code !== STATUS_OK) {
      return undefined;
    }
    return resp.data;
  } catch (error) {
    message.error('用户信息获取失败');
  }
  return undefined;
};

const NoAuthLocations = ['/login', '/register'];

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
// https://umijs.org/zh-CN/plugins/plugin-initial-state
export async function getInitialState() {
  console.log(history.location.pathname);

  if (NoAuthLocations.includes(history.location.pathname)) {
    return {};
  }
  const currentUser = await fetchUserInfo();
  return {
    currentUser,
  };
}

// 运行时配置
export const layout = ({
  initialState,
}: {
  // 类型自定义，由 `initialState` 插件提供
  initialState: { currentUser?: API.UserInfo };
}): BasicLayoutProps => {
  return {
    layout: 'mix',
    logo: uamLogo,
    headerTheme: 'light',
    headerHeight: 60,
    navTheme: 'light',
    waterMarkProps: {
      content: initialState?.currentUser?.email,
      fontSize: 20,
    },
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer copyright={`${new Date().getFullYear()} UAM`} />,
  };
};

// https://umijs.org/docs/max/request#%E8%BF%90%E8%A1%8C%E6%97%B6%E9%85%8D%E7%BD%AE
// @umijs/plugin-request 运行时配置 https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  timeout: 5000,
  errorConfig: {},
  requestInterceptors: [
    (config: AxiosRequestConfig) => {
      // console.log("请求拦截器");
      return config;
    },
  ],
  responseInterceptors: [
    // 接口返回未登录状态码时，根据返回的redirect地址进行重定向到登录页面
    // 异常请求提示错误信息
    (response: AxiosResponse) => {
      const resp = response.data;
      if (resp.code === STATUS_NOLOGIN) {
        history.push('/login');
      } else if (resp.code === STATUS_FORBIDDEN) {
        message.error('无访问权限');
        history.push('/');
      } else if (resp.code !== STATUS_OK) {
        message.error(resp.msg || '操作失败');
        return response;
      }
      return response;
    },
  ],
};
