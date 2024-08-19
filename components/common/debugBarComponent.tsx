import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Col, Row } from "react-bootstrap";


export default function DebugBar() {
    const windowSize = useWindowSize();
    const { user } = useCurrentUser();
    const isDebug = (`${process.env.NEXT_PUBLIC_CONFIGURATION}` == `dev`);
    const isDennis = isDebug && (user.username == 'dwbodine@gmail.com' || user.username == 'dwbodine@hotmail.com');
    return (
        <Row hidden={!isDennis}>
            <Col>
                <div style={{padding: '15px'}}>{windowSize.width} X {windowSize.height} / {windowSize.angle} / {windowSize.orientation} / {windowSize.isMobile.toString()}</div>
            </Col>
        </Row>
    );
}