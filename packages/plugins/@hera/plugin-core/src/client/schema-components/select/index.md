---
group:
  title: Schema Components
  order: 3
---

# Select

## Examples

### 单选

<code src="./demos/demo1.tsx"></code>

### 多选

<code src="./demos/demo2.tsx"></code>

### 值为 Object 类型的 Select

<code src="./demos/demo3.tsx"></code>

## API

基于 Ant Design 的 [Select](https://ant.design/components/select/#API)，相关扩展属性有：

- `objectValue` 值为 object 类型
- `fieldNames` 默认值有区别

```ts
export const defaultFieldNames = {
  label: 'label',
  value: 'value',
  color: 'color',
  options: 'children',
};
```
