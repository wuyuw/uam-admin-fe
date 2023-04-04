import { request } from '@umijs/max';

/** 获取权限分页列表 GET /uam/admin/v1/permissions */
export async function getPermPagList(payload: PERM.GetPagListPayload) {
  return request<API.Resp<API.PaginateList<PERM.Perm>>>(
    `/uam/admin/v1/permissions`,
    {
      method: 'GET',
      params: payload,
    },
  );
}

/** 添加权限 POST /uam/admin/v1/permission */
export async function addPerm(payload: PERM.AddPermPayload) {
  return request<API.Resp<any>>(`/uam/admin/v1/permission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  });
}

/** 更新权限 PUT /uam/admin/v1/permission/${id} */
export async function updatePerm(payload: PERM.UpdatePermPayload) {
  const { id, ...body } = payload;
  return request<API.Resp<any>>(`/uam/admin/v1/permission/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除权限 DELETE /uam/admin/v1/permission/${id} */
export async function deletePerm(id: number) {
  return request<API.Resp<any>>(`/uam/admin/v1/permission/${id}`, {
    method: 'DELETE',
  });
}
