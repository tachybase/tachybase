import React, { useEffect, useState } from 'react';
import { useCollectionRecordData } from '@tachybase/client';

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
