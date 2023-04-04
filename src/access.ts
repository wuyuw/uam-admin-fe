export default (initialState: { currentUser?: API.UserInfo }) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access
  let accessPageClient = false,
    accessPageUser = false,
    accessPageGroup = false,
    accessPageRole = false,
    accessPagePermission = false;

  if (initialState && initialState.currentUser) {
    const permissions = initialState.currentUser?.permissions;
    accessPageClient = !!permissions.includes('GET /uam/admin/v1/clients');
    accessPageUser = !!permissions.includes('GET /uam/admin/v1/users');
    accessPageGroup = !!permissions.includes('GET /uam/admin/v1/groups');
    accessPageRole = !!permissions.includes('GET /uam/admin/v1/roles');
    accessPagePermission = !!permissions.includes(
      'GET /uam/admin/v1/permissions',
    );
  }

  return {
    accessPageClient,
    accessPageUser,
    accessPageGroup,
    accessPageRole,
    accessPagePermission,
  };
};
