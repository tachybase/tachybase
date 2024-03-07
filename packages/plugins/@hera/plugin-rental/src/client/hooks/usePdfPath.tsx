import { useRecord } from '@nocobase/client';
import React, { createContext, useContext, useState } from 'react';
import { SettlementStyleContext } from '../schema-initializer/SettlementStyleSwitchActionInitializer';

export const PdfIsDoubleContext = createContext({
  isDouble: null,
  setIsDouble: null,
});

export const PdfIsLoadContext = createContext({
  settingType: null,
  setSettingLoad: null,
});

export const PdfIsDoubleProvider = (props) => {
  const [isDouble, setIsDouble] = useState(false);
  const [settingType, setSettingLoad] = useState(false);
  return (
    <PdfIsDoubleContext.Provider value={{ isDouble, setIsDouble }}>
      <PdfIsLoadContext.Provider value={{ settingType, setSettingLoad }}>{props.children}</PdfIsLoadContext.Provider>
    </PdfIsDoubleContext.Provider>
  );
};

export const useRecordPdfPath = () => {
  const record = useRecord();
  const { isDouble } = useContext(PdfIsDoubleContext);
  const { settingType } = useContext(PdfIsLoadContext);
  return `/records:pdf?recordId=${record.id}&isDouble=${isDouble}&settingType=${settingType}`;
};

export const useWaybillPdfPath = () => {
  const record = useRecord();
  const recordId = record.__collectionName === 'records' ? record.waybill?.id : record.id;
  return `/waybills:pdf?recordId=${recordId}`;
};

export const useSettlementPdfPath = () => {
  const record = useRecord();
  const { style } = useContext(SettlementStyleContext);
  return `/settlements:pdf?settlementsId=${record.id}&type=${style}`;
};
