import { Plugin, useCollection } from '@nocobase/client';
import { RecordSummary } from './custom-components/RecordSummary';
import { RecordTotalPrice } from './custom-components/RecordTotalPrice';
import { RecordItemWeight } from './custom-components/RecordItemWeight';
import { RecordItemCount } from './custom-components/RecordItemCount';
import { RecordItemValuationQuantity } from './custom-components/RecordItemValuationQuantity';
import { RecordProductScope } from './custom-components/RecordProductScope';
import { RecordFeeScope } from './custom-components/RecordFeeScope';
import { RecordFeeConvertedAmount } from './custom-components/RecordFeeConverted';
import { ReadFeeConvertedAmount } from './custom-components/RecordFeeConvertedRead';
import { RecordDetails } from './custom-components/RecordDetails';
import { Locale, tval } from './locale';
import { AddToChecklistActionInitializer } from './schema-initializer/actions/AddToChecklistActionInitializer';
import { useAddToChecklistActionProps } from './hooks/useAddToChecklistActionProps';
import { DetailChecks } from './custom-components/DetailChecks';
import {
  PDFViewerCountablePrintActionInitializer,
  PrintCounterAction,
  PrintCounterProvider,
  usePDFViewerCountablePrintActionProps,
} from './schema-initializer/actions/PDFViewerPrintActionInitializer';
import {
  PdfIsDoubleProvider,
  useRecordPdfPath,
  useSettlementPdfPath,
  useWaybillPdfPath,
  WaybillsProvider,
} from './hooks/usePdfPath';
import {
  ColumnSwitchAction,
  ColumnSwitchActionInitializer,
} from './schema-initializer/actions/ColumnSwitchActionInitializer';
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
import {
  RecordPrintSetupActionInitializer,
  PrintSetup,
} from './schema-initializer/actions/RecordPrintSetupActionInitializer';
import {
  RecordPrintSetupMargingTopInitializer,
  PrintSetupMargingTop,
} from './schema-initializer/actions/RecordPrintSetupMargingTopInitializer';
import { UnusedRecordsBlockHelper } from './schema-initializer/blocks/UnusedRecordsBlockInitializer';

import { PaperSwitching, PaperSwitchingInitializer } from './schema-initializer/actions/paperSwitching';

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
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.printCounter', {
      type: 'item',
      title: '{{t("Print(countable)")}}',
      component: 'PDFViewerCountablePrintActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'records';
      },
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.columnSwitch', {
      type: 'item',
      title: '{{t("Column switch")}}',
      component: 'ColumnSwitchActionInitializer',
      // useVisible() {
      //   const collection = useCollection();
      //   const name = collection['options']['name'];
      //   return name === 'records';
      // },
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.paperSwitching', {
      type: 'item',
      title: '{{t("paper switching")}}',
      component: 'PaperSwitchingInitializer',
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.recordPrintSetup', {
      type: 'item',
      title: '{{t("Record print setup")}}',
      component: 'RecordPrintSetupActionInitializer',
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.recordPrintMargingTop', {
      type: 'item',
      title: '{{t("Record print margingtop")}}',
      component: 'RecordPrintSetupMargingTopInitializer',
      // useVisible() {
      //   const collection = useCollection();
      //   const name = collection['options']['name'];
      //   return name === 'records' || name === 'waybills';
      // },
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.settlementExcelExport', {
      type: 'item',
      title: '{{t("Settlement excel export")}}',
      component: 'SettlementExcelExportActionInitializer',
      useVisible() {
        const collection = useCollection();
        const name = collection['options']['name'];
        return name === 'settlements';
      },
    });
    this.app.schemaInitializerManager.addItem('PDFViewActionInitializer', 'enbaleActions.settlementStyleSwitch', {
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
      WaybillsProvider,
      AddToChecklistActionInitializer,
      PrintCounterProvider,
      PrintCounterAction,
      PDFViewerCountablePrintActionInitializer,
      ColumnSwitchActionInitializer,
      ColumnSwitchAction,
      PaperSwitching,
      PaperSwitchingInitializer,
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
