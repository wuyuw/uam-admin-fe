const currentUser = {
  uid: 515,
  userName: '东湖吴彦祖',
  email: 'wuyuw515@gmail.com',
  permissions: [
    'uam-admin',
    'GET /uam/admin/v1/clients',
    'POST /uam/admin/v1/client',
    'PUT /uam/admin/v1/client/:id',
    'DELETE /uam/admin/v1/client/:id',
    'GET /uam/admin/v1/client-options',
    'GET /uam/admin/v1/permissions',
    'POST /uam/admin/v1/permission',
    'PUT /uam/admin/v1/permission/:id',
    'DELETE /uam/admin/v1/permission/:id',
    'GET /uam/admin/v1/roles',
    'POST /uam/admin/v1/role',
    'PUT /uam/admin/v1/role/:id',
    'DELETE /uam/admin/v1/role/:id',
    'GET /uam/admin/v1/groups',
    'POST /uam/admin/v1/group',
    'PUT /uam/admin/v1/group/:id',
    'DELETE /uam/admin/v1/group/:id',
    'GET /uam/admin/v1/users',
    'PUT /uam/admin/v1/user/:uid',
  ],
};

export default {
  'GET /uam/admin/v1/userinfo': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: currentUser,
    });
  },
  'PUT /uam/admin/v1/logout': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
};
