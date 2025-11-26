'use client';

import { Button, Col, Container, Modal, Radio, RadioGroup, Row } from 'rsuite';
import {
  exportVipItineraryToCSV,
  exportVipItineraryToHtml,
} from '@/utils/exportVipItinerary';
import { useEffect, useState } from 'react';
import { GetEventsResponse } from '@/types/responses';
import ReportDatePicker from '../../common/reportDatePickerControl';
import { RootState } from '@/lib/store';
import { UserSeller } from '@/types/user';
import { VIPModalProps } from '@/types/props';
import { ValueType } from 'rsuite/esm/Radio';
import { VipEvent } from '@/types/event';
import { downloadCsvFile } from '@/utils/downloadFile';
import { getCsvFileNameFromReportSelection } from '@/utils/getFileNameFromReportSelection';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useGetPublicEvents } from '@/hooks/event/useGetPublicEvents';
import { useSelector } from 'react-redux';

export default function VIPItineraryModal(props: VIPModalProps) {
  const isOpen = props.IsOpen ?? false;
  const isAdmin = props.IsAdmin ?? false;
  const currentSeller: UserSeller | undefined = props.Seller;
  const sellerHomePage: string = props.SellerHomePage ?? '';
  const currentEvents: VipEvent[] = props.Events ?? [];
  const onClose = props.OnClose;
  const [dateRangeValue, setDateRangeValue] = useState('0');
  const [formatValue, setFormatValue] = useState('0');
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [startCurrentUnix, setStartCurrentUnix] = useState(0);
  const [startEventUnix, setStartEventUnix] = useState(0);
  const [endUnix, setEndUnix] = useState(0);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const { getPublicEvents } = useGetPublicEvents();

  const currentSellerName = currentSeller?.sellerName;
  const lastEvent = currentEvents[currentEvents.length - 1];
  const startEventDateStr =
    currentEvents.length > 0 && currentEvents[0] ? currentEvents[0].eventDate : '';
  const endEventDateStr =
    currentEvents.length > 0 && lastEvent ? lastEvent.eventDate : '';
  const nowUnix = moment().unix();
  const firstEvent = currentEvents.find((x) => moment(x.eventDate).unix() >= nowUnix);

  useEffect(() => {
    if (startEventDateStr && endEventDateStr) {
      const seUnix = moment(startEventDateStr).unix();
      const enUnix = moment(endEventDateStr).unix();
      if (startEventUnix === 0) {
        setStartEventUnix(seUnix);
      }
      if (startCurrentUnix === 0) {
        if (seUnix > nowUnix) {
          setStartCurrentUnix(seUnix);
        } else if (firstEvent) {
          setStartCurrentUnix(moment(firstEvent.eventDate).unix());
        } else {
          setStartCurrentUnix(nowUnix);
        }
      }
      if (endUnix === 0) {
        setEndUnix(enUnix);
      }
    } else {
      setStartCurrentUnix(0);
      setStartEventUnix(0);
      setEndUnix(0);
    }
  }, [
    endEventDateStr,
    endUnix,
    startCurrentUnix,
    startEventDateStr,
    startEventUnix,
    firstEvent,
    nowUnix,
  ]);

  const submitPdfToNewWindow = (htmlText: string) => {
    localStorage.setItem('htmlText', htmlText);
    window.open('/pdf');
  };

  const getVipItinerary = () => {
    if (!currentSeller || !currentSeller.sellerId) {
      toast.warn('Seller is undefined');
      return;
    }
    if (currentEvents.length === 0) {
      toast.warn('No events to export');
      return;
    }
    if (
      (dateRangeValue === '0' && (startCurrentUnix === 0 || endUnix === 0)) ||
      (dateRangeValue === '1' && (startEventUnix === 0 || endUnix === 0))
    ) {
      toast.warn('No dates supplied');
      return;
    }
    if (
      (dateRangeValue === '0' && startCurrentUnix > endUnix) ||
      (dateRangeValue === '1' && startEventUnix > endUnix)
    ) {
      toast.warn('Start date cannot be later than end date');
      return;
    }

    setIsReportLoading(true);

    const start = dateRangeValue === '1' ? startEventUnix : startCurrentUnix;
    const end = endUnix;
    const { sellerId } = currentSeller;

    void getPublicEvents(start, end, sellerId).then((response: GetEventsResponse) => {
      if (response.events && !response.error) {
        const eventsToExport = response.events;
        if (formatValue === '1') {
          void exportVipItineraryToCSV(eventsToExport, currentSeller, isAdmin).then(
            (csvData: string) => {
              const fileName = getCsvFileNameFromReportSelection(currentReportSelection);
              downloadCsvFile(fileName, csvData);
              setIsReportLoading(false);
              if (onClose) {
                onClose();
              }
            },
          );
        } else {
          const title = `${currentSeller.sellerName} Event Itinerary`;
          localStorage.setItem('pdfTitle', title);
          void exportVipItineraryToHtml(
            eventsToExport,
            title,
            sellerHomePage,
            isAdmin,
          ).then((htmlString: string) => {
            setIsReportLoading(false);
            submitPdfToNewWindow(htmlString);
            if (onClose) {
              onClose();
            }
          });
        }
      } else {
        const err = response.error
          ? `Error: ${response.error}`
          : 'Error occured while fetching events for itinerary';
        toast.error(err);
        setIsReportLoading(false);
      }
    });
  };

  const onDateRangeSelect = (value: ValueType) => {
    const drVal = value ? value.toString() : '0';
    setDateRangeValue(drVal);
    setStartCurrentUnix(0);
    setStartEventUnix(0);
    setEndUnix(0);
  };

  const onStartClear = () => {
    setStartCurrentUnix(0);
    setStartEventUnix(0);
  };

  const onEndClear = () => {
    setEndUnix(0);
  };

  const onDateRangeChange = (start: number, end: number) => {
    setStartEventUnix(start);
    setEndUnix(end);
  };

  const onFormatSelect = (value: ValueType) => {
    const fmVal = value ? value.toString() : '0';
    setFormatValue(fmVal);
  };

  let reportTitle = 'Export Event Itinerary';
  if (currentSellerName) {
    reportTitle = `${reportTitle} for ${currentSellerName}`;
  }

  const currentRangeLabel = `(${moment.unix(startCurrentUnix).format('MM/DD/YYYY')} - ${moment(endEventDateStr).format('MM/DD/YYYY')})`;

  return (
    <Modal open={isOpen} onClose={props.OnClose} size={'lg'}>
      <Modal.Header>
        <Modal.Title>{reportTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="fluid">
          <Row>
            <Col xs={8} className="form-group">
              <label className="mt-4" htmlFor="date-radio-group">
                Date Range
              </label>
              <RadioGroup
                name="date-radio-group"
                value={dateRangeValue}
                onChange={onDateRangeSelect}
                disabled={isReportLoading}
              >
                <Radio value="0">Upcoming dates only {currentRangeLabel}</Radio>
                <Radio value="1">
                  Selected date range
                  <div className="itinerary-dates">
                    <ReportDatePicker
                      Disabled={dateRangeValue !== '1' || isReportLoading}
                      LabelColumnWidth={3}
                      Start={startEventUnix}
                      End={endUnix}
                      OnChange={onDateRangeChange}
                      OnEndClear={onEndClear}
                      OnStartClear={onStartClear}
                    />
                  </div>
                </Radio>
              </RadioGroup>
            </Col>
            <Col xs={4} className="form-group">
              <label className="mt-4" htmlFor="format-radio-group">
                Export To:
              </label>
              <RadioGroup
                name="format-radio-group"
                value={formatValue}
                onChange={onFormatSelect}
                disabled={isReportLoading}
              >
                <Radio value="0">Print / PDF</Radio>
                <Radio value="1">CSV</Radio>
              </RadioGroup>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className="modal-notes-footer">
        <Button onClick={getVipItinerary} disabled={isReportLoading}>
          Ok
        </Button>
        <Button onClick={props.OnClose} disabled={isReportLoading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
