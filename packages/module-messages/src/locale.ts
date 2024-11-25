import { NAMESPACE } from './constants';

export const tval = (text: string) => `{{t("${text}", ${JSON.stringify({ ns: [NAMESPACE, 'client'] })})}}`;
