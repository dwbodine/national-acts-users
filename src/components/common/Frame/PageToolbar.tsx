'use client';

import { Affix, DateRangePicker, IconButton, SelectPicker, Stack } from 'rsuite';
import { useRef, useState } from 'react';
import type { RangeType } from 'rsuite/DateRangePicker';
import SettingIcon from '@rsuite/icons/Setting';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import subDays from 'date-fns/subDays';

interface Range extends RangeType {
  appearance?: 'default' | 'primary' | 'link' | 'subtle' | 'ghost';
}

const predefinedRanges: Range[] = [
  {
    label: 'Today',
    placement: 'left',
    value: [new Date(), new Date()],
  },
  {
    label: 'Yesterday',
    placement: 'left',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
  },
  {
    label: 'This week',
    placement: 'left',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
  },
  {
    label: 'Last 7 days',
    placement: 'left',
    value: [subDays(new Date(), 6), new Date()],
  },
  {
    label: 'Last 30 days',
    placement: 'left',
    value: [subDays(new Date(), 29), new Date()],
  },
  {
    label: 'This month',
    placement: 'left',
    value: [startOfMonth(new Date()), new Date()],
  },
  {
    label: 'Last month',
    placement: 'left',
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
  },
  {
    label: 'This year',
    placement: 'left',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  },
  {
    label: 'Last year',
    placement: 'left',
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
  },
  {
    label: 'All time',
    placement: 'left',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
  },
  {
    appearance: 'default',
    closeOverlay: false,
    label: 'Last week',
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
  },
  {
    appearance: 'default',
    closeOverlay: false,
    label: 'Next week',
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
  },
];

const PageToolbar = () => {
  const [fixed, setFixed] = useState<boolean | undefined>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Affix onChange={setFixed}>
      <Stack
        spacing={10}
        justifyContent="space-between"
        ref={containerRef}
        style={{
          background: '#fff',
          borderRadius: fixed ? 0 : 6,
          boxShadow: fixed ? '0 0 15px 0 rgb(0 0 0 / 10%)' : undefined,
          marginBottom: 20,
          padding: 4,
          position: 'relative',
        }}
      >
        <Stack spacing={10}>
          <SelectPicker
            defaultValue="Daily"
            cleanable={false}
            searchable={false}
            appearance="subtle"
            container={() => containerRef.current as HTMLDivElement}
            data={[
              { label: 'Daily', value: 'Daily' },
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Monthly', value: 'Monthly' },
            ]}
          />
          <DateRangePicker
            appearance="subtle"
            defaultValue={[new Date(), new Date()]}
            showOneCalendar
            ranges={predefinedRanges}
            container={() => containerRef.current as HTMLDivElement}
          />
        </Stack>

        <IconButton icon={<SettingIcon style={{ fontSize: 20 }} />} />
      </Stack>
    </Affix>
  );
};

export default PageToolbar;
