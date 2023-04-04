const roleList = [
  {
    id: 1,
    client_id: 1,
    name: '系统管理员',
    desc: '系统管理员',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    permissions: [
      'get /api/v1/userinfo',
      'get /api/v1/tasks',
      'post /api/v1/task',
      'put /api/v1/task/:id',
      'delete /api/v1/task/:id',
      'get /api/v1/products',
      'post /api/v1/product',
      'put /api/v1/product/:id',
      'delete /api/v1/product/:id',
    ],
  },
  {
    id: 2,
    client_id: 1,
    name: '访客',
    desc: '访客',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    permissions: ['get /api/v1/userinfo'],
  },
  {
    id: 3,
    client_id: 1,
    name: '报告管理员',
    desc: '报告管理员',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    permissions: [
      'get /api/v1/userinfo',
      'get /api/v1/tasks',
      'post /api/v1/task',
      'put /api/v1/task/:id',
      'delete /api/v1/task/:id',
    ],
  },
  {
    id: 4,
    client_id: 1,
    name: '库存管理员',
    desc: '库存管理员',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    permissions: [
      'get /api/v1/userinfo',
      'get /api/v1/products',
      'post /api/v1/product',
      'put /api/v1/product/:id',
      'delete /api/v1/product/:id',
    ],
  },
];

export default {
  'GET /uam/admin/v1/roles': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: roleList,
    });
  },
  'POST /uam/admin/v1/role': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'PUT /uam/admin/v1/role/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'DELETE /uam/admin/v1/role/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
};
