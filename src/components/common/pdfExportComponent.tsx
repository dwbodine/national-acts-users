'use client';

import parse from 'html-react-parser';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { Button } from 'rsuite';

import PrintButton from './printButtonComponent';

export default function PdfExport() {
  const [htmlText, setHtmlText] = useState('');
  const [filename, setFilename] = useState(`pdfExport_${moment().unix()}.pdf`);
  const { toPDF, targetRef } = usePDF({ filename });

  const exportToPdf = () => {
    toPDF();
  };

  useEffect(() => {
    const title = localStorage.getItem('pdfTitle');
    if (title) {
      document.title = title;
      const safeTitle = title.replace(/[^\w\d]+/g, '_');
      setFilename(`${safeTitle}.pdf`);
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
