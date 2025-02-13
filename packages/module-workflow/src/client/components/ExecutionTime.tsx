import React, { useEffect, useState } from 'react';
import { Input, useCollectionRecordData } from '@tachybase/client';

export function formatDuration(seconds: number): string {
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

export function formatMsToDHS(milliseconds: number): string | undefined {
  const TEN_MINUTES_MS = 600000;
  const MILLISECONDS_IN_SECOND = 1000;
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const maxDays = 999;
  if (!milliseconds) {
    return;
  }
  const seconds = milliseconds / MILLISECONDS_IN_SECOND;
  const maxSeconds = maxDays * SECONDS_IN_DAY;
  if (seconds >= maxSeconds) {
    return `${maxDays} D`;
  }

  if (milliseconds < TEN_MINUTES_MS) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const remainingMilliseconds = milliseconds % MILLISECONDS_IN_SECOND;

    let result = `${remainingMilliseconds} ms`;

    if (minutes > 0) {
      result = `${minutes} m ${remainingSeconds} s ${remainingMilliseconds} ms`;
    } else if (remainingSeconds > 0) {
      result = `${remainingSeconds} s ${remainingMilliseconds} ms`;
    }

    return result;
  }

  const days = Math.floor(seconds / SECONDS_IN_DAY);
  const hours = Math.floor((seconds % SECONDS_IN_DAY) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (days > 0) result += `${days} D `;
  if (hours > 0 || days > 0) result += `${hours} h `;
  if (minutes > 0 || hours > 0 || days > 0) result += `${minutes} m `;
  if (seconds >= 60) {
    result += `${Math.floor(remainingSeconds)} s`;
  } else {
    result += `${remainingSeconds} s`;
  }
  return result.trim();
}

export function getExecutionTime(executionCost: number, record?): string | undefined {
  const getTimeDifference = () => {
    const currentTime = Date.now();
    const createdAtTime = new Date(record.createdAt).getTime();
    return currentTime - createdAtTime;
  };
  const [displayValue, setDisplayValue] = useState(executionCost || getTimeDifference());

  useEffect(() => {
    let interval;

    if (record.status === 0) {
      interval = setInterval(() => {
        setDisplayValue(getTimeDifference());
      }, 1000);
    } else {
      setDisplayValue(executionCost);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [executionCost, record.status]);

  return formatMsToDHS(displayValue);
}
