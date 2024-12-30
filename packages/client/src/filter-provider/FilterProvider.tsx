import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { uniqBy } from 'lodash';

import { useBlockRequestContext } from '../block-provider/BlockProvider';
import { CollectionFieldOptions_deprecated, useCollection_deprecated } from '../collection-manager';
import { useDataLoadingMode } from '../modules/blocks/data-blocks/details-multi/setDataLoadingModeSettingsItem';
import { removeNullCondition } from '../schema-component';
import { mergeFilter, useAssociatedFields } from './utils';

enum FILTER_OPERATOR {
  AND = '$and',
  OR = '$or',
}

export type FilterParam = {
  [K in FILTER_OPERATOR]?: any;
};

export interface ForeignKeyField {
  /** 外键字段所在的数据表的名称 */
  collectionName: string;
  isForeignKey: boolean;
  key: string;
  name: string;
  parentKey: null | string;
  reverseKey: null | string;

  [key: string]: any;
}

type Collection = ReturnType<typeof useCollection_deprecated>;

export interface DataBlock {
  /** 唯一标识符，schema 中的 name 值 */
  uid: string;
  /** 用户自行设置的卡片名称 */
  title?: string;
  /** 与数据卡片相关的数据表信息 */
  collection: Collection;
  /** 根据提供的参数执行该方法即可刷新数据卡片的数据 */
  doFilter: (params: any, params2?: any) => Promise<void>;
  /** 清除筛选卡片设置的筛选参数 */
  clearFilter: (uid: string) => void;
  /** 将数据卡片的数据置为空 */
  clearData: () => void;
  /** 数据卡片表中所有的关系字段 */
  associatedFields?: CollectionFieldOptions_deprecated[];
  /** 数据卡片表中所有的外键字段 */
  foreignKeyFields?: ForeignKeyField[];
  /** 数据卡片已经存在的过滤条件（通过 `设置数据范围` 或者其它能设置筛选条件的功能） */
  defaultFilter?: FilterParam;
  /** 数据卡片用于请求数据的接口 */
  service?: any;
  /** 数据卡片所的 DOM 容器 */
  dom: HTMLElement;
  /**
   * auto: 数据卡片会在初始渲染时请求数据
   * manual: 只有当点击了筛选按钮，才会请求数据
   */
  dataLoadingMode?: 'auto' | 'manual';
}

interface FilterContextValue {
  dataBlocks: DataBlock[];
  setDataBlocks: React.Dispatch<React.SetStateAction<DataBlock[]>>;
}

const FilterContext = createContext<FilterContextValue>(null);
FilterContext.displayName = 'FilterContext';

/**
 * 主要用于记录当前页面中的数据卡片的信息，用于在过滤卡片中使用
 * @param props
 * @returns
 */
export const FilterBlockProvider = ({ children }) => {
  const [dataBlocks, setDataBlocks] = React.useState<DataBlock[]>([]);
  return <FilterContext.Provider value={{ dataBlocks, setDataBlocks }}>{children}</FilterContext.Provider>;
};

// 用于通知 FilterBlockProvider 中的数据卡片更新
const ContextFilterCollector = React.createContext({ changeCount: 0 });
export const ProviderContextFilterCollector = ContextFilterCollector.Provider;
export function useContextFilterCollector() {
  return useContext(ContextFilterCollector);
}
/**
 * 用于收集当前页面中的数据卡片的信息，用于在过滤卡片中使用
 * @param param0
 * @returns
 */
export const DataBlockCollector = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { filter: FilterParam };
}) => {
  const collection = useCollection_deprecated();
  const { recordDataBlocks, removeDataBlock } = useFilterBlock();
  const ctx = useBlockRequestContext();
  const service = ctx.service;

  const field = useField();
  const fieldSchema = useFieldSchema();
  const associatedFields = useAssociatedFields();
  const container = useRef(null);
  const dataLoadingMode = useDataLoadingMode();
  const [changeCount, setChangeCount] = React.useState(0);
  console.log('%c Line:112 🥒 changeCount', 'font-size:18px;color:#6ec1c2;background:#f5ce50', changeCount);

  const shouldApplyFilter =
    field.decoratorType !== 'FilterFormBlockProvider' &&
    field.decoratorType !== 'FormBlockProvider' &&
    field.decoratorProps.blockType !== 'filter';

  const addBlockToDataBlocks = useCallback(() => {
    recordDataBlocks({
      uid: fieldSchema['x-uid'],
      title: field.componentProps.title,
      doFilter: service?.runAsync,
      collection,
      associatedFields,
      foreignKeyFields: collection.foreignKeyFields as ForeignKeyField[],
      defaultFilter: params?.filter || {},
      service,
      dom: container.current,
      dataLoadingMode,
      clearFilter(uid: string) {
        const param = this.service.params?.[0] || {};
        const storedFilter = this.service.params?.[1]?.filters || {};
        delete storedFilter[uid];
        const mergedFilter = mergeFilter([
          ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
          params?.filter || {},
        ]);

        this.service.run(
          {
            ...param,
            page: 1,
            filter: mergedFilter,
          },
          { filters: storedFilter },
        );
      },
      clearData() {
        this.service.mutate(undefined);
      },
    });
  }, [associatedFields, collection, dataLoadingMode, field, fieldSchema, params?.filter, recordDataBlocks, service]);

  useEffect(() => {
    if (shouldApplyFilter) {
      addBlockToDataBlocks();
      setChangeCount((prev) => prev++);
    }
  }, [params.filter, service, dataLoadingMode, shouldApplyFilter, addBlockToDataBlocks]);

  useEffect(() => {
    return () => {
      removeDataBlock(fieldSchema['x-uid']);
    };
  }, []);

  return (
    <div ref={container}>
      <ProviderContextFilterCollector value={{ changeCount }}>{children}</ProviderContextFilterCollector>
    </div>
  );
};

/**
 * 返回一些方法用于收集和获取当前页面中的数据卡片的信息
 * @returns
 */
export const useFilterBlock = () => {
  const ctx = React.useContext(FilterContext);
  // 有可能存在页面没有提供 FilterBlockProvider 的情况，比如内部使用的数据表管理页面
  if (!ctx) {
    return {
      inProvider: false,
      recordDataBlocks: () => {},
      getDataBlocks: () => [] as DataBlock[],
      removeDataBlock: () => {},
    };
  }
  const { dataBlocks, setDataBlocks } = ctx;
  const recordDataBlocks = (block: DataBlock) => {
    const existingBlock = dataBlocks.find((item) => item.uid === block.uid);

    if (existingBlock) {
      // 这里的值有可能会变化，所以需要更新
      existingBlock.service = block.service;
      existingBlock.defaultFilter = block.defaultFilter;
      existingBlock.dataLoadingMode = block.dataLoadingMode;
      return;
    }
    // 由于 setDataBlocks 是异步操作，所以上面的 existingBlock 在判断时有可能用的是旧的 dataBlocks,所以下面还需要根据 uid 进行去重操作
    setDataBlocks((prev) => uniqBy([...prev, block], 'uid'));
  };
  const getDataBlocks = () => dataBlocks;
  const removeDataBlock = (uid: string) => {
    setDataBlocks((prev) => prev.filter((item) => item.uid !== uid));
  };

  return {
    recordDataBlocks,
    getDataBlocks,
    removeDataBlock,
    /**
     * running in FilterBlockProvider
     */
    inProvider: true,
  };
};
