import { Button } from 'react-bootstrap';
import router from 'next/router';

export default function AdminListHomeButton() {
  const goHome = () => {
    router.push('/admin/');
  };
  return <Button onClick={goHome}>Back</Button>;
}
