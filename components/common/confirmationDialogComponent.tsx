import { Button } from "react-bootstrap";


export default function ConfirmationDialog(props: any) {
    const message: string = props.Message;
    const confirmText: string = props.ConfirmText ? props.ConfirmText : 'Confirm';
    const cancelText: string = props.CancelText ? props.CancelText : 'Cancel';
    const onConfirm = props.OnConfirm;
    const onCancel = props.OnCancel;

    return (
        <div>
            <p>{message}</p>
            <Button onClick={onConfirm}>{confirmText}</Button>
            <Button onClick={onCancel}>{cancelText}</Button>
        </div>
    );
}