import { cx } from '@tachybase/client';
import React from 'react';
import { getProgressPoint } from '../../../helpers/bar-helper';
import { TaskItemProps } from '../task-item';
import { BarDisplay } from './bar-display';
import { BarProgressHandle } from './bar-progress-handle';
import { barWrapper } from './style';

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(task.progressWidth + task.x1 + 10, task.y, task.height);
  return (
    <g className={cx(barWrapper)} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={(e) => {
          isDateChangeable && onEventStart('move', task, e);
        }}
      />
      <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={(e) => {
              onEventStart('progress', task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
