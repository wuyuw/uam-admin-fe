import { request } from '@umijs/max';

/** 获取已接入客户端列表 GET /uam/admin/v1/clients */
export async function getClientList() {
  return request<API.Resp<Array<CLI.Client>>>(`/uam/admin/v1/clients`, {
    method: 'GET',
  });
}

/** 新增客户端 POST /uam/admin/v1/client */
export async function addClient(payload: CLI.AddClientPayload) {
  return request<API.Resp<any>>('/uam/admin/v1/client', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
}

/** 更新客户端 PUT /uam/admin/v1/client/${id} */
export async function updateClient(payload: CLI.UpdateClientPayload) {
  const { id, ...body } = payload;
  return request<API.Resp<any>>(`/uam/admin/v1/client/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 删除客户端 DELETE /uam/admin/v1/client/${id} */
export async function deleteClient(id: number) {
  return request<API.Resp<any>>(`/uam/admin/v1/client/${id}`, {
    method: 'DELETE',
  });
}

/** 获取有操作权限的客户端可选项 GET /uam/admin/v1/client-options */
export async function getClientOptions() {
  return request<API.Resp<Array<CLI.ClientOption>>>(
    `/uam/admin/v1/client-options`,
    {
      method: 'GET',
    },
  );
}
