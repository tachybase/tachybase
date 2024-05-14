import { useRecord } from '@tachybase/client';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { SettlementStyleContext } from '../schema-initializer/actions/SettlementStyleSwitchActionInitializer';

export const PdfIsDoubleContext = createContext({
  isDouble: null,
  setIsDouble: null,
});

export const PdfIsLoadContext = createContext({
  settingType: null,
  setSettingLoad: null,
});

export const PdfMargingTopContext = createContext({
  margingTop: 0,
  setMargingTop: null,
});

export const PdfIsDoubleProvider = (props) => {
  const [isDouble, setIsDouble] = useState(false);
  const [settingType, setSettingLoad] = useState(false);
  const [margingTop, setMargingTop] = useState(0);
  return (
    <PdfMargingTopContext.Provider value={{ margingTop, setMargingTop }}>
      <PdfIsDoubleContext.Provider value={{ isDouble, setIsDouble }}>
        <PdfIsLoadContext.Provider value={{ settingType, setSettingLoad }}>{props.children}</PdfIsLoadContext.Provider>
      </PdfIsDoubleContext.Provider>
    </PdfMargingTopContext.Provider>
  );
};

export const useRecordPdfPath = () => {
  const record = useRecord();
  const { isDouble } = useContext(PdfIsDoubleContext);
  const { settingType } = useContext(PdfIsLoadContext);
  const { margingTop } = useContext(PdfMargingTopContext);
  const path = useMemo(
    () => `/records:pdf?recordId=${record.id}&isDouble=${isDouble}&settingType=${settingType}&margingTop=${margingTop}`,
    [record.id, isDouble, settingType, margingTop],
  );
  return path;
};

export const WaybillsProvider = (props) => {
  const [margingTop, setMargingTop] = useState(0);
  return (
    <PdfMargingTopContext.Provider value={{ margingTop, setMargingTop }}>
      {props.children}
    </PdfMargingTopContext.Provider>
  );
};

export const useWaybillPdfPath = () => {
  const record = useRecord();
  const recordId = record.__collectionName === 'records' ? record.waybill?.id : record.id;
  const { margingTop } = useContext(PdfMargingTopContext);
  return `/waybills:pdf?recordId=${recordId}&margingTop=${margingTop}`;
};

export const useSettlementPdfPath = () => {
  const record = useRecord();
  const { style } = useContext(SettlementStyleContext);
  return `/settlements:pdf?settlementsId=${record.id}&type=${style}`;
};
