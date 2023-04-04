declare namespace GROUP {
  interface Group {
    id: number;
    client_id: number;
    name: string;
    desc: string;
    editable: number;
    create_time?: string;
    update_time?: string;
    roles: number[];
  }

  // 查询组参数
  interface GetGroupPayload {
    client_id: number;
    editable: string;
  }

  // 添加组参数
  interface AddGroupPayload {
    client_id: number;
    name: string;
    desc: string;
    roles: number[];
  }

  // 更新组参数
  interface UpdateGroupPayload {
    id: number;
    client_id: number;
    name: string;
    desc: string;
    roles: number[];
  }
}
