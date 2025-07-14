import { VipEvent } from '@/types/event';
import moment from 'moment';

export default function getFileNameFromEvent(vipEvent: VipEvent, fileNameStub?: string) {
  let fileName = '';
  const title = vipEvent.title.replace(/[\W_]+/gi, '_');
  let stub = '';
  const hash = moment().unix();
  if (fileNameStub) {
    stub = `_${fileNameStub}`;
  }
  fileName = `${title}${stub}_${hash}.csv`;
  return fileName;
}
