import { request } from '@umijs/max';

/** 获取登录用户信息 GET /uam/admin/v1/userinfo */
export async function getUserInfo() {
  return request<API.Resp<API.UserInfo>>(`/uam/admin/v1/userinfo`, {
    method: 'GET',
  });
}

/** 用户注册 POST /uam/admin/v1/register */
export async function register(payload: API.RegisterPayload) {
  return request<API.Resp<any>>(`/uam/admin/v1/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
}

/** 用户登录 POST /uam/admin/v1/login */
export async function login(payload: API.LoginPayload) {
  return request<API.Resp<any>>(`/uam/admin/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
}

/** 用户登出 PUT /uam/admin/v1/logout */
export async function logout() {
  return request<API.Resp<any>>(`/uam/admin/v1/logout`, {
    method: 'PUT',
  });
}
