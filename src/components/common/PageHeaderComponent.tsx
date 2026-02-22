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
    showRefresh,
    refreshButtonText,
    refreshButtonDisabled,
    onExport,
    onDateRangeChange,
    onDatePickerChange,
    onRefresh,
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
          <span className="events-datepicker-label">{datePickerTitle}:</span>
          <DatePicker
            format="M/d/yyyy"
            onSelect={onDatePickerChange}
            value={datePickerStart}
            oneTap
            cleanable={false}
            placement="bottomEnd"
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
        <Button
          hidden={!showRefresh}
          disabled={refreshButtonDisabled}
          className="page-header-refresh-button"
          onClick={onRefresh}
        >
          {refreshButtonText}
        </Button>
      </Col>
    </Row>
  );
}
