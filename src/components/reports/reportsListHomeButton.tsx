import { Button } from 'react-bootstrap';
import router from 'next/router';

export default function ReportsListHomeButton() {
  const goHome = () => {
    router.push('/reports/');
  };
  return <Button onClick={goHome}>Back</Button>;
}
