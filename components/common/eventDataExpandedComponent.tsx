import { VipEvent } from '@/types/event';
import { Col, FormCheck, Row } from 'react-bootstrap';

export default function EventDataExpanded(props: any) {
    const vipEvent = props.VipEvent as VipEvent | undefined;
    const showEditButton = props.ShowEditButton as boolean;

    const setEmailSentToVips = (ticketSocketEventId: number) => {
        console.log(ticketSocketEventId);
    };

    return (
        (vipEvent != undefined) ?
            <Row className="expanded-event-row" id={`expandedRow_${vipEvent.ticketSocketEventId}`}>
                <Col>
                    <FormCheck
                        checked={vipEvent.emailSentToVips}
                        disabled={!vipEvent.isActive || vipEvent.emailSentToVips}
                        onChange={() => setEmailSentToVips(vipEvent.ticketSocketEventId)}
                        label="Email Sent To VIPs?"
                    />
                </Col>
            </Row>
        : ''
    );
}
