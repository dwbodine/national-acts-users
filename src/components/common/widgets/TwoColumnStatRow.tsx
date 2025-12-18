import { Col, Row } from 'rsuite';

const TwoColumnStatRow = ({
  label = '',
  value = 0,
  isCurrency = false,
  tooltip = '',
  isInteger = false,
}) => (
  <Row className="sales-stat-row">
    <Col
      xs={12}
      className={tooltip ? 'sales-stat-block-name-tooltip' : 'sales-stat-block-name'}
      title={tooltip}
    >
      {label}
    </Col>
    <Col xs={12} className="sales-stat-block-value">
      {isCurrency
        ? `$${value?.toFixed(2) ?? '0.00'}`
        : isInteger
          ? (value ?? '0')
          : (value?.toFixed(2) ?? '0')}
    </Col>
  </Row>
);

export default TwoColumnStatRow;
