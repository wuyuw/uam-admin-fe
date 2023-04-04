import { request } from '@umijs/max';

/** 获取客户端所有组列表 GET /uam/admin/v1/groups */
export async function getGroupList(payload: GROUP.GetGroupPayload) {
  return request<API.Resp<Array<GROUP.Group>>>(`/uam/admin/v1/groups`, {
    method: 'GET',
    params: payload,
  });
}

/** 添加组 POST /uam/admin/v1/group */
export async function addGroup(payload: GROUP.AddGroupPayload) {
  return request<API.Resp<any>>(`/uam/admin/v1/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  });
}

/** 更新组 PUT /uam/admin/v1/group/${id} */
export async function updateGroup(payload: GROUP.UpdateGroupPayload) {
  const { id, ...body } = payload;
  return request<API.Resp<any>>(`/uam/admin/v1/group/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除组 DELETE /uam/admin/v1/group/${id} */
export async function deleteGroup(id: number) {
  return request<API.Resp<any>>(`/uam/admin/v1/group/${id}`, {
    method: 'DELETE',
  });
}
