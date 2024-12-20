import { SyntheticEvent, useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import moment from 'moment';
import { FaCalendar } from 'react-icons/fa';

export default function DateRangeSelector(props: any) {
  const title = props.dateRangeTitle;
  const onDateChange = props.onDateChange;
  const selectedStart = props.selectedStart;
  const selectedEnd = props.selectedEnd;
  const disabled = props.disabled;

  const defaultRanges = [
    {
      label: 'Today',
      value: [moment().startOf('day').toDate(), moment().endOf('day').toDate()]
    },
    {
      label: 'This Week',
      value: [moment().startOf('week').add(1, 'day').startOf('day').toDate(), moment().endOf('week').add(1, 'day').endOf('day').toDate()]
    },
    {
      label: 'This Month',
      value: [moment().startOf('month').startOf('day').toDate(), moment().endOf('month').endOf('day').toDate()]
    },
    {
      label: 'Last Month',
      value: [moment().startOf('month').subtract(1, 'month').startOf('day').toDate(), moment().startOf('month').subtract(1, 'month').endOf('month').endOf('day').toDate()]
    }
  ];

  const ranges = props.Ranges ? props.Ranges : defaultRanges;

  const [dateValues, setDateValues] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    let start = new Date();
    let end = new Date();

    if (selectedStart && selectedEnd && selectedStart > 0 && selectedEnd > 0) {
      start = new Date(selectedStart * 1000);
      end = new Date(selectedEnd * 1000);
    }

    const dValues: DateRange = [start, end];
    setDateValues(dValues);
  }, [selectedEnd, selectedStart]);

  const handleChange = (
    value: DateRange | null,
    event: SyntheticEvent<Element, Event>,
  ) => {
    const selectedStart = value ? moment(value[0]).unix() : 0;
    const selectedEnd = value ? moment(value[1]).unix() : 0;
    if (onDateChange) {
      onDateChange(selectedStart, selectedEnd);
    }
  };

  return (
    <>
      <span className="date-range-title">{title}:</span>
      <DateRangePicker
        caretAs={FaCalendar}
        placement="bottomEnd"
        appearance="default"
        format="MM/dd/yyyy"
        character=" – "
        onChange={handleChange}
        value={dateValues}
        disabled={disabled}
        ranges={ranges}
      />
    </>
  );
}
