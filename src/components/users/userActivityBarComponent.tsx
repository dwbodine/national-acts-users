import { Col, Row} from 'react-bootstrap';
import {
  setReloadActivities,
  setUserActivityDateRange,
} from '@/lib/userActivitySelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import DateRangeSelector from '../common/dateRangeSelectorComponent';
import { RootState } from '@/lib/store';

export default function UserActivityBar() {
  const dispatch = useDispatch();
  const currentUserActivitySelection = useSelector(
    (state: RootState) => state.userActivitySelection,
  );
  const dateRangeTitle = 'Selected date range';

  const pageTitle: string = `User Activity`;

  const submitReport = () => {
    dispatch(setReloadActivities(true));
  };

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    const userActivitySelection = { ...currentUserActivitySelection };
    userActivitySelection.start = selectedStart;
    userActivitySelection.end = selectedEnd;
    dispatch(setUserActivityDateRange(userActivitySelection));
    submitReport();
  };  

  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <span className="title">{pageTitle}</span>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <DateRangeSelector
            DateRangeTitle={dateRangeTitle}
            SelectedStart={currentUserActivitySelection?.start}
            SelectedEnd={currentUserActivitySelection?.end}
            Disabled={false}
            OnDateChange={onDateChange}
          />
        </Col>
      </Row>
    </>
  );
}
