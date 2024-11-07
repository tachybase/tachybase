import React, { useState } from 'react';

import PDFEditor from './editor';

export const PdfEditor = () => {
  const [code, setCode] = useState('');
  const [documentUrl, setDocumentUrl] = useState(null);

  return <PDFEditor value={code} onChange={setCode} onUrlChange={setDocumentUrl} />;
};
