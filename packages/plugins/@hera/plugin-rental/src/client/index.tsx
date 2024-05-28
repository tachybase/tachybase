import { Plugin, useCollection } from '@tachybase/client';

import { DetailChecks } from './custom-components/DetailChecks';
import { RecordDetails } from './custom-components/RecordDetails';
import { RecordFeeConvertedAmount } from './custom-components/RecordFeeConverted';
import { ReadFeeConvertedAmount } from './custom-components/RecordFeeConvertedRead';
import { RecordFeeScope } from './custom-components/RecordFeeScope';
import { RecordItemCount } from './custom-components/RecordItemCount';
import { RecordItemValuationQuantity } from './custom-components/RecordItemValuationQuantity';
import { RecordItemWeight } from './custom-components/RecordItemWeight';
import { RecordProductScope } from './custom-components/RecordProductScope';
import { RecordSummary } from './custom-components/RecordSummary';
import { RecordTotalPrice } from './custom-components/RecordTotalPrice';
import { useAddToChecklistActionProps } from './hooks/useAddToChecklistActionProps';
import {
  PdfIsDoubleProvider,
  useRecordPdfPath,
  useSettlementPdfPath,
  useWaybillPdfPath,
  WaybillsProvider,
} from './hooks/usePdfPath';
import { Locale, tval } from './locale';
import { AddToChecklistActionInitializer } from './schema-initializer/actions/AddToChecklistActionInitializer';
import {
  ColumnSwitchAction,
  ColumnSwitchActionInitializer,
} from './schema-initializer/actions/ColumnSwitchActionInitializer';
import {
  PDFViewerCountablePrintActionInitializer,
  PrintCounterAction,
  PrintCounterProvider,
  usePDFViewerCountablePrintActionProps,
} from './schema-initializer/actions/PDFViewerPrintActionInitializer';
import { PrintStyleSetupInitializer, StyleSetup } from './schema-initializer/actions/PrintStyleSetupInitializer';
import {
  PrintSetup,
  RecordPrintSetupActionInitializer,
} from './schema-initializer/actions/RecordPrintSetupActionInitializer';
import {
  PrintSetupMargingTop,
  RecordPrintSetupMargingTopInitializer,
} from './schema-initializer/actions/RecordPrintSetupMargingTopInitializer';
import {
  SettlementExcelExportActionInitializer,
  useSettlementExcelExportActionProps,
} from './schema-initializer/actions/SettlementExcelExportActionInitializer';
import {
  SettlementStyleProvider,
  SettlementStyleSwitchAction,
  SettlementStyleSwitchActionInitializer,
  useSettlementStyleSwitchActionProps,
} from './schema-initializer/actions/SettlementStyleSwitchActionInitializer';
import { UnusedRecordsBlockHelper } from './schema-initializer/blocks/UnusedRecordsBlockInitializer';

export class PluginRentalClient extends Plugin {
  locale: Locale;
  async afterAdd() {}

  async beforeLoad() {}

  async afterLoad() {
    const addToReconciliationItem = {
      type: 'item',
      name: 'addToCheckList',
      title: this.locale.lang('Add to checklist'),
      Component: 'AddToChecklistActionInitializer',
      schema: {
        'x-align': 'right',
      },
    };
    this.app.schemaInitializerManager.addItem(
      'ChartFilterActionInitializers',
      'enbaleActions.' + addToReconciliationItem.name,
      addToReconciliationItem,
    );
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.printCounter', {
      type: 'item',
      title: '{{t("Print(countable)")}}',
      component: 'PDFViewerCountablePrintActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'records';
      },
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.columnSwitch', {
      type: 'item',
      title: '{{t("Column switch")}}',
      component: 'ColumnSwitchActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'records';
      },
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.recordPrintSetup', {
      type: 'item',
      title: '{{t("Record print setup")}}',
      component: 'RecordPrintSetupActionInitializer',
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.recordPrintMargingTop', {
      type: 'item',
      title: '{{t("Record print margingtop")}}',
      component: 'RecordPrintSetupMargingTopInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'records' || name === 'waybills';
      },
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.styleSetup', {
      type: 'item',
      title: tval('Style setup'),
      Component: 'PrintStyleSetupInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'records' || name === 'waybills';
      },
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.settlementExcelExport', {
      type: 'item',
      title: '{{t("Settlement excel export")}}',
      component: 'SettlementExcelExportActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'settlements';
      },
    });
    this.app.schemaInitializerManager.addItem('pdfViewer:configureActions', 'enableActions.settlementStyleSwitch', {
      type: 'item',
      title: '{{t("Settlement style switch")}}',
      component: 'SettlementStyleSwitchActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'settlements';
      },
    });
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', 'previewBlock.record', {
      key: 'record',
      type: 'item',
      title: tval('record'),
      component: 'PDFViewerBlockInitializer',
      decorator: 'PdfIsDoubleProvider',
      usePdfPath: '{{ useRecordPdfPath }}',
      target: 'record',
    });
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', 'previewBlock.waybill', {
      key: 'waybill',
      type: 'item',
      title: tval('waybill'),
      component: 'PDFViewerBlockInitializer',
      decorator: 'WaybillsProvider',
      usePdfPath: '{{ useWaybillPdfPath }}',
      target: 'waybill',
    });
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', 'previewBlock.settlement', {
      key: 'settlement',
      type: 'item',
      title: tval('settlement'),
      component: 'PDFViewerBlockInitializer',
      usePdfPath: '{{ useSettlementPdfPath }}',
      decorator: 'SettlementStyleProvider',
      target: 'settlement',
    });
  }

  // You can get and modify the app instance here
  async load() {
    this.locale = new Locale(this.app);
    this.app.addComponents({
      RecordFeeConvertedAmount,
      ReadFeeConvertedAmount,
      RecordFeeScope,
      RecordItemValuationQuantity,
      RecordItemWeight,
      RecordItemCount,
      RecordProductScope,
      RecordSummary,
      RecordTotalPrice,
      RecordDetails,
      DetailChecks,
      PdfIsDoubleProvider,
      PrintStyleSetupInitializer,
      StyleSetup,
      WaybillsProvider,
      AddToChecklistActionInitializer,
      PrintCounterProvider,
      PrintCounterAction,
      PDFViewerCountablePrintActionInitializer,
      ColumnSwitchActionInitializer,
      ColumnSwitchAction,
      SettlementExcelExportActionInitializer,
      SettlementStyleProvider,
      SettlementStyleSwitchActionInitializer,
      SettlementStyleSwitchAction,
      RecordPrintSetupActionInitializer,
      RecordPrintSetupMargingTopInitializer,
      PrintSetup,
      PrintSetupMargingTop,
    });
    this.app.addScopes({
      useAddToChecklistActionProps,
      usePDFViewerCountablePrintActionProps,
      useRecordPdfPath,
      useWaybillPdfPath,
      useSettlementPdfPath,
      useSettlementExcelExportActionProps,
      useSettlementStyleSwitchActionProps,
    });

    await new UnusedRecordsBlockHelper(this.app).load();

    // FIXME
    await this.app.apiClient.resource('link-manage').init({ name: 'DetailCheckPage' });
  }
}

export default PluginRentalClient;
