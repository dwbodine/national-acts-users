import { PrintButtonProps } from '@/types/props';
import { Button } from 'react-bootstrap';

export default function PrintButton(props: PrintButtonProps) {
  const showPrint = props.ShowPrint;

  const handleClick = () => {
    window.print();
  };

  return (
    <span className="admin-button" hidden={!showPrint}>
      <Button onClick={handleClick}>Print</Button>
    </span>
  );
}
