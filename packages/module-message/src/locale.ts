import { NAMESPACE } from './common/constants';

export const tval = (text: string) => `{{t("${text}", ${JSON.stringify({ ns: [NAMESPACE, 'client'] })})}}`;
