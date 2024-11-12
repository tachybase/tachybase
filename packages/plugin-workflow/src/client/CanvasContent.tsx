import React, { useEffect } from 'react';
import { css, cx } from '@tachybase/client';

import { Alert, Slider } from 'antd';
import _ from 'lodash';

import { Branch } from './Branch';
import { useFlowContext } from './FlowContext';
import { lang } from './locale';
import useStyles from './style';
import { TriggerConfig } from './triggers';

export function CanvasContent({ entry }) {
  const { styles } = useStyles();
  const { workflow } = useFlowContext();
  const [zoom, setZoom] = React.useState(100);

  const update = _.debounce((v) => {
    localStorage.setItem('workflow-' + workflow.key + '-zoom', v);
  });
  useEffect(() => {
    // TODO @tachybase/clien api
    const sizeValue = localStorage.getItem('workflow-' + workflow.key + '-zoom');
    if (sizeValue && Number(sizeValue) > 0) {
      setZoom(Number(sizeValue));
    }
  }, [workflow.key]);

  return (
    <div className="workflow-canvas-wrapper">
      <div className="workflow-canvas" style={{ zoom: zoom / 100 }}>
        <div
          className={cx(
            styles.branchBlockClass,
            css`
              margin-top: 0 !important;
            `,
          )}
        >
          <div className={styles.branchClass}>
            {workflow?.executed ? (
              <Alert
                type="warning"
                message={lang('Executed workflow cannot be modified')}
                showIcon
                className={css`
                  margin-bottom: 1em;
                `}
              />
            ) : null}
            <TriggerConfig />
            <div
              className={cx(
                styles.branchBlockClass,
                css`
                  margin-top: 0 !important;
                `,
              )}
            >
              <Branch entry={entry} />
            </div>
            <div className={styles.terminalClass}>{lang('End')}</div>
          </div>
        </div>
      </div>
      <div className="workflow-canvas-zoomer">
        <Slider
          vertical
          reverse
          defaultValue={100}
          step={10}
          min={10}
          value={zoom}
          onChange={(v) => {
            setZoom(v);
            update(v);
          }}
        />
      </div>
    </div>
  );
}
