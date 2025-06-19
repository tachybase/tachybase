import { CollectionTemplate } from '../../data-source/collection-template/CollectionTemplate';
import { getConfigurableProperties } from './properties';

export class ImportCollectionTemplate extends CollectionTemplate {
  name = 'import';
  title = '{{t("Import json collection")}}';
  order = 5;
  color = 'blue';
  divider = true;
  default = {
    fields: [],
  };
}
