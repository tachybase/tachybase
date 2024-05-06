import { useRecord } from '@nocobase/client';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { SettlementStyleContext } from '../schema-initializer/actions/SettlementStyleSwitchActionInitializer';

export const PdfPaperSwitchingContext = createContext({
  paper: null,
  setPaper: null,
});

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

// 页面缩放
export const FontSizeContext = createContext({
  size: null,
  setSize: null,
});

// 注释
export const AnnotateContext = createContext({
  annotate: null,
  setAnnotate: null,
});

export const PdfIsDoubleProvider = (props) => {
  const [isDouble, setIsDouble] = useState(false);
  const [settingType, setSettingLoad] = useState(false);
  const [margingTop, setMargingTop] = useState(0);
  const [paper, setPaper] = useState('A4');
  const [size, setSize] = useState('9');
  const [annotate, setAnnotate] = useState(false);
  return (
    <AnnotateContext.Provider value={{ annotate, setAnnotate }}>
      <PdfPaperSwitchingContext.Provider value={{ paper, setPaper }}>
        <PdfMargingTopContext.Provider value={{ margingTop, setMargingTop }}>
          <PdfIsDoubleContext.Provider value={{ isDouble, setIsDouble }}>
            <PdfIsLoadContext.Provider value={{ settingType, setSettingLoad }}>
              <FontSizeContext.Provider value={{ size, setSize }}>{props.children}</FontSizeContext.Provider>
            </PdfIsLoadContext.Provider>
          </PdfIsDoubleContext.Provider>
        </PdfMargingTopContext.Provider>
      </PdfPaperSwitchingContext.Provider>
    </AnnotateContext.Provider>
  );
};

export const useRecordPdfPath = () => {
  const record = useRecord();
  let recordId = record.id;
  if (record.__collectionName === 'contracts' && record.__parent) {
    recordId = record.__parent.id;
  }
  if (typeof record.id === 'string') {
    recordId = record.id.split('_')[1] || record.id;
  }
  const { isDouble } = useContext(PdfIsDoubleContext);
  const { settingType } = useContext(PdfIsLoadContext);
  const { margingTop } = useContext(PdfMargingTopContext);
  const { paper } = useContext(PdfPaperSwitchingContext);
  const { size } = useContext(FontSizeContext);
  const { annotate } = useContext(AnnotateContext);
  const path = useMemo(
    () =>
      `/records:pdf?recordId=${recordId}&isDouble=${isDouble}&settingType=${settingType}&margingTop=${margingTop}&paper=${paper}&font=${size}&annotate=${annotate}`,
    [recordId, isDouble, settingType, margingTop, paper, size, annotate],
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
