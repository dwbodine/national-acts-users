import { ResetButtonProps } from '@/types/props';
import { Button } from 'react-bootstrap';

export default function ResetButton(props: ResetButtonProps) {
  const isDisabled = props.IsDisabled;
  const onResetClick = props.OnResetClick;

  const handleClick = () => {
    if (onResetClick) {
      onResetClick();
    }    
  };

  return (
    <span className="admin-button">
      <Button onClick={handleClick} disabled={isDisabled}>
        Reset
      </Button>
    </span>
  );
}
