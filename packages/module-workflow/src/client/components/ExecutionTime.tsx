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
