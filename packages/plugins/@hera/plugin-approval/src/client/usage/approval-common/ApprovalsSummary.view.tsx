import React from 'react';

export const ApprovalsSummary = (props) => {
  const { value = '', style } = props;
  const valueArray = value.split(',');

  return (
    <div>
      {valueArray.map((val) => (
        <div style={style} key={val}>
          {val}
        </div>
      ))}
    </div>
  );
};
