'use client';

import parse from 'html-react-parser';
import { Button } from 'rsuite';

import { ConfirmationDialogProps } from '@/types/props';

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const message = props.Message ? parse(props.Message) : '';
  const confirmText: string = props.ConfirmText ? props.ConfirmText : 'Confirm';
  const cancelText: string = props.CancelText ? props.CancelText : 'Cancel';
  const onConfirm = props.OnConfirm;
  const onCancel = props.OnCancel;

  return (
    <div className="confirmation-dialog">
      <p>{message}</p>
      <p className="confirmation-dialog-sure">Are you sure?</p>
      <div className="confirmation-dialog-buttons">
        <Button onClick={onConfirm}>{confirmText}</Button>
        <Button onClick={onCancel}>{cancelText}</Button>
      </div>
    </div>
  );
}
