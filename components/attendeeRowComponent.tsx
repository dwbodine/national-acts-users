import { useDispatch } from "react-redux";
import { setReloadEvents, setFocusControl } from '@/lib/reportSelectionSlice';
import { Ticket } from '@/types/event';
import { useSetTicketCheckedIn } from '@/hooks/useSetTicketCheckedIn';
import router from 'next/router';
import { FaCheck, FaX } from 'react-icons/fa6';

export default function AttendeeRow(props: any) {
    const dispatch = useDispatch(); 
    const canCheckInTickets = props.CanCheckInTickets as boolean;
    const ticket = props.Ticket as Ticket;
    const ticketId = ticket.ticketSocketOrderTicketId;
    const attendeeName = ticket.attendeeName;
    const currentCheckIn = ticket.isCheckedIn;
    const id = `ticket_${ticket.ticketSocketOrderTicketId}`;
    let className = '';
    if (canCheckInTickets) {
        className = currentCheckIn ? 'attendee-check-highlight' : 'attendee-check';
    } else {
        className = currentCheckIn ? 'attendee-highlight' : 'attendee';
    }
    const { setTicketCheckedIn } = useSetTicketCheckedIn();
    let titleText: string = '';

    const checkIn = (checkedIn: boolean) => {
        setTicketCheckedIn(ticketId, checkedIn)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401) {
                        router.push('/logout');
                    } else {
                        console.log(response.ticketError);
                    }
                    return;
                } else {
                    dispatch(
                        setFocusControl(id)
                    );
                    dispatch(
                        setReloadEvents(true)
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const handleClick = () => {
        if (canCheckInTickets) {
            checkIn(!ticket.isCheckedIn);
        }        
    };

    if (canCheckInTickets) {
        titleText = currentCheckIn ? `Check out ${attendeeName}` : `Check in ${attendeeName}`;
    }

    let checkOutClass = 'check-out-hide';
    let checkInClass = 'check-in-hide';

    if (canCheckInTickets) {
        checkOutClass = currentCheckIn ? 'check-out-show': 'check-out-hide';    
        checkInClass = !currentCheckIn ? 'check-in-show': 'check-in-hide';
    }    

    checkInClass += ' no-print';
    checkOutClass += ' no-print';

    return (
        <>
            <div onClick={handleClick} className={className} title={titleText} id={id} tabIndex={0}>
                <FaCheck className={checkOutClass} /><FaX className={checkInClass} /><span>{attendeeName}</span>
            </div>
        </>
    );        
 
}
