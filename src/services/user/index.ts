import { request } from '@umijs/max';

/** 获取用户列表 GET /uam/admin/v1/users */
export async function getUserPageList(payload: USER.GetUserPageListPayload) {
  return request<API.Resp<API.PaginateList<USER.User>>>(`/uam/admin/v1/users`, {
    method: 'GET',
    params: payload,
  });
}

/** 更新用户权限 PUT /uam/admin/v1/user/${uid} */
export async function updateUserPerms(payload: USER.UpdateUserPermsPayload) {
  const { uid, ...body } = payload;
  return request<API.Resp<any>>(`/uam/admin/v1/user/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}
