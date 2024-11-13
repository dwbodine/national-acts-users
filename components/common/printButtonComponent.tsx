import { Button } from 'react-bootstrap';

export default function PrintButton(props: any) {
  const showPrint: boolean = props.ShowPrint as boolean;

  const handleClick = () => {
    window.print();
  };

  return (
    <span className="admin-button" hidden={!showPrint}>
      <Button onClick={handleClick}>Print</Button>
    </span>
  );
}
