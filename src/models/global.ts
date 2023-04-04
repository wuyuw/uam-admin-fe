// 全局共享数据示例
import { getClientOptions } from '@/services/client';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export default () => {
  const [clientOptions, setClientOptions] = useState<Array<CLI.ClientOption>>(
    [],
  );
  const [clientNameMap, setClientNameMap] = useState<Map<number, string>>(
    new Map<number, string>(),
  );
  const [selectedClient, setSelectedClient] = useState<number | string>('');

  const fetchClientOptions = useCallback(async () => {
    try {
      const resp = await getClientOptions();
      if (resp.code === 0) {
        setClientOptions(resp.data);
        const map = new Map<number, string>();
        if (resp.data.length > 0) {
          resp.data.forEach((client) => {
            map.set(client.id, client.name);
          });
        }
        setClientNameMap(map);
      }
    } catch (error) {
      message.error('请求失败');
    }
  }, []);
  return {
    clientNameMap,
    clientOptions,
    fetchClientOptions,
    selectedClient,
    setSelectedClient,
  };
};
