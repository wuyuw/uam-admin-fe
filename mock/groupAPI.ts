const groupList = [
  {
    id: 1,
    client_id: 1,
    name: '管理员组',
    desc: '管理员组',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    roles: [1],
  },
  {
    id: 2,
    client_id: 1,
    name: '访客组',
    desc: '访客组',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    roles: [2],
  },
  {
    id: 3,
    client_id: 1,
    name: '报告组',
    desc: '报告组',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    roles: [3],
  },
  {
    id: 4,
    client_id: 1,
    name: '运营组',
    desc: '运营组',
    create_time: '2022/08/01 12:00',
    update_time: '2022/08/01 12:00',
    roles: [4],
  },
];

export default {
  'GET /uam/admin/v1/groups': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: groupList,
    });
  },
  'POST /uam/admin/v1/group': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'PUT /uam/admin/v1/group/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
  'DELETE /uam/admin/v1/group/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
};
