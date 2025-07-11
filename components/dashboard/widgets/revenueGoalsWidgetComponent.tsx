import { RevenueGoalsWidgetProps } from '@/types/props';
import { Col, Row } from 'react-bootstrap';
import { Progress } from 'rsuite';

export default function RevenueGoalsWidget(props: RevenueGoalsWidgetProps) {
  const percentGoal = props.PercentGoal;
  const title = props.PercentTitle;
  const totalGoal = props.TotalGoal;
  const amount = props.Amount;

  let wholePercent = 0.0;
  if (percentGoal) {
    wholePercent = Math.round(percentGoal * 100 * 100) / 100;
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">{title}</Col>
        </Row>
        <Row>
          <Col className="revenue-widget-progress">
            <Progress.Circle percent={wholePercent} strokeColor="#ffc107" />
          </Col>
        </Row>
        <Row>
          <Col className="revenue-widget-caption">
            ${amount?.toFixed(2)} / ${totalGoal?.toFixed(2)}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
