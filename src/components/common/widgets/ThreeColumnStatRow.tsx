import { Col, Row } from 'rsuite';

const ThreeColumnStatRow = ({
  label = '',
  monthVal = 0,
  yearVal = 0,
  isCurrentYear = false,
  isCurrency = false,
}) => (
  <Row className="sales-stat-row">
    <Col xs={10} className="sales-stat-block-name">
      {label}
    </Col>
    {isCurrentYear && (
      <Col xs={7} className="sales-stat-block-value">
        {isCurrency ? `$${monthVal?.toFixed(2) ?? '0.00'}` : (monthVal?.toFixed(2) ?? '0')}
      </Col>
    )}
    <Col xs={isCurrentYear ? 7 : 14} className="sales-stat-block-value">
      {isCurrency ? `$${yearVal?.toFixed(2) ?? '0.00'}` : (yearVal?.toFixed(2) ?? '0')}
    </Col>
  </Row>
);

export default ThreeColumnStatRow;
