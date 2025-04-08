import { JOB_STATUS } from '@tachybase/module-workflow/client';

import { lang, NAMESPACE } from './locale';

export const JobStatusEnums = {
  [JOB_STATUS.PENDING]: {
    color: 'gold',
    label: `{{t('Pending', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.RESOLVED]: {
    color: 'green',
    label: `{{t('Approved', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.REJECTED]: {
    color: 'red',
    label: `{{t('Rejected', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.RETRY_NEEDED]: {
    color: 'red',
    label: `{{t('Returned', { ns: "${NAMESPACE}" })}}`,
  },
};
export const VoteCategory = { SINGLE: Symbol('single'), ALL: Symbol('all'), VOTE: Symbol('vote') };
export const VoteCategoryEnums = [
  { value: VoteCategory.SINGLE, label: `{{t("Or", { ns: "${NAMESPACE}" })}}` },
  { value: VoteCategory.ALL, label: `{{t("And", { ns: "${NAMESPACE}" })}}` },
  {
    value: VoteCategory.VOTE,
    label: (v: number) => `${lang('Voting')} ( > ${(v * 100).toFixed(0)}%)`,
  },
].reduce((obj, vote) => Object.assign(obj, { [vote.value]: vote }), {});
export function voteOption(value: number) {
  switch (true) {
    case value === 1:
      return VoteCategory.ALL;
    case 0 < value && value < 1:
      return VoteCategory.VOTE;
    default:
      return VoteCategory.SINGLE;
  }
}
export function flatSchemaArray(sourceData, filter, needRecursion = false) {
  const flatArray = [];
  if (!sourceData) {
    return flatArray;
  }

  if (filter(sourceData) && (!needRecursion || !sourceData.properties)) {
    flatArray.push(sourceData);
  } else {
    sourceData.properties &&
      Object.keys(sourceData.properties).forEach((key) => {
        flatArray.push(...flatSchemaArray(sourceData.properties[key], filter));
      });
  }

  return flatArray;
}
