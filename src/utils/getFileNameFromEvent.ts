import moment from 'moment';

import { VipEvent } from '@/types/event';

export default function getFileNameFromEvent(vipEvent: VipEvent, fileNameStub?: string) {
  const title = vipEvent.title.replace(/[\W_]+/gi, '_');
  let stub = '';
  const hash = moment().unix();
  if (fileNameStub) {
    stub = `_${fileNameStub}`;
  }
  return `${title}${stub}_${hash}.csv`;
}
