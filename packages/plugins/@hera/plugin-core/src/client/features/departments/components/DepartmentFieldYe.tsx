import React, { useContext } from 'react';
import { EllipsisWithTooltip } from '@tachybase/client';
import { useField } from '@tachybase/schema';

// import { jsx, jsxs } from 'react/jsx-runtime';
import { contextK } from '../context/contextK';
import { getDepartmentStr } from '../utils/getDepartmentStr';

export const DepartmentFieldYe = () => {
  const { setDepartment } = useContext(contextK);
  const field = useField<{ value: Array<any> }>();
  const fieldValues = field.value || [];

  const department = fieldValues.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  return (
    <EllipsisWithTooltip ellipsis={true}>
      {fieldValues.map((currFieldValue, index) => (
        <span key={index}>
          <a
            onClick={(event) => {
              event.preventDefault();
              setDepartment(department[currFieldValue.id]);
            }}
          >
            {getDepartmentStr(currFieldValue)}
          </a>
          {index !== fieldValues.length - 1 ? <span style={{ marginRight: 4, color: '#aaa' }}>,</span> : ''}
        </span>
      ))}
    </EllipsisWithTooltip>
  );

  // const children2 = fieldValues.map((currFieldValue, index) => {
  //   return (
  //     <span key={index}>
  //       <a
  //         onClick={(x) => {
  //           x.preventDefault(), setDepartment(department[currFieldValue.id]);
  //         }}
  //       >
  //         {getDepartmentStr(currFieldValue)}
  //       </a>
  //       {index !== fieldValues.length - 1 ? <span style={{ marginRight: 4, color: '#aaa' }}>,</span> : ''}
  //     </span>
  //   );
  // });

  // const children = fieldValues.map((currFieldValue, index) =>
  //   jsxs(
  //     'span',
  //     {
  //       children: [
  //         jsx('a', {
  //           onClick: (x) => {
  //             x.preventDefault(), setDepartment(department[currFieldValue.id]);
  //           },
  //           children: getDepartmentStr(currFieldValue),
  //         }),
  //         index !== fieldValues.length - 1
  //           ? jsx('span', { style: { marginRight: 4, color: '#aaa' }, children: ',' })
  //           : '',
  //       ],
  //     },
  //     index,
  //   ),
  // );

  // return jsx(EllipsisWithTooltip, { ellipsis: true, children: children });
};
