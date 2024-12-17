import React from 'react';
import { str2moment } from '@tachybase/utils/client';

import { Dropdown } from 'antd';

import { StatusButton } from '../../../components/StatusButton';
import { JobStatusOptionsMap } from '../../../constants';
import { useFlowContext } from '../../../FlowContext';
import { useContextNode } from '../Node.context';
import useStyles from './JobButton.style';

export const JobButton = () => {
  const { execution, setViewJob } = useFlowContext();
  const { jobs } = useContextNode() ?? {};
  const { styles } = useStyles();

  if (!execution) {
    return null;
  }

  if (!jobs.length) {
    return <StatusButton className={styles.nodeJobButtonClass} disabled />;
  }

  function onOpenJob({ key }) {
    const job = jobs.find((item) => item.id === key);
    setViewJob(job);
  }

  return jobs.length > 1 ? (
    <Dropdown
      menu={{
        items: jobs.map((job) => {
          return {
            key: job.id,
            label: (
              <>
                <StatusButton statusMap={JobStatusOptionsMap} status={job.status} />
                <time>{str2moment(job.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
              </>
            ),
          };
        }),
        onClick: onOpenJob,
        className: styles.dropdownClass,
      }}
    >
      <StatusButton
        statusMap={JobStatusOptionsMap}
        status={jobs[jobs.length - 1].status}
        className={styles.nodeJobButtonClass}
      />
    </Dropdown>
  ) : (
    <StatusButton
      statusMap={JobStatusOptionsMap}
      status={jobs[0].status}
      onClick={() => setViewJob(jobs[0])}
      className={styles.nodeJobButtonClass}
    />
  );
};
