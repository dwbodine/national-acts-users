'use client';

import { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import PrintButton from './printButtonComponent';
import moment from 'moment';
import parse from 'html-react-parser';
import { usePDF } from 'react-to-pdf';

export default function PdfExport() {
  const hash = moment().unix();
  const filename = `pdfExport_${hash}.pdf`;
  const { toPDF, targetRef } = usePDF({ filename });
  const [htmlText, setHtmlText] = useState('');

  const exportToPdf = () => {
    toPDF();
  };

  useEffect(() => {
    const title = localStorage.getItem('pdfTitle');
    if (title) {
      document.title = title;
      localStorage.removeItem('pdfTitle');
    }
    const txt = localStorage.getItem('htmlText');
    if (txt) {
      setHtmlText(txt);
      localStorage.removeItem('htmlText');
    }
  }, []);

  return (
    <>
      <div className="pdf-toolbar no-print">
        <PrintButton ShowPrint={true} />
        <Button onClick={exportToPdf}>Export to PDF</Button>
      </div>
      <div className="pdf-container" ref={targetRef}>
        {parse(htmlText)}
      </div>
    </>
  );
}
