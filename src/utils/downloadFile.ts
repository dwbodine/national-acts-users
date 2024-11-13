import fileDownload from 'js-file-download';

export default function downloadFile(fileName: string, csvData: string) {
  var BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const data = new Blob([BOM, csvData]);
  fileDownload(data, fileName);
}
