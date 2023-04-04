const clientList = [
  {
    id: 1,
    name: '安全运营中心',
    app_code: 'soc',
    private_key: '99ddd135f0a77480c6a7cec009e3dcd4',
    department: '安全组',
    maintainer: '吴彦祖',
    status: 0,
    create_time: '2022/07/20 12:01',
    update_time: '2022/07/20 12:01',
  },
  {
    id: 2,
    name: '测试管理平台',
    app_code: 'qfc',
    private_key: 'f86a06cce44928c510524a506283d530',
    department: '测试组',
    maintainer: '孙悟空',
    status: 1,
    create_time: '2022/07/20 12:01',
    update_time: '2022/07/20 12:01',
  },
];

const clientOptions = [
  {
    id: 1,
    name: '安全运营中心',
    app_code: 'soc',
    groups: [
      {
        id: 1,
        client_id: 1,
        name: '管理员',
        desc: 'SOC管理员',
      },
      {
        id: 2,
        client_id: 1,
        name: '访客组',
        desc: '访客组',
      },
      {
        id: 3,
        client_id: 1,
        name: '报告组',
        desc: '报告组',
      },
      {
        id: 4,
        client_id: 1,
        name: '运营组',
        desc: '运营组',
      },
    ],
    roles: [
      {
        id: 1,
        client_id: 1,
        name: '系统管理员',
        desc: '系统管理员',
      },
      {
        id: 2,
        client_id: 1,
        name: '访客',
        desc: '访客',
      },
      {
        id: 3,
        client_id: 1,
        name: '报告管理员',
        desc: '报告管理员',
      },
      {
        id: 4,
        client_id: 1,
        name: '库存管理员',
        desc: '库存管理员',
      },
    ],
    perms: [
      {
        id: 1,
        client_id: 1,
        type: 'API',
        key: 'get /api/v1/userinfo',
        name: '用户-获取用户信息',
        desc: '用户-获取用户信息',
      },
      {
        id: 2,
        client_id: 1,
        type: 'API',
        key: 'get /api/v1/tasks',
        name: '任务管理-获取任务列表',
        desc: '任务管理-获取任务列表',
      },
      {
        id: 3,
        client_id: 1,
        type: 'API',
        key: 'post /api/v1/task',
        name: '任务管理-新建任务',
        desc: '任务管理-新建任务',
      },
      {
        id: 4,
        client_id: 1,
        type: 'API',
        key: 'put /api/v1/task/:id',
        name: '任务管理-更新任务',
        desc: '任务管理-更新任务',
      },
      {
        id: 5,
        client_id: 1,
        type: 'API',
        key: 'delete /api/v1/task/:id',
        name: '任务管理-删除任务',
        desc: '任务管理-删除任务',
      },
      {
        id: 6,
        client_id: 1,
        type: 'API',
        key: 'get /api/v1/products',
        name: '库存管理-获取商品列表',
        desc: '库存管理-获取商品列表',
      },
      {
        id: 7,
        client_id: 1,
        type: 'API',
        key: 'post /api/v1/product',
        name: '库存管理-新建商品',
        desc: '库存管理-新建商品',
      },
      {
        id: 8,
        client_id: 1,
        type: 'API',
        key: 'put /api/v1/product/:id',
        name: '库存管理-更新商品',
        desc: '库存管理-更新商品',
      },
      {
        id: 9,
        client_id: 1,
        type: 'API',
        key: 'delete /api/v1/product/:id',
        name: '库存管理-删除商品',
        desc: '库存管理-删除商品',
      },
    ],
    permTypes: ['API', '页面'],
  },
  {
    id: 2,
    name: '测试管理平台',
    app_code: 'qfc',
    groups: [
      {
        id: 4,
        client_id: 2,
        name: '管理员',
        desc: 'SOC管理员',
      },
      {
        id: 5,
        client_id: 2,
        name: 'SDL',
        desc: 'SDL组',
      },
      {
        id: 6,
        client_id: 2,
        name: '运营',
        desc: '运营组',
      },
    ],
    roles: [
      {
        id: 4,
        client_id: 2,
        name: '管理员',
        desc: 'SOC管理员',
      },
      {
        id: 5,
        client_id: 2,
        name: 'SDL',
        desc: 'SDL角色',
      },
      {
        id: 6,
        client_id: 2,
        name: '运营',
        desc: '运营角色',
      },
    ],
    perms: [],
    permTypes: ['API', '页面', '行为'],
  },
];

export default {
  'GET /uam/admin/v1/clients': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: clientList,
    });
  },
  'POST /uam/admin/v1/client': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'PUT /uam/admin/v1/client/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'DELETE /uam/admin/v1/client/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'GET /uam/admin/v1/client-options': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: clientOptions,
    });
  },
};
