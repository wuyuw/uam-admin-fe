declare namespace ROLE {
  interface Role {
    id: number;
    client_id: number;
    name: string;
    desc: string;
    editable: number;
    create_time?: string;
    update_time?: string;
    permissions: string[];
  }

  // 查询角色参数
  interface GetRolePayload {
    client_id: number;
    editable: string;
  }

  // 添加角色参数
  interface AddRolePayload {
    client_id: number;
    name: string;
    desc: string;
    permissions: string[];
  }

  // 更新角色参数
  interface UpdateRolePayload {
    id: number;
    client_id: number;
    name: string;
    desc: string;
    permissions: string[];
  }
}
