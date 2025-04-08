import { lang, NAMESPACE } from '../../locale';

const VoteCategory = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  VOTE: Symbol('vote'),
};
export const VoteCategoryEnums = [
  {
    value: VoteCategory.SINGLE,
    label: `{{t("Or", { ns: "${NAMESPACE}" })}}`,
  },
  {
    value: VoteCategory.ALL,
    label: `{{t("And", { ns: "${NAMESPACE}" })}}`,
  },
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
