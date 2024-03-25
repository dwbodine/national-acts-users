import fileDownload from "js-file-download";

export default function downloadFile(fileName: string, csvData: string) {
    var BOM = new Uint8Array([0xEF,0xBB,0xBF]);
    const data = new Blob([BOM, csvData]);
    fileDownload(data, fileName);
}