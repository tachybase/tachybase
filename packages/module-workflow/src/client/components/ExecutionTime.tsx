import React, { useEffect, useState } from 'react';
import { useCollectionRecordData } from '@tachybase/client';

function formatDuration(seconds: number): string {
  // 如果秒数大于等于 999 天的秒数，限制为 999 天
  const maxDays = 999;
  const maxSeconds = maxDays * 24 * 60 * 60;
  if (seconds >= maxSeconds) {
    return `${maxDays} D`;
  }

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (days > 0) result += `${days} D `;
  if (hours > 0 || days > 0) result += `${hours} h `;
  if (minutes > 0 || hours > 0 || days > 0) result += `${minutes} m `;
  if (seconds >= 60) {
    result += `${Math.floor(remainingSeconds)} s`;
  } else {
    result += `${remainingSeconds.toFixed(3)} s`;
  }
  return result.trim();
}

export function ExecutionTime() {
  const record = useCollectionRecordData();
  const { createdAt, updatedAt, status } = record || {};
  const [timeDifference, setTimeDifference] = useState<string>('');

  useEffect(() => {
    const createdAtDate = createdAt ? new Date(createdAt) : null;
    const updatedAtDate = updatedAt ? new Date(updatedAt) : null;

    let intervalId: NodeJS.Timeout | null = null;

    const updateDifference = () => {
      let diffInSeconds = 0;

      if (createdAtDate && !isNaN(createdAtDate.getTime())) {
        const createdAtTime = createdAtDate.getTime();

        if (status === 0) {
          const currentTime = Date.now();
          diffInSeconds = Math.max((currentTime - createdAtTime) / 1000, 0);
        } else if (updatedAtDate && !isNaN(updatedAtDate.getTime())) {
          const updatedAtTime = updatedAtDate.getTime();
          diffInSeconds = Math.max((updatedAtTime - createdAtTime) / 1000, 0);
        }

        setTimeDifference(formatDuration(diffInSeconds));
      } else {
        setTimeDifference('Invalid timestamps');
      }
    };

    updateDifference();

    if (status === 0) {
      intervalId = setInterval(updateDifference, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [createdAt, updatedAt, status]);

  return <div>{timeDifference}</div>;
}

interface Job {
  id: number;
  createdAt: string | number;
  executionTime?: string;
}

export function jobExecutionTime(jobs: Job[], allCreateAtDate: number, allUpdateAtDate: number): Job[] {
  if (!Array.isArray(jobs) || !allCreateAtDate || !allUpdateAtDate) {
    throw new Error('Invalid parameters provided to jobExecutionTime');
  }

  return jobs.map((job, index) => {
    if (!job.createdAt) {
      throw new Error(`Job at index ${index} is missing createdAt timestamp`);
    }

    const createdAtDate = new Date(job.createdAt).getTime();
    let executionTime: string;

    if (index === 0) {
      // First job: execution time is createdAtDate - allCreateAtDate
      executionTime = formatDuration(Math.max((createdAtDate - allCreateAtDate) / 1000, 0));
    } else if (index === jobs.length - 1) {
      // Last job: execution time is allUpdateAtDate - createdAtDate
      executionTime = formatDuration(Math.max((allUpdateAtDate - createdAtDate) / 1000, 0));
    } else {
      // Middle jobs: execution time is next job's createdAt - current job's createdAt
      const nextJobCreatedAtDate = new Date(jobs[index + 1].createdAt).getTime();
      executionTime = formatDuration(Math.max((nextJobCreatedAtDate - createdAtDate) / 1000, 0));
    }

    return { ...job, executionTime };
  });
}
