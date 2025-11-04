'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Copyright from '@/components/Copyright';
import { Panel } from 'rsuite';

const PageContent = (props: any) => (
  <>
    <Panel style={{ background: '#fff' }} {...props} />
    <Copyright />
  </>
);

export default PageContent;
