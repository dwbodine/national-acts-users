"use client";

import { Button } from 'react-bootstrap';
import { ResetButtonProps } from '@/types/props';

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
