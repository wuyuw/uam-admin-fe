import { request } from '@umijs/max';

/** 获取客户端所有角色列表 GET /uam/admin/v1/roles */
export async function getRoleList(payload: ROLE.GetRolePayload) {
  return request<API.Resp<Array<ROLE.Role>>>(`/uam/admin/v1/roles`, {
    method: 'GET',
    params: payload,
  });
}

/** 添加角色 POST /uam/admin/v1/role */
export async function addRole(payload: ROLE.AddRolePayload) {
  return request<API.Resp<any>>(`/uam/admin/v1/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  });
}

/** 更新角色 PUT /uam/admin/v1/role/${id} */
export async function updateRole(payload: ROLE.UpdateRolePayload) {
  const { id, ...body } = payload;
  return request<API.Resp<any>>(`/uam/admin/v1/role/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除角色 DELETE /uam/admin/v1/role/${id} */
export async function deleteRole(id: number) {
  return request<API.Resp<any>>(`/uam/admin/v1/role/${id}`, {
    method: 'DELETE',
  });
}
