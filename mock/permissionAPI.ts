const pagPermList = [
  {
    id: 1,
    client_id: 1,
    type: 'API',
    key: 'get /api/v1/userinfo',
    name: '用户-获取用户信息',
    desc: '用户-获取用户信息',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 2,
    client_id: 1,
    type: 'API',
    key: 'get /api/v1/tasks',
    name: '任务管理-获取任务列表',
    desc: '任务管理-获取任务列表',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 3,
    client_id: 1,
    type: 'API',
    key: 'post /api/v1/task',
    name: '任务管理-新建任务',
    desc: '任务管理-新建任务',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 4,
    client_id: 1,
    type: 'API',
    key: 'put /api/v1/task/:id',
    name: '任务管理-更新任务',
    desc: '任务管理-更新任务',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 5,
    client_id: 1,
    type: 'API',
    key: 'delete /api/v1/task/:id',
    name: '任务管理-删除任务',
    desc: '任务管理-删除任务',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 6,
    client_id: 1,
    type: 'API',
    key: 'get /api/v1/products',
    name: '库存管理-获取商品列表',
    desc: '库存管理-获取商品列表',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 7,
    client_id: 1,
    type: 'API',
    key: 'post /api/v1/product',
    name: '库存管理-新建商品',
    desc: '库存管理-新建商品',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 8,
    client_id: 1,
    type: 'API',
    key: 'put /api/v1/product/:id',
    name: '库存管理-更新商品',
    desc: '库存管理-更新商品',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
  {
    id: 9,
    client_id: 1,
    type: 'API',
    key: 'delete /api/v1/product/:id',
    name: '库存管理-删除商品',
    desc: '库存管理-删除商品',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
  },
];

export default {
  'GET /uam/admin/v1/permissions': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {
        page: 1,
        pageSize: 10,
        total: 9,
        list: pagPermList,
      },
    });
  },
  'POST /uam/admin/v1/permission': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'PUT /uam/admin/v1/permission/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'DELETE /uam/admin/v1/permission/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
};
