import { Table, Transfer } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antd/es/table/interface';
import type { TransferItem, TransferProps } from 'antd/es/transfer';
import difference from 'lodash/difference';

interface TableTransferProps<RecordType> extends TransferProps<RecordType> {
  pagination: false | TablePaginationConfig;
  scroll?: {
    x?: string | number | true | undefined;
    y?: string | number | undefined;
  };
  leftColumns: ColumnsType<RecordType>;
  rightColumns: ColumnsType<RecordType>;
}

// Customize Table Transfer
const TableTransfer = <RecordType,>({
  pagination,
  scroll,
  leftColumns,
  rightColumns,
  ...restProps
}: TableTransferProps<RecordType>) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item: any) => ({
          disabled: listDisabled || item.disabled,
        }),
        onSelectAll: (selected: any, selectedRows: any) => {
          const treeSelectedKeys = selectedRows
            .filter((item: any) => !item.disabled)
            .map(({ key }: any) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect: ({ key }: any, selected: boolean) => {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          pagination={pagination}
          scroll={scroll}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(
                key as string,
                !listSelectedKeys.includes(key as string),
              );
            },
          })}
        />
      );
    }}
  </Transfer>
);

export default TableTransfer;
