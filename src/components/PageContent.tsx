'use client';

import Copyright from '@/components/Copyright';
import { Panel, PanelProps } from 'rsuite';

const PageContent = (props: PanelProps<string | number>) => (
  <>
    <Panel style={{ background: '#fff' }} {...props} />
    <Copyright />
  </>
);

export default PageContent;
