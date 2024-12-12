import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form } from 'react-bootstrap';
import moment from 'moment';
import { Note, VipEvent } from '@/types/event';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { setExpandedEvent, setExpandedRow, setFocusControl, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';
import { Modal } from 'rsuite';
import { useState } from 'react';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { toast } from 'react-toastify';
import { useEditNote } from '@/hooks/admin/useEditNote';
import { useDeleteNote } from '@/hooks/admin/useDeleteNote';
import { FaX } from 'react-icons/fa6';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { FaExclamation, FaExclamationTriangle } from 'react-icons/fa';

export default function WeekDay(props: any) {
    const dispatch = useDispatch();
    const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();
    const weekDate = props.WeekDate ? moment(props.WeekDate) : undefined;
    const events = props.Events as VipEvent[] | undefined;
    const notes = props.Notes as Note[] | undefined;
    const key = props.WeekDayNumber as number;
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
    const [notesOpen, setNotesOpen] = useState(false);
    const [displayNoteOpen, setDisplayNoteOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteId, setNoteId] = useState(0);
    const [displayNoteText, setDisplayNoteText] = useState('');
    const [displayNoteTitle, setDisplayNoteTitle] = useState('');
    const { addNote } = useAddNote();
    const { editNote } = useEditNote();
    const { deleteNote } = useDeleteNote();

    const handleNotesOpen = () => setNotesOpen(true);
    const handleDisplayNoteOpen = (noteId: number, noteText: string, noteTitle: string) => {
        setNoteId(noteId);
        setDisplayNoteTitle(noteTitle);
        setDisplayNoteText(noteText);
        setDisplayNoteOpen(true);
    };
    const handleNotesClose = () => setNotesOpen(false);
    const handleDisplayNoteClose = () => {
        setDisplayNoteOpen(false);
        setTimeout(() => {
            setNoteId(0);
            setDisplayNoteText('');
            setDisplayNoteTitle('');
        }, 500);        
    };

    const addNewNote = () => {
        if (!weekDate || !noteText || !noteTitle) {
            return;
        }
        const calendarDate = weekDate.format('YYYY-MM-DD');
        addNote(noteText, undefined, calendarDate, noteTitle)
            .then((response) => {
                setNotesOpen(false);
                if (response.success && !response.noteError) {
                    toast.success("Calendar note added successfully");
                    setNoteText('');
                    setNoteTitle('');
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while adding note");
                }                
            });
    };

    const editNewNote = () => {
        if (!weekDate || !displayNoteText || !displayNoteTitle || noteId == 0) {
            return;
        }
        editNote(noteId, displayNoteText, displayNoteTitle)
            .then((response) => {
                handleDisplayNoteClose();
                if (response.success && !response.noteError) {
                    toast.success("Calendar note edited successfully");
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while adding note");
                }                
            });
    };

    const confirmDeleteNote = (noteId: number) => {
        if (!noteId) {
            return;
        }
    
        let message: string =
        'You are about to delete this note';
        const toastId = toast.warning(
        <ConfirmationDialog
            Message={message}
            ConfirmText="Yes"
            CancelText="No"
            OnConfirm={() => deleteSelectedNote(noteId)}
            OnCancel={() => {
                toast.dismiss();
            }}
        />,
        {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
        },
        );
    };
    
    const deleteSelectedNote = (noteId: number) => {
        toast.dismiss();
        deleteNote(noteId)
            .then((response) => {
                if (response.success && !response.noteError) {
                    toast.success("Calendar note deleted");
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while deleting note");
                }
            });
    }

    const setRowExpanded = (vipEvent: VipEvent) => {
        const ticketSocketEventId = vipEvent.ticketSocketEventId;
        let expandedRowKey = currentReportSelection.expandedRow;
        let expandedEvent: VipEvent | undefined = vipEvent;
        let focusControlId = `expandedRow_${ticketSocketEventId}`;
        if (expandedRowKey == ticketSocketEventId) {
            expandedRowKey = undefined;
            expandedEvent = undefined;
            focusControlId = '';
        } else {
            expandedRowKey = ticketSocketEventId;
        }
        dispatch(
            setExpandedRow(expandedRowKey)
        );
        dispatch(
            setExpandedEvent(expandedEvent)
        );
        dispatch(
            setFocusControl(focusControlId)
        );
    };

    let noteRows: any[] = [];
    if (notes && notes.length > 0) {
        notes.forEach((note, i) => {
            if (!note.ticketSocketEventId) {
                let noteText = note.noteTitle ? note.noteTitle : (note.note.length > 35 ? `${note.note.substring(0, 35)}...` : note.note);
                noteRows.push(<div key={`wdNote_${key}_${i}`} className="week-day-note">
                                    <span className="note-text" onClick={() => handleDisplayNoteOpen(note.noteId, note.note, note.noteTitle ?? '')}>{noteText}</span>
                                    <span className="note-x"><FaX onClick={() => confirmDeleteNote(note.noteId)} /></span>
                            </div>)
            }
        });
    }

    let eventRows: any[] = [];
    if (events && events.length > 0) {
        events.forEach((evt, i) => {
            const statusSlug = getEventStatusSlug(evt, true);
            const statusText = getEventStatusText(evt, true);
            let statusClass = "week-day-event";
            let title = '';
            if (statusSlug != "active") {
                statusClass += ` week-day-event-${statusSlug}`;
                title = statusText;
            }

            const sold = evt.totalTickets;
            const available = evt.ticketTypes?.reduce((accumulator, current) => accumulator + current.totalAvailable, 0) ?? 0;

            let listSent = (evt.listSentToBand ?? false);
            const listSentVips = evt.listSentNumVips ?? 0;
            const currentVips = evt.totalTickets ?? 0;
            const showVipAlert = (listSent && (listSentVips != currentVips));
            
            let alertIcon: any = '';
            if (showVipAlert) {
                alertIcon = <FaExclamationTriangle className="week-day-event-alert" title={`Current total of ${currentVips} differs from the count of ${listSentVips} when the list was sent to the band`}></FaExclamationTriangle>
            }

            eventRows.push(<div key={`wdEvt_${key}_${i}`} onClick={() => setRowExpanded(evt)} title={title} className={statusClass}>{alertIcon}{evt.sellerName} - {sold}/{available}</div>)
        });
    }

    const displayDate = weekDate ? `${weekDate.format('ddd')} ${weekDate.format('MM/DD/YYYY')}` : '';

    return (
        <Col key={`wd_${key}`} className="week-day">
            <div title={`Add a note for ${displayDate}`} onClick={handleNotesOpen} className="week-day-name">{weekDate?.format('ddd')}</div>
            <div title={`Add a note for ${displayDate}`} onClick={handleNotesOpen} className="week-day-number">{weekDate?.format('D')}</div>
            {noteRows}
            {eventRows}
            <Modal id="addNoteModal" open={notesOpen} onClose={handleNotesClose}>
                <Modal.Header>
                    <Modal.Title>Add New Note for {displayDate}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        id="addNoteTitle"
                        onChange={(e) => setNoteTitle(e.currentTarget.value)}
                        value={noteTitle}
                        placeholder="Note title"
                    />
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
            <Modal id="displayNoteModal" open={displayNoteOpen} onClose={handleDisplayNoteClose}>
                <Modal.Header>
                    <Modal.Title>Edit Note for {displayDate}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        id="editNoteTitle"
                        onChange={(e) => setDisplayNoteTitle(e.currentTarget.value)}
                        value={displayNoteTitle}
                        placeholder="Note title"
                    />
                    <Form.Control as="textarea"
                        id="editNote"
                        rows={5}
                        onChange={(e) => setDisplayNoteText(e.currentTarget.value)}
                        value={displayNoteText}
                        placeholder="Note text"
                    />
                    { }
                </Modal.Body>
                <Modal.Footer className="modal-notes-footer">
                    <Button onClick={editNewNote}>
                        Save
                    </Button>
                    <Button onClick={handleDisplayNoteClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}
