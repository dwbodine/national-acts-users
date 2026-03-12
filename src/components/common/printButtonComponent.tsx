'use client';

import { Button } from 'rsuite';

import { PrintButtonProps } from '@/types/props';

export default function PrintButton(props: PrintButtonProps) {
  const showPrint = props.ShowPrint;
  const isMobile = props.IsMobile;
  const buttonStyle = isMobile ? { marginLeft: '10px' } : {};

  const handleClick = () => {
    window.print();
  };

  return (
    <span style={buttonStyle} className="admin-button" hidden={!showPrint}>
      <Button onClick={handleClick}>Print</Button>
    </span>
  );
}
