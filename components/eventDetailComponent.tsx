import { VipEvent } from "@/types/event";
import React from 'react';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { setSelectedEvent } from '@/lib/reportSelectionSlice';
import { Button } from "react-bootstrap";

export default function EventDetail(props: any) {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const vipEvent = currentReportSelection?.selectedEvent;
    const isAdmin = props.IsAdmin as boolean;

    let location = '';

    if (vipEvent != undefined) {
        if (vipEvent.venue) {
            location = `${vipEvent.venue.city}, ${vipEvent.venue.state}`;
            if (vipEvent.venue.country && vipEvent.venue.country != "United States" && vipEvent.venue.country != "USA" && vipEvent.venue.country != vipEvent.venue.state) {
                location += ", " + vipEvent.venue.country;
            }
        }        
    }

    const clearDetailEvent = (): void => {
        dispatch(
            setSelectedEvent(undefined)
        );
    };

    return (
        <>
            {(vipEvent != undefined) ? 
                <Col>
                    <Row>
                        <table className="vipDetailsTable">
                            <tr>
                                <td colSpan={2}>
                                    <Button onClick={clearDetailEvent}>Back</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Event:</td>
                                <td className="vipTitle">{vipEvent.title}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Venue:</td>
                                <td>{vipEvent.venue?.name} in {location}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Date:</td>
                                <td>{moment(vipEvent.eventDate).format('MM/DD/YYYY')}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Total Tickets:</td>
                                <td>{vipEvent.totalTickets}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Total Revenue:</td>
                                <td>${vipEvent.totalRevenue.toFixed(2)}</td>
                            </tr>
                        </table>
                        
                    </Row>
                </Col>
            : ''}        
        </>
    );
}