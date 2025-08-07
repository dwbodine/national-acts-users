import { Button, Col, Container, Row } from "react-bootstrap";
import { Modal, Radio, RadioGroup } from "rsuite";
import { exportVipItineraryToCSV, exportVipItineraryToHtml } from "@/utils/exportVipItinerary";
import ReportDatePicker from "../../common/reportDatePicker";
import { RootState } from "@/lib/store";
import { UserSeller } from "@/types/user";
import { VIPModalProps } from "@/types/props";
import { ValueType } from "rsuite/esm/Radio";
import { VipEvent } from "@/types/event";
import { downloadCsvFile } from "@/utils/downloadFile";
import { getCsvFileNameFromReportSelection } from "@/utils/getFileNameFromReportSelection";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";

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
    const [startUnix, setStartUnix] = useState(0);
    const [endUnix, setEndUnix] = useState(0);
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const currentSellerName = currentSeller?.sellerName;
    const startEventDateStr = currentEvents.length > 0 ? currentEvents[0].eventDate : '';
    const endEventDateStr = currentEvents.length > 0 ? currentEvents[currentEvents.length - 1].eventDate : '';

    const submitPdfToNewWindow = (htmlText: string) => {
        localStorage.setItem('htmlText', htmlText);
        window.open('/pdf/');
    };

    const getVipItinerary = () => {
        if (currentSeller === undefined) {
            toast.warn("Seller is undefined");
            return;
        }
        if (currentEvents.length === 0) {
            toast.warn("No events to export");
            return;
        }
        if (startUnix === 0 || endUnix === 0) {
            toast.warn("No dates supplied");
            return;
        }
        if (startUnix > endUnix) {
            toast.warn("Start date cannot be later than end date");
            return;
        }
        const eventsToExport = currentEvents.filter(x => moment(x.eventDate).unix() >= startUnix && moment(x.eventDate).unix() <= endUnix);
        setIsReportLoading(true);
        if (formatValue === "1") {
            exportVipItineraryToCSV(eventsToExport, currentSeller, isAdmin).then((csvData: string) => {
                const fileName = getCsvFileNameFromReportSelection(currentReportSelection);
                downloadCsvFile(fileName, csvData);
                setIsReportLoading(false);
                if (onClose) {
                    onClose();
                }
            });
        } else {
            const title = `${currentSeller.sellerName} VIP Itinerary`;
            localStorage.setItem('pdfTitle', title);
            exportVipItineraryToHtml(eventsToExport, title, sellerHomePage, isAdmin).then((htmlString: string) => {
                setIsReportLoading(false);
                submitPdfToNewWindow(htmlString);
                if (onClose) {
                    onClose();
                }
            });
        }
    };

    const onDateRangeSelect = (value: ValueType) => {
        const drVal = value ? value.toString() : '0';
        setDateRangeValue(drVal);
        setStartUnix(0);
        setEndUnix(0);
    };

    const onStartClear = () => {
        setStartUnix(0);
    }

    const onEndClear = () => {
        setEndUnix(0);
    };

    const onDateRangeChange = (start: number, end: number) => {
        setStartUnix(start);
        setEndUnix(end);
    };

    const onFormatSelect = (value: ValueType) => {
        const fmVal = value ? value.toString() : '0';
        setFormatValue(fmVal);
    };

    let reportTitle = "Export VIP Itinerary";
    if (currentSellerName) {
        reportTitle = `${reportTitle} for ${currentSellerName}`;
    }

    let currentRangeLabel = '';
    if (currentEvents.length > 0) {
        if (startUnix === 0) {
            setStartUnix(moment(startEventDateStr).unix());
        }
        if (endUnix === 0) {
            setEndUnix(moment(endEventDateStr).unix());
        }
        currentRangeLabel = `(${moment(startEventDateStr).format('MM/DD/YYYY')} - ${moment(endEventDateStr).format('MM/DD/YYYY')})`;
    }


    return (
        <Modal open={isOpen} onClose={props.OnClose} size={'lg'}>
            <Modal.Header>
                <Modal.Title>{reportTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col xs={8} className="form-group">
                            <label className="mt-4" htmlFor="date-radio-group">Date Range</label>
                            <RadioGroup name="date-radio-group" value={dateRangeValue} onChange={onDateRangeSelect} disabled={isReportLoading}>
                                <Radio value="0">
                                    All current dates {currentRangeLabel}
                                </Radio>
                                <Radio value="1">
                                    Selected current dates
                                    <div className="itinerary-dates">
                                        <ReportDatePicker
                                            Disabled={dateRangeValue !== '1' || isReportLoading}
                                            LabelColumnWidth={3}
                                            Start={startUnix}
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
                            <label className="mt-4" htmlFor="format-radio-group">Export To:</label>
                            <RadioGroup name="format-radio-group" value={formatValue} onChange={onFormatSelect} disabled={isReportLoading}>
                                <Radio value="0">
                                    Print / PDF
                                </Radio>
                                <Radio value="1">
                                    CSV
                                </Radio>
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
    )
}