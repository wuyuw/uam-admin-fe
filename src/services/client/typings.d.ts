declare namespace CLI {
  interface Client {
    id: number;
    name: string;
    app_code: string;
    private_key: string;
    department: string;
    maintainer: string;
    status: number;
    type: number;
    create_time: string;
    update_time: string;
  }

  // 客户端可选项
  interface ClientOption {
    id: number;
    name: string;
    app_code: string;
    groups: Array<GROUP.Group>; // 组可选项
    roles: Array<ROLE.Role>; // 角色可选项
    perms: Array<PERM.Perm>; // 权限可选项
    permTypes: Array<string>; // 权限类型可选项
  }

  // 添加客户端参数
  interface AddClientPayload {
    name: string;
    app_code: string;
    department: string;
    maintainer: string;
  }

  interface UpdateClientPayload {
    id: number;
    name: string;
    app_code: string;
    department: string;
    maintainer: string;
    status: number;
  }
}
