import fileDownload from 'js-file-download';

const downloadCsvFile = (fileName: string, csvData: string) => {
  const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const data = new Blob([BOM, csvData]);
  fileDownload(data, fileName);
};

export { downloadCsvFile };
