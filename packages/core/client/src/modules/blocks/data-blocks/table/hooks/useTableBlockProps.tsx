import { useEffect } from 'react';
import { ArrayField, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

import { findFilterTargets } from '../../../../../block-provider/hooks';
import { useTableBlockContext } from '../../../../../block-provider/TableBlockProvider';
import { useFilterBlock } from '../../../../../filter-provider/FilterProvider';
import { mergeFilter } from '../../../../../filter-provider/utils';
import { removeNullCondition } from '../../../../../schema-component';

export const useTableBlockProps = () => {
  const field = useField<ArrayField>();
  const fieldSchema = useFieldSchema();

  const ctx = useTableBlockContext();
  const globalSort = fieldSchema.parent?.['x-decorator-props']?.['dragSortBy'];
  const { getDataBlocks } = useFilterBlock();
  const isLoading = ctx?.service?.loading;
  const params = ctx?.service?.params;

  useEffect(() => {
    if (!isLoading) {
      const serviceResponse = ctx?.service?.data;
      const data = serviceResponse?.data || [];
      const meta = serviceResponse?.meta || {};
      const selectedRowKeys = ctx?.field?.data?.selectedRowKeys;

      if (!_.isEqual(field.value, data)) {
        field.value = data;
        field?.setInitialValue(data);
      }
      field.data = field.data || {};

      if (!_.isEqual(field.data.selectedRowKeys, selectedRowKeys)) {
        field.data.selectedRowKeys = selectedRowKeys;
      }

      field.componentProps.pagination = field.componentProps.pagination || {};
      field.componentProps.pagination.pageSize = meta?.pageSize;
      field.componentProps.pagination.total = meta?.count;
      field.componentProps.pagination.current = meta?.page;
    }
  }, [ctx?.field?.data?.selectedRowKeys, ctx?.service?.data, field, isLoading]);
  return {
    childrenColumnName: ctx.childrenColumnName,
    loading: ctx?.service?.loading,
    showIndex: ctx.showIndex,
    dragSort: ctx.dragSort && ctx.dragSortBy,
    rowKey: ctx.rowKey || 'id',
    pagination: fieldSchema?.['x-component-props']?.pagination === false ? false : field.componentProps.pagination,
    onRowSelectionChange(selectedRowKeys) {
      ctx.field.data = ctx?.field?.data || {};
      ctx.field.data.selectedRowKeys = selectedRowKeys;
      ctx?.field?.onRowSelect?.(selectedRowKeys);
    },
    async onRowDragEnd({ from, to }) {
      await ctx.resource.move({
        sourceId: from[ctx.rowKey || 'id'],
        targetId: to[ctx.rowKey || 'id'],
        sortField: ctx.dragSort && ctx.dragSortBy,
      });
      ctx.service.refresh();
    },
    onChange({ current, pageSize }, filters, sorter) {
      const parentSort = fieldSchema.parent?.['x-decorator-props']?.['params']?.sort;
      const sort = globalSort
        ? globalSort
        : sorter.order
          ? sorter.order === `ascend`
            ? [sorter.field]
            : [`-${sorter.field}`]
          : parentSort;
      // NOTE: 这里将原本就有的排序参数保留
      const sortParams = ctx.params.sort || [];
      const sortFinal = [...new Set([...sortParams, ...(sort || [])])];
      ctx.service.run({ ...ctx.service.params?.[0], page: current, pageSize, sort: sortFinal });
    },
    onClickRow(record, setSelectedRow, selectedRow) {
      const { targets, uid } = findFilterTargets(fieldSchema);
      const dataBlocks = getDataBlocks();

      // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
      if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
        // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
        // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
        setSelectedRow((prev) => (prev.length ? [] : prev));
        return;
      }

      const value = [record[ctx.rowKey]];

      dataBlocks.forEach((block) => {
        const target = targets.find((target) => target.uid === block.uid);
        if (!target) return;

        const param = block.service.params?.[0] || {};
        // 保留原有的 filter
        const storedFilter = block.service.params?.[1]?.filters || {};

        if (selectedRow.includes(record[ctx.rowKey])) {
          if (block.dataLoadingMode === 'manual') {
            return block.clearData();
          }
          delete storedFilter[uid];
        } else {
          storedFilter[uid] = {
            $and: [
              {
                [target.field || ctx.rowKey]: {
                  [target.field ? '$in' : '$eq']: value,
                },
              },
            ],
          };
        }

        const mergedFilter = mergeFilter([
          ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
          block.defaultFilter,
        ]);

        return block.doFilter(
          {
            ...param,
            page: 1,
            filter: mergedFilter,
          },
          { filters: storedFilter },
        );
      });

      // 更新表格的选中状态
      setSelectedRow((prev) => (prev?.includes(record[ctx.rowKey]) ? [] : [...value]));
    },
    onExpand(expanded, record) {
      ctx?.field.onExpandClick?.(expanded, record);
    },
  };
};
