import { Button } from 'react-bootstrap';

export default function ResetButton(props: any) {
  const isDisabled = props.IsDisabled as boolean;
  const onResetClick = props.OnResetClick;

  const handleClick = () => {
    onResetClick();
  };

  return (
    <span className="admin-button">
      <Button onClick={handleClick} disabled={isDisabled}>
        Reset
      </Button>
    </span>
  );
}
