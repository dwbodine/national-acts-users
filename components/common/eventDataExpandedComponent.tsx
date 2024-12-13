import { useAddNote } from '@/hooks/admin/useAddNote';
import { useSendListToBand } from '@/hooks/admin/useSendListToBand';
import { useUpdateEvent } from '@/hooks/admin/useUpdateEvent';
import { setExpandedEvent, setReloadAdminEvents, setUpdateListStatus } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Note, VipEvent } from '@/types/event';
import moment from 'moment';
import { useState } from 'react';
import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, TimePicker } from 'rsuite';

export default function EventDataExpanded() {
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
    const vipEvent = currentReportSelection?.expandedEvent;
    const dispatch = useDispatch();
    const { updateEvent } = useUpdateEvent();
    const { sendListToBand } = useSendListToBand();
    const [notesOpen, setNotesOpen] = useState(false);
    const [doorsModalOpen, setDoorsModalOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [modalDoorsOpenDate, setModalDoorsOpenDate] = useState<Date | undefined>(undefined);
    const [modalMeetAndGreetDate, setModalMeetAndGreetDate] = useState<Date | undefined>(undefined);
    const [modalCheckInLocation, setModalCheckInLocation] = useState('');
    const [modalCheckInNotes, setModalCheckInNotes] = useState('');
    const { addNote } = useAddNote();

    const handleNotesOpen = () => setNotesOpen(true);
    const handleNotesClose = () => setNotesOpen(false);

    const handleDoorsOpen = () => {
        if (vipEvent != undefined) {
            const doorsOpenDate = vipEvent.doorsOpen ? moment(vipEvent.doorsOpen).toDate() : undefined;
            const meetAndGreetDate = vipEvent.meetAndGreetTime ? moment(vipEvent.meetAndGreetTime).toDate() : undefined;
            setModalDoorsOpenDate(doorsOpenDate);
            setModalMeetAndGreetDate(meetAndGreetDate);
            setModalCheckInLocation(vipEvent.checkInLocation ?? '');
            setModalCheckInNotes(vipEvent.checkInNotes ?? '');
            setDoorsModalOpen(true);
        }        
    } 
    const handleDoorsClose = () => {
        setDoorsModalOpen(false);
        setModalDoorsOpenDate(undefined);
        setModalMeetAndGreetDate(undefined);
        setModalCheckInLocation('');
        setModalCheckInNotes('');        
    };

    const addNewNote = () => {
        if (!noteText || !vipEvent) {
        return;
        }
        addNote(noteText, vipEvent.ticketSocketEventId)
            .then((response) => {
                setNotesOpen(false);
                if (response.success && !response.noteError) {
                    toast.success("Note added successfully");
                    setNoteText('');
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while adding note");
                }                
            });
    };  
    

    const editEvent = () => {
        if (vipEvent != undefined) {
            window.open(`/admin/events/edit?id=${vipEvent.ticketSocketEventId}`)
        }
    };

    const viewEvent = () => {
        if (vipEvent != undefined) {
            window.open(`/event/?id=${vipEvent.ticketSocketEventId}`)
        }
    };

    const setSentEmail = (isSent: boolean) => {
        if (vipEvent != undefined) {
            let currentEvent = { ...vipEvent };
            currentEvent.emailSentToVips = isSent;
            dispatch(
                setExpandedEvent(currentEvent)
            );
        }
    };

    const setSentText = (isSent: boolean) => {
        if (vipEvent != undefined) {
            let currentEvent = { ...vipEvent };
            currentEvent.textSentToVips = isSent;
            dispatch(
                setExpandedEvent(currentEvent)
            );
        }
    };

    const setSentList = (isSent: boolean) => {
        if (vipEvent != undefined) {
            let currentEvent = { ...vipEvent };
            if (isSent != currentEvent.listSentToBand) {
                dispatch(
                    setUpdateListStatus(true)
                );
            }
            currentEvent.listSentToBand = isSent;
            dispatch(
                setExpandedEvent(currentEvent)
            );
        }
    };

    const updateTasks = (completeAll: boolean = false) => {
        if (vipEvent != undefined) {
            let updateListStatus = currentReportSelection.updateListStatus ?? false;
            dispatch(
                setIsLoading(true)
            );
            let currentEvent = { ...vipEvent };
            if (completeAll) {
                currentEvent.emailSentToVips = true;
                currentEvent.textSentToVips = true;
                if (!currentEvent.listSentToBand) {
                    updateListStatus = true;
                    currentEvent.listSentToBand = true;
                }
            }
            updateEvent(currentEvent)
                .then((response) => {
                    if (response.success && !response.eventError) {
                        if (updateListStatus) {
                            sendListToBand(vipEvent.ticketSocketEventId, currentEvent.listSentToBand ?? false)
                                .then((response) => {
                                    if (response.success && !response.eventError) {
                                        toast.success("Event updated successfully");
                                        if (response.updatedEvent != undefined) {
                                            dispatch(
                                                setExpandedEvent(response.updatedEvent)
                                            );
                                        }                                        
                                        dispatch(
                                            setReloadAdminEvents(true)
                                        );
                                    } else {
                                        dispatch(
                                            setIsLoading(false)
                                        );
                                        const errMsg = response.eventError ?? "unknown error";
                                        toast.error(`Send list failed - ${errMsg}`);
                                    }
                                    dispatch (
                                        setUpdateListStatus(false)
                                    );
                                });                
                        } else {
                            toast.success("Event updated successfully");
                            dispatch(
                                setReloadAdminEvents(true)
                            );
                        }
                    } else {
                        dispatch(
                            setIsLoading(false)
                        );
                        const errMsg = response.eventError ?? "unknown error";
                        toast.error(`Event update failed - ${errMsg}`);
                    }
                });
        }
    };

    const editDoors = () => {
        if (vipEvent != undefined) {
            let currentEvent: VipEvent = { ...vipEvent };
            let doorsOpen: string | undefined = undefined;            
            if (modalDoorsOpenDate) {
                doorsOpen = moment(currentEvent.eventDate)
                    .startOf('day')
                    .add(modalDoorsOpenDate.getHours(), 'hours')
                    .add(modalDoorsOpenDate.getMinutes(), 'minutes')
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            currentEvent.doorsOpen = doorsOpen;
            let meetAndGreet: string | undefined = undefined;            
            if (modalMeetAndGreetDate) {
                meetAndGreet = moment(currentEvent.eventDate)
                    .startOf('day')
                    .add(modalMeetAndGreetDate.getHours(), 'hours')
                    .add(modalMeetAndGreetDate.getMinutes(), 'minutes')
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            currentEvent.meetAndGreetTime = meetAndGreet;
            currentEvent.checkInLocation = modalCheckInLocation;
            currentEvent.checkInNotes = modalCheckInNotes;
            updateEvent(currentEvent)
                .then((response) => {
                    if (response.success && !response.eventError) {
                        toast.success("Event data updated successfully");
                        dispatch(
                            setReloadAdminEvents(true)
                        );
                    } else {
                        const errMsg = response.eventError ?? "unknown error";
                        toast.error(`Event update failed - ${errMsg}`);
                    }
                    handleDoorsClose();
                });
        }
    };

    const onDoorsOpenChange = (date: Date | null) => {
        if (!date || !vipEvent) {
          return;
        }
    
        let doorsOpen = moment(vipEvent.eventDate)
          .startOf('day')
          .add(date.getHours(), 'hours')
          .add(date.getMinutes(), 'minutes');
    
        setModalDoorsOpenDate(doorsOpen.toDate());
      };
    
      const onMeetAndGreetChange = (date: Date | null) => {
        if (!date || !vipEvent) {
          return;
        }
    
        let meetAndGreet = moment(vipEvent.eventDate)
          .startOf('day')
          .add(date.getHours(), 'hours')
          .add(date.getMinutes(), 'minutes');
    
        setModalMeetAndGreetDate(meetAndGreet.toDate());
      };
    
    const listSent = (vipEvent?.listSentTime != undefined) ? moment.utc(vipEvent.listSentTime).format('MM/DD/YYYY h:mm A') : 'n/a';
    const numVips = (vipEvent?.listSentNumVips ?? 0 > 0) ? (vipEvent?.listSentNumVips ?? 0).toString() : 'n/a';
    const doorsOpenTime = (vipEvent?.doorsOpen) ? moment(vipEvent.doorsOpen).format('h:mm A') : 'n/a';
    const meetAndGreetTime = (vipEvent?.meetAndGreetTime) ? moment(vipEvent.meetAndGreetTime).format('h:mm A') : 'n/a';
    const checkInLocation = (vipEvent?.checkInLocation) ? vipEvent.checkInLocation : 'n/a';
    const checkInNotes = (vipEvent?.checkInNotes) ? vipEvent.checkInNotes : 'n/a';
    const hasVips = (vipEvent?.totalTickets ?? 0 > 0);

    let notes: any[] = [];
    if (vipEvent?.notes) {
        vipEvent.notes.forEach((note: Note) => {
            notes.push(<div key={`note_${note.noteId}`}>{note.note}&nbsp;<span className="note-created">Date: {moment(note.noteTimestamp).format('MM/DD/YYYY h:mm A')}</span></div>)
        });
    }

    if (notes.length == 0) {
        notes.push(<div key={`note_${vipEvent?.ticketSocketEventId ?? 0}`}>n/a</div>)
    }

    return (
        (vipEvent != undefined) ?
            <Row className="expanded-event-row" key={`expandedRow_${vipEvent.ticketSocketEventId}`} id={`expandedRow_${vipEvent.ticketSocketEventId}`}>
                <Col xl={4} lg={12} className="expanded-event-panel">
                    <FormCheck
                        checked={vipEvent?.emailSentToVips ?? false}
                        disabled={!vipEvent.isActive || !hasVips}
                        onChange={(e) => setSentEmail(e.currentTarget.checked)}
                        label="Email Sent To VIPs?"
                    />
                    <FormCheck
                        checked={vipEvent?.textSentToVips ?? false}
                        disabled={!vipEvent.isActive || !hasVips}
                        onChange={(e) => setSentText(e.currentTarget.checked)}
                        label="Text Sent To VIPs?"
                    />
                    <FormCheck
                        checked={vipEvent?.listSentToBand ?? false}
                        disabled={!vipEvent.isActive || !hasVips}
                        onChange={(e) => setSentList(e.currentTarget.checked)}
                        label="List Sent To Band?"
                    />
                    <div>
                        Date/Time List sent to band: {listSent}
                    </div>
                    <div>
                        # of VIPs at time email was sent: {numVips}
                    </div>
                    <Button disabled={!vipEvent.isActive || !hasVips} className="update-tasks-button" onClick={() => updateTasks(false)}>Update</Button>
                    <Button disabled={!vipEvent.isActive || !hasVips} className="update-tasks-button" onClick={() => updateTasks(true)}>Complete</Button>
                </Col>
                <Col xl={4} lg={12} className="expanded-event-panel">
                    <Row className="expand-edit-doors-container">
                        <Col className="expand-edit-doors" xl={10} lg={12}>
                            <div>
                                Doors Open: {doorsOpenTime}
                            </div>
                            <div>
                                Meet and Greet Time: {meetAndGreetTime}
                            </div>
                            <div>
                                Check-in location: {checkInLocation}
                            </div>
                            <div>
                                Check-in notes: {checkInNotes}
                            </div>
                        </Col>
                        <Col className="expand-edit-doors-data" xl={2} lg={12}>
                            <Button onClick={handleDoorsOpen}>Edit</Button>
                            <Modal size="calc(50%)" open={doorsModalOpen} onClose={handleDoorsClose}>
                                <Modal.Header>
                                    <Modal.Title>Edit Event Data</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <Row className="form-group">
                                    <Col xs={2}>
                                    Doors Open:
                                    </Col>
                                    <Col xs={10}>
                                    <TimePicker
                                        id="doorsOpen"
                                        format="hh:mm aa"
                                        showMeridiem={true}
                                        hideMinutes={minute => minute % 15 !== 0}
                                        onChange={onDoorsOpenChange}
                                        value={modalDoorsOpenDate}
                                    />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col xs={2}>
                                    Meet and Greet Time:
                                    </Col>
                                    <Col xs={10}>
                                    <TimePicker
                                        id="meetAndGreet"
                                        format="hh:mm aa"
                                        showMeridiem={true}
                                        hideMinutes={minute => minute % 15 !== 0}
                                        onChange={onMeetAndGreetChange}
                                        value={modalMeetAndGreetDate}
                                    />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col xs={2}>
                                    Check-in location:
                                    </Col>
                                    <Col xs={10}>
                                    <Form.Control as="textarea"
                                        rows={3}
                                        id="checkInLocation"
                                        onChange={(e) => setModalCheckInLocation(e.currentTarget.value)}
                                        value={modalCheckInLocation}
                                    />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col xs={2}>
                                    Check-in notes:
                                    </Col>
                                    <Col xs={10}>
                                    <Form.Control as="textarea"
                                        id="checkInNotes"
                                        rows={5}
                                        onChange={(e) => setModalCheckInNotes(e.currentTarget.value)}
                                        value={modalCheckInNotes}
                                    />
                                    </Col>
                                </Row>
                                </Modal.Body>
                                <Modal.Footer className="modal-notes-footer">
                                <Button onClick={editDoors}>
                                    Save
                                </Button>
                                <Button onClick={handleDoorsClose}>
                                    Cancel
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>                    
                </Col>
                <Col xl={4} lg={12} className="expanded-event-panel">
                    <Row>
                        <Col xl={9} lg={12} className="expand-edit-notes">
                            NOTES:<Button onClick={handleNotesOpen}>Add</Button>
                            {notes}
                        </Col>
                        <Col xl={3} lg={12}  className="expand-edit-event">
                            <Button onClick={viewEvent} hidden={vipEvent.totalTickets == 0}>View</Button>
                            <Button onClick={editEvent}>Edit</Button>
                        </Col>
                    </Row>                    
                    <Modal open={notesOpen} onClose={handleNotesClose}>
                        <Modal.Header>
                        <Modal.Title>Add New Note</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Control as="textarea"
                            id="addNote"
                            rows={5}
                            onChange={(e) => setNoteText(e.currentTarget.value)}
                            value={noteText}
                            placeholder="Note text"
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
