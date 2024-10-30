import { RootState } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { GetPermissionsResponse, Permission, Role, UpdateRoleResponse } from "@/types/user";
import { Button, FormCheck } from "react-bootstrap";
import { useGetAllPermissions } from "@/hooks/user/useGetAllPermissions";
import { setAdminOrder, setReloadRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { useUpdateRole } from "@/hooks/admin/useUpdateRole";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useRefundOrder } from "@/hooks/admin/useRefundOrder";
import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import { useGetOrderStatus } from "@/hooks/common/useGetOrderStatus";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../common/confirmationDialogComponent";
import { ModifyOrderResponse } from "@/types/event";
import moment from "moment";

export default function AdminOrderEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { refundOrder } = useRefundOrder();
    const { updateOrder } = useUpdateOrder();
    const { getOrderStatusText } = useGetOrderStatus();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);

    useEffect(() => {
        if (currentAdminSelection.selectedOrder == undefined) {
            goBack();
        } else {
            setIsActive(currentAdminSelection.selectedOrder.isActive);
            setIsHidden(currentAdminSelection.selectedOrder.isHidden ?? false);
            setIsDeleted(currentAdminSelection.selectedOrder.isDeleted);
        }
    }, [currentAdminSelection, dispatch]);

    const goBack = () => {
        router.push('/admin/events/orders/');
    }

    const setTicketCheckInStatus = () => {

    };
    
    const confirmDoRefund = () => {
        let message: string = 'By continuing, this order will be marked as refunded in full';
        if (refundServiceFees) {
            message += ', including all service fees';
        }
        const toastId = toast.warning(
            <ConfirmationDialog
                Message={message}
                ConfirmText="Yayuh!" 
                CancelText="Oh HAIL No"
                OnConfirm={handleRefund}
                OnCancel={() => { toast.dismiss() }}
                />,
                {
                  position: 'top-left',
                  autoClose: false,
                  closeOnClick: false
                }
        );
    };

    const handleRefund = () => {
        toast.dismiss();
        if (!currentAdminSelection.selectedOrder) {
            return false;
        }
        dispatch (
            setIsLoading(true)
        );
        const orderId = currentAdminSelection.selectedOrder.ticketSocketOrderId;
        refundOrder(orderId, refundServiceFees)
            .then((response: ModifyOrderResponse) => {
                const success = response.success;
                dispatch (
                    setIsLoading(false)
                );
                if (success) {
                    toast.success('Refund succeeded');
                    dispatch (
                        setAdminOrder(undefined)
                    );
                    goBack();
                } else {
                    toast.error('Refund failed');
                }
            });
    };


    const onSubmit = () => {
        if (!currentAdminSelection.selectedOrder) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        
    }

    

    const pageHeader = "Edit Order";

    return (
        <div className="admin-container">
            
        </div> 
    );
}