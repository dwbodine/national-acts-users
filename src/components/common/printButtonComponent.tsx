import { Button } from 'react-bootstrap';
import { PrintButtonProps } from '@/types/props';

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
