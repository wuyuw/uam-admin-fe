const pageUserList = [
  {
    uid: 1,
    userName: '孙悟空',
    nickname: '卡卡罗特',
    groups: [1, 2, 3, 4],
    roles: [],
  },
  {
    uid: 2,
    userName: '孙悟饭',
    nickname: '野比饭',
    groups: [3],
    roles: [],
  },
  {
    uid: 3,
    userName: '贝吉塔',
    nickname: '王子',
    groups: [4],
    roles: [],
  },
];

export default {
  'GET /uam/admin/v1/users': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {
        page: 1,
        pageSize: 10,
        total: 3,
        list: pageUserList,
      },
    });
  },
  'PUT /uam/admin/v1/user/1': (req: any, res: any) => {
    res.json({
      code: 0,
      msg: '操作成功',
      data: {},
    });
  },
};
