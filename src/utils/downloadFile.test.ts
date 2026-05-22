import { describe, expect, it, vi } from 'vitest';

const downloadFileMock = vi.hoisted(() => vi.fn());

vi.mock('js-file-download', () => ({
  default: downloadFileMock,
}));

import { downloadCsvFile } from './downloadFile';

describe('downloadFile', () => {
  it('downloads a CSV file with a UTF-8 BOM', async () => {
    downloadCsvFile('report.csv', 'name,value');

    expect(downloadFileMock).toHaveBeenCalledTimes(1);
    expect(downloadFileMock).toHaveBeenCalledWith(expect.any(Blob), 'report.csv');

    const blob = downloadFileMock.mock.calls[0]?.[0] as Blob;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(await blob.text()).toBe('name,value');
  });
});
