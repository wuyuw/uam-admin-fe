declare namespace USER {
  interface User {
    uid: number;
    userNumber?: string;
    userCode?: string;
    userName: string;
    nickname: string;
    email: string;
    userType?: number;
    isVirtualUser?: number;
    groups: number[];
    roles: number[];
  }

  // 获取用户分页列表
  interface GetUserPageListPayload {
    page: number;
    pageSize: number;
    client_id: number; // 客户端筛选
    group_id: number; // 组筛选
    role_id: number; // 角色筛选
    search: string; // 模糊检索
  }

  // 更新用户权限参数
  interface UpdateUserPermsPayload {
    uid: number;
    client_id: number;
    groups: number[];
    roles: number[];
  }
}
