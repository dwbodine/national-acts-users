import { Button, Col, DatePicker, Row } from 'rsuite';

import { PageHeaderProps } from '@/types/props';

import DateRangeSelector from './dateRangeSelectorComponent';

export default function PageHeader(props: PageHeaderProps) {
  const {
    pageTitle,
    dateRangeTitle,
    dateRangeStart,
    dateRangeEnd,
    dateRangeDisabled,
    dateRanges,
    showDateRange,
    exportButtonText,
    exportButtonDisabled,
    showExport,
    showDatePicker,
    datePickerTitle,
    datePickerStart,
    onExport,
    onDateRangeChange,
    onDatePickerChange,
  } = props;

  return (
    <Row className="page-header">
      <Col className="title-container">
        <div className="title">{pageTitle}</div>
      </Col>
      <Col className="page-header-control-container no-print">
        <DateRangeSelector
          DateRangeTitle={dateRangeTitle}
          SelectedStart={dateRangeStart}
          SelectedEnd={dateRangeEnd}
          Disabled={dateRangeDisabled}
          Ranges={dateRanges}
          OnDateChange={onDateRangeChange}
          Hidden={!showDateRange}
        />
        <div className="page-header-date-picker" hidden={!showDatePicker}>
          <label className="events-datepicker-label">{datePickerTitle}:</label>
          <DatePicker
            format="M/d/yyyy"
            onSelect={onDatePickerChange}
            value={datePickerStart}
            oneTap
            cleanable={false}
          />
        </div>
        <Button
          hidden={!showExport}
          disabled={exportButtonDisabled}
          className="page-header-export-button"
          onClick={onExport}
        >
          {exportButtonText}
        </Button>
      </Col>
    </Row>
  );
}
