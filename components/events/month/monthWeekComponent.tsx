import { Col, Row } from "react-bootstrap";


export default function MonthWeek(props: any) {
    const weekDays = props.WeekDays as any[];

    return (
        <Row>
            {weekDays.map((weekDay, i) => (
                <Col className="month-day" key={i}>{weekDay}</Col>
            ))}
        </Row>
    )
}