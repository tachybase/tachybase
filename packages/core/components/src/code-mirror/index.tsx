import React from 'react';
import { connect } from '@tachybase/schema';

import { autocompletion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CM from '@uiw/react-codemirror';

// 定义全局对象和子对象的补全项
const globalVariables = [
  {
    label: 'ctx',
    type: 'variable',
    info: 'Global context object',
    apply: (view, completion, from, to) => {
      view.dispatch({
        changes: { from, to, insert: completion.label },
        selection: { anchor: from + completion.label.length },
      });
    },
  },
];

const ctxProperties = [
  { label: 'body', type: 'variable', info: 'pass to workflow or response to user' },
  { label: 'request', type: 'variable', info: 'ctx.request' },
  { label: 'action', type: 'variable', info: 'ctx.action' },
];

const requestProperties = [
  { label: 'header', type: 'variable', info: 'ctx.request.header' },
  { label: 'query', type: 'variable', info: 'ctx.request.query' },
  { label: 'body', type: 'variable', info: 'ctx.request.body' },
  { label: 'method', type: 'variable', info: 'ctx.request.method' },
];

const actionProperties = [
  { label: 'filter', type: 'variable', info: 'ctx.action.filter' },
  { label: 'fields', type: 'variable', info: 'ctx.action.fields' },
  { label: 'except', type: 'variable', info: 'ctx.action.except' },
  { label: 'appends', type: 'variable', info: 'ctx.action.appends' },
  { label: 'sort', type: 'variable', info: 'ctx.action.sort' },
  { label: 'paginate', type: 'variable', info: 'ctx.action.paginate' },
  { label: 'page', type: 'variable', info: 'ctx.action.page' },
  { label: 'pageSize', type: 'variable', info: 'ctx.action.pageSize' },
];

const completionSource = (context) => {
  const word = context.matchBefore(/\w*/);
  if (word.from === word.to && !context.explicit) return null;

  if (context.state.sliceDoc(word.from - 4, word.from) === 'ctx.') {
    return {
      from: word.from,
      options: ctxProperties,
      validFor: /^\w*$/,
    };
  } else if (context.state.sliceDoc(word.from - 8, word.from) === 'ctx.request.') {
    return {
      from: word.from,
      options: requestProperties,
      validFor: /^\w*$/,
    };
  } else if (context.state.sliceDoc(word.from - 7, word.from) === 'ctx.action.') {
    return {
      from: word.from,
      options: actionProperties,
      validFor: /^\w*$/,
    };
  } else if (context.explicit && word.text.length === 0) {
    return {
      from: word.from,
      options: globalVariables,
      validFor: /^\w*$/,
    };
  }

  return null;
};

export const CodeMirror = connect(({ value, onChange, ...otherProps }) => {
  return (
    <CM
      value={value || ''}
      onChange={onChange}
      {...otherProps}
      theme={vscodeDark}
      extensions={[
        javascript({ jsx: true }),
        autocompletion({
          override: [completionSource],
        }),
      ]}
      height="300px"
    ></CM>
  );
});
