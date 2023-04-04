declare namespace API {
  // 统一响应格式
  interface Resp<T> {
    code: number;
    msg: string;
    data: T;
  }

  // 分页列表统一响应格式
  interface PaginateList<R> {
    page: number;
    pageSize: number;
    total: number;
    list: Array<R>;
  }

  // 用户信息
  interface UserInfo {
    uid?: number;
    nickname: string;
    email: string;
    phone: string;
    permissions: string[];
  }

  // 注册表单参数
  interface RegisterPayload {
    username: string;
    password: string;
    dupPassword: string;
  }

  // 登录表单参数
  interface LoginPayload {
    username: string;
    password: string;
  }
}
