declare namespace PERM {
  interface Perm {
    id: number;
    client_id: number;
    type: string;
    key: string;
    name: string;
    desc: string;
    editable: number;
    create_time?: string;
    update_time?: string;
  }

  // 分页列表
  interface GetPagListPayload {
    page: number;
    pageSize: number;
    client_id: number; // 客户端筛选
    type: string; // 类型筛选
    editable: string;
    search: string; // 模糊检索
  }

  // 添加权限参数
  interface AddPermPayload {
    client_id: number;
    type: string;
    key: string;
    name: string;
    desc: string;
  }

  // 更新权限参数
  interface UpdatePermPayload {
    id: number;
    client_id: number;
    type: string;
    key: string;
    name: string;
    desc: string;
  }
}
