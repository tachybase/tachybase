import { CollectionTemplate } from '../../data-source/collection-template/CollectionTemplate';

export class ImportXlsxTemplate extends CollectionTemplate {
  name = 'importXlsx';
  title = '{{t("Import xlsx")}}';
  order = 6;
  color = 'blue';
  divider = false;
  default = {
    fields: [],
  };
}
