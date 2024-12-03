import { useAddNote } from '@/hooks/admin/useAddNote';
import { useSendListToBand } from '@/hooks/admin/useSendListToBand';
import { useUpdateEvent } from '@/hooks/admin/useUpdateEvent';
import { setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { Note, VipEvent } from '@/types/event';
import moment from 'moment';
import router from 'next/router';
import { useState } from 'react';
import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal } from 'rsuite';

export default function EventDataExpanded(props: any) {
    const vipEvent = props.VipEvent as VipEvent | undefined;
    const showEditButton = props.ShowEditButton as boolean;
    const dispatch = useDispatch();
    const { updateEvent } = useUpdateEvent();
    const { sendListToBand } = useSendListToBand();
    const [notesOpen, setNotesOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const { addNote } = useAddNote();

    const handleNotesOpen = () => setNotesOpen(true);
    const handleNotesClose = () => setNotesOpen(false);

    const addNewNote = () => {
        if (!noteText || !vipEvent) {
        return;
        }
        addNote(noteText, vipEvent.ticketSocketEventId)
            .then((response) => {
                if (response.success && !response.noteError) {
                    toast.success("Note added successfully");
                    setNoteText('');
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while adding note");
                }
                setNotesOpen(false);
            });
    };

    const setEmailSentToVips = (isSent: boolean) => {
        if (vipEvent != undefined) {
            let currentEvent: VipEvent = { ...vipEvent };
            currentEvent.emailSentToVips = isSent;
            updateEvent(currentEvent)
                .then((response) => {
                    if (response.success && !response.eventError) {
                        toast.success("Marked emails sent to VIPs");
                        dispatch(
                            setReloadAdminEvents(true)
                        );
                    } else {
                        const errMsg = response.eventError ?? "unknown error";
                        toast.error(`Event update failed - ${errMsg}`);
                    }
                });
        }        
    };

    const setTextSentToVips = (isSent: boolean) => {
        if (vipEvent != undefined) {
            let currentEvent: VipEvent = { ...vipEvent };
            currentEvent.textSentToVips = isSent;
            updateEvent(currentEvent)
                .then((response) => {
                    if (response.success && !response.eventError) {
                        toast.success("Marked texts sent to VIPs");
                        dispatch(
                            setReloadAdminEvents(true)
                        );
                    } else {
                        const errMsg = response.eventError ?? "unknown error";
                        toast.error(`Event update failed - ${errMsg}`);
                    }
                });
        }        
    };

    const setListSentToBand = (isSent: boolean) => {
        if (vipEvent != undefined) {
            sendListToBand(vipEvent.ticketSocketEventId, isSent)
                .then((response) => {
                    if (response.success && !response.eventError) {
                        toast.success("VIP list marked as sent to band");
                        dispatch(
                            setReloadAdminEvents(true)
                        );
                    } else {
                        const errMsg = response.eventError ?? "unknown error";
                        toast.error(`Send list failed - ${errMsg}`);
                    }
                });
        }        
    };

    const editEvent = () => {
        if (vipEvent != undefined) {
            window.open(`/admin/events/edit?id=${vipEvent.ticketSocketEventId}`)
        }
    };

    const listSent = vipEvent?.listSentTime ? moment.utc(vipEvent.listSentTime).format('MM/DD/YYYY h:m A') : 'n/a';
    const numVips = (vipEvent?.listSentToBand ?? false) ? (vipEvent?.listSentNumVips ?? 0).toString() : 'n/a';
    const doorsOpen = (vipEvent?.doorsOpen) ? moment(vipEvent.doorsOpen).format('h:mm A') : 'n/a';
    const meetAndGreet = (vipEvent?.meetAndGreetTime) ? moment(vipEvent.meetAndGreetTime).format('h:mm A') : 'n/a';
    const checkInLocation = (vipEvent?.checkInLocation) ? vipEvent.checkInLocation : 'n/a';
    const checkInNotes = (vipEvent?.checkInNotes) ? vipEvent.checkInNotes : 'n/a';

    let notes: any[] = [];
    if (vipEvent?.notes) {
        vipEvent.notes.forEach((note: Note) => {
            notes.push(<div key={`note_${note.noteId}`}>{note.note}&nbsp;<span className="note-created">Date: {moment(note.noteTimestamp).format('MM/DD/YYYY h:mm A')}</span></div>)
        });
    }

    if (notes.length == 0) {
        notes.push(<div>n/a</div>)
    }

    return (
        (vipEvent != undefined) ?
            <Row className="expanded-event-row" id={`expandedRow_${vipEvent.ticketSocketEventId}`}>
                <Col>
                    <FormCheck
                        checked={vipEvent.emailSentToVips}
                        disabled={!vipEvent.isActive}
                        onChange={(e) => setEmailSentToVips(e.currentTarget.checked)}
                        label="Email Sent To VIPs?"
                    />
                    <FormCheck
                        checked={vipEvent.textSentToVips}
                        disabled={!vipEvent.isActive}
                        onChange={(e) => setTextSentToVips(e.currentTarget.checked)}
                        label="Text Sent To VIPs?"
                    />
                    <FormCheck
                        checked={vipEvent.listSentToBand}
                        disabled={!vipEvent.isActive}
                        onChange={(e) => setListSentToBand(e.currentTarget.checked)}
                        label="List Sent To Band?"
                    />
                    <div>
                        Date/Time List sent to band: {listSent}
                    </div>
                    <div>
                        # of VIPs at time email was sent: {numVips}
                    </div>
                </Col>
                <Col>
                    <div>
                        Doors Open: {doorsOpen}
                    </div>
                    <div>
                        Meet and Greet Time: {meetAndGreet}
                    </div>
                    <div>
                        Check-in location: {checkInLocation}
                    </div>
                    <div>
                        Check-in notes: {checkInNotes}
                    </div>
                </Col>
                <Col>
                    <Row>
                        <Col className="expand-edit-notes">NOTES:<Button onClick={handleNotesOpen}>Add</Button></Col>
                        <Col className="expand-edit-event" hidden={!showEditButton}><Button onClick={editEvent}>Edit</Button></Col>
                    </Row>
                    {notes}
                    <Modal open={notesOpen} onClose={handleNotesClose}>
                        <Modal.Header>
                        <Modal.Title>Add New Note:</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Control as="textarea"
                            id="addNote"
                            rows={5}
                            onChange={(e) => setNoteText(e.currentTarget.value)}
                            value={noteText}
                        />
                        </Modal.Body>
                        <Modal.Footer className="modal-notes-footer">
                        <Button onClick={addNewNote}>
                            Ok
                        </Button>
                        <Button onClick={handleNotesClose}>
                            Cancel
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>                
            </Row>
        : ''
    );
}
