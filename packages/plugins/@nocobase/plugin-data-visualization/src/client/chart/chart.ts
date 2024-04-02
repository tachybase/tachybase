import React, { useContext } from 'react';
import { FieldOption } from '../hooks';
import { ChartRendererContext, QueryProps } from '../renderer';
import { parseField } from '../utils';
import { ISchema } from '@nocobase/schema';
import configs, { AnySchemaProperties, Config } from './configs';
import { Transformer } from '../block/transformers';

export type RenderProps = {
  data: any;
  general: any;
  advanced: any;
  fieldProps: {
    [field: string]: {
      label: string;
      transformer: Transformer;
      interface: any;
    };
  };
  ctx: any;
};

export interface ChartType {
  name: string;
  title: string;
  Component: React.FC<any>;
  schema: ISchema;
  init?: (
    fields: FieldOption[],
    query: {
      measures?: QueryProps['measures'];
      dimensions?: QueryProps['dimensions'];
    },
  ) => {
    general?: any;
    advanced?: any;
  };
  getProps(props: RenderProps): any;
  getReference?: () => {
    title: string;
    link: string;
  };
}

export type ChartProps = {
  name: string;
  title: string;
  Component: React.FC<any>;
  config?: Config[];
};

export class Chart implements ChartType {
  name: string;
  title: string;
  Component: React.FC<any>;
  config: Config[];
  configs = new Map<string, Function>();

  constructor({ name, title, Component, config }: ChartProps) {
    this.name = name;
    this.title = title;
    this.Component = Component;
    this.config = config;
    this.addConfigs(configs);
  }

  /*
   * Generate config schema according to this.config
   * How to set up this.config:
   * 1. string - the config function name in config.ts
   * 2. object - { property: string, ...props }
   *    - property is the config function name in config.ts, and the other props are the arguments of the function
   * 3. object - use the object directly as the properties of the schema
   * 4. function - use the custom function to return the properties of the schema
   */
  get schema() {
    if (!this.config) {
      return {};
    }
    const properties = this.config.reduce((properties, conf) => {
      let schema: AnySchemaProperties = {};
      if (typeof conf === 'string') {
        const func = this.configs.get(conf);
        schema = func?.() || {};
      } else if (typeof conf === 'function') {
        schema = conf();
      } else {
        if (conf.property) {
          const func = this.configs.get(conf.property);
          schema = func?.(conf) || {};
        } else {
          schema = conf as AnySchemaProperties;
        }
      }
      return {
        ...properties,
        ...schema,
      };
    }, {} as AnySchemaProperties);
    return {
      type: 'object',
      properties,
    };
  }

  addConfigs(configs: { [key: string]: Function }) {
    Object.entries(configs).forEach(([key, func]) => {
      this.configs.set(key, func);
    });
  }

  infer(
    fields: FieldOption[],
    {
      measures,
      dimensions,
    }: {
      measures?: QueryProps['measures'];
      dimensions?: QueryProps['dimensions'];
    },
  ) {
    let xField: FieldOption;
    let yField: FieldOption;
    let seriesField: FieldOption;
    let colorField: FieldOption;
    let yFields: FieldOption[];
    const getField = (fields: FieldOption[], selected: { field: string | string[]; alias?: string }) => {
      if (selected.alias) {
        return fields.find((f) => f.value === selected.alias);
      }
      const { alias } = parseField(selected.field);
      return fields.find((f) => f.value === alias);
    };
    if (measures?.length) {
      yField = getField(fields, measures[0]);
      yFields = measures.map((m) => getField(fields, m));
    }
    if (dimensions) {
      if (dimensions.length === 1) {
        xField = getField(fields, dimensions[0]);
      } else if (dimensions.length > 1) {
        // If there is a time field, it is used as the x-axis field by default.
        let xIndex: number;
        dimensions.forEach((d, i) => {
          const field = getField(fields, d);
          if (['date', 'time', 'datetime'].includes(field?.type)) {
            xField = field;
            xIndex = i;
          }
        });
        xIndex = xIndex || 0;
        xField = xField || getField(fields, dimensions[xIndex]);
        const restFields = dimensions.filter((_, i) => i !== xIndex).map((i) => getField(fields, i));
        if (restFields.length === 1) {
          seriesField = restFields[0];
          colorField = restFields[0];
        } else if (restFields.length > 1) {
          colorField = restFields[0];
          seriesField = restFields[1];
        }
      }
    }
    return { xField, yField, seriesField, colorField, yFields };
  }

  /**
   * getProps
   * Accept the information that the chart component needs to render,
   * process it and return the props of the chart component.
   */
  getProps(props: RenderProps): any {
    return props;
  }
}
