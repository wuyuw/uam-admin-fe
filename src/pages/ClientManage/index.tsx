import MuiTheme from '@/components/MuiTheme';
import * as clientService from '@/services/client';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button as MuiButton,
  InputBase as MuiInputBase,
  Paper as MuiPaper,
} from '@mui/material';
import { useRequest } from 'ahooks';
import {
  Button as AntdButton,
  Form as AntdForm,
  Input as AntdInput,
  InputNumber as AntdInputNumber,
  message,
  Modal as AntdModal,
  Popconfirm as AntdPopconfirm,
  Radio as AntdRadio,
  Table as AntdTable,
  Tag as AntdTag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import styles from './index.less';

const { getClientList, addClient, updateClient, deleteClient } = clientService;

// 添加客户端
const handleAddClient = async (payload: CLI.AddClientPayload) => {
  const hide = message.loading('正在添加...');
  try {
    const resp = await addClient({ ...payload });
    hide();
    if (resp.code !== 0) {
      message.error('添加失败');
      return false;
    }
    message.success('添加成功');
    return true;
  } catch (error) {
    return false;
  }
};

// 更新客户端
const handleUpdateClient = async (payload: CLI.UpdateClientPayload) => {
  const hide = message.loading('正在更新...');
  try {
    const resp = await updateClient({ ...payload });
    hide();
    if (resp.code !== 0) {
      message.error('更新失败');
      return false;
    }
    message.success('更新成功');
    return true;
  } catch (error) {
    return false;
  }
};

// 删除客户端
const handleDeleteClient = async (id: number) => {
  const hide = message.loading('正在删除...');
  try {
    const resp = await deleteClient(id);
    hide();
    if (resp.code !== 0) {
      message.error('删除失败');
      return false;
    }
    message.success('删除成功');
    return true;
  } catch (error) {
    return false;
  }
};

// 接入客户端管理
const ClientManage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [form] = AntdForm.useForm();
  // 表单是否为添加状态
  const [isAddForm, setIsAddForm] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const { data: pageData, run: fetchClientList } = useRequest(() =>
    getClientList(),
  );

  const listData = useMemo(() => {
    if (search === '') {
      return pageData?.data;
    }
    return pageData?.data.filter(
      (value) =>
        value.name.indexOf(search) !== -1 ||
        value.app_code.indexOf(search) !== -1,
    );
  }, [search, pageData]);

  // 点击添加客户端
  const handleClickAdd = () => {
    setIsAddForm(true);
    setModalVisible(true);
    form.resetFields();
  };

  const handleClickEdit = (record: CLI.Client) => {
    const { id, name, app_code, department, maintainer, status } = record;
    setIsAddForm(false);
    setModalVisible(true);
    form.setFieldsValue({ id, name, app_code, department, maintainer, status });
  };

  const handleDelete = async (record: CLI.Client) => {
    const ok = await handleDeleteClient(record.id);
    if (ok) {
      fetchClientList();
    }
  };

  // 提交表单且数据验证成功后回调事件
  const formOnFinished = async (values: any) => {
    const { id, name, app_code, department, maintainer, status } = values;
    let ok: boolean;
    setFormLoading(true);
    if (isAddForm) {
      const payload = { name, app_code, department, maintainer };
      ok = await handleAddClient(payload);
    } else {
      const payload = { id, name, app_code, department, maintainer, status };
      ok = await handleUpdateClient(payload);
    }
    if (ok) {
      setModalVisible(false);
      fetchClientList();
    }
    setFormLoading(false);
  };

  const columns: ColumnsType<CLI.Client> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'APP_CODE',
      dataIndex: 'app_code',
    },
    {
      title: 'PRIVATE_KEY',
      dataIndex: 'private_key',
    },
    {
      title: '部门',
      dataIndex: 'department',
    },
    {
      title: '对接人',
      dataIndex: 'maintainer',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status: number) => {
        return (
          <AntdTag color={status === 0 ? 'success' : 'error'}>
            {status === 0 ? '正常' : '禁用'}
          </AntdTag>
        );
      },
    },
    {
      title: '接入时间',
      dataIndex: 'create_time',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
    },
    {
      title: '操作',
      render: (record: CLI.Client) => {
        if (record.type === 2) {
          return '';
        }
        return (
          <div>
            <AntdButton type="link" onClick={() => handleClickEdit(record)}>
              编辑
            </AntdButton>
            |
            <AntdPopconfirm
              title="确定删除该应用?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <AntdButton type="link">删除</AntdButton>
            </AntdPopconfirm>
          </div>
        );
      },
      align: 'center',
    },
  ];

  return (
    <PageContainer>
      <MuiTheme>
        <MuiPaper className={styles.paper}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderLeft}>
              <MuiPaper className={styles.searchControl}>
                <MuiInputBase
                  className={styles.searchInput}
                  placeholder="🔍 搜索..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </MuiPaper>
            </div>
            <div className={styles.tableHeaderRight}>
              <MuiButton
                className={styles.tagButton}
                variant="contained"
                color="primary"
                onClick={handleClickAdd}
              >
                客户端接入
              </MuiButton>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <MuiPaper>
              <AntdTable<CLI.Client>
                // style={{
                //   width: '100%',
                //   overflowX: 'auto',
                // }}
                scroll={{ x: 1200 }}
                rowKey="id"
                columns={columns}
                dataSource={listData}
                className={styles['ant-table']}
              />
            </MuiPaper>
          </div>
          <AntdModal
            width={600}
            centered={true}
            title={`${isAddForm ? '添加' : '更新'}客户端`}
            visible={modalVisible}
            onOk={() => form.submit()}
            confirmLoading={formLoading}
            onCancel={() => setModalVisible(false)}
            okButtonProps={{ type: 'primary' }}
          >
            <AntdForm
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              form={form}
              autoComplete="off"
              onFinish={formOnFinished}
            >
              <AntdForm.Item name="id" hidden={true}>
                <AntdInputNumber />
              </AntdForm.Item>
              <AntdForm.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入客户端名称' }]}
              >
                <AntdInput />
              </AntdForm.Item>
              <AntdForm.Item
                name="app_code"
                label="APP_CODE"
                rules={[{ required: true, message: '请输入APP_CODE' }]}
              >
                <AntdInput disabled={!isAddForm} />
              </AntdForm.Item>
              <AntdForm.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请输入应用所属部门' }]}
              >
                <AntdInput />
              </AntdForm.Item>
              <AntdForm.Item
                name="maintainer"
                label="对接人"
                rules={[{ required: true, message: '请输入应用对接人' }]}
              >
                <AntdInput />
              </AntdForm.Item>
              <AntdForm.Item name="status" label="状态" hidden={isAddForm}>
                <AntdRadio.Group buttonStyle="solid">
                  <AntdRadio.Button value={0}>启用</AntdRadio.Button>
                  <AntdRadio.Button value={1}>禁用</AntdRadio.Button>
                </AntdRadio.Group>
              </AntdForm.Item>
            </AntdForm>
          </AntdModal>
        </MuiPaper>
      </MuiTheme>
    </PageContainer>
  );
};

export default ClientManage;
