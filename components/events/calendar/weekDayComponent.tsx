import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form } from 'react-bootstrap';
import moment from 'moment';
import { Note, VipEvent } from '@/types/event';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { setExpandedRows, setFocusControl, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';
import { Modal } from 'rsuite';
import { useState } from 'react';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { toast } from 'react-toastify';

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
    const [displayNoteText, setDisplayNoteText] = useState('');
    const { addNote } = useAddNote();

    const handleNotesOpen = () => setNotesOpen(true);
    const handleDisplayNoteOpen = (noteText: string) => {
        setDisplayNoteText(noteText);
        setDisplayNoteOpen(true);
    };
    const handleNotesClose = () => setNotesOpen(false);
    const handleDisplayNoteClose = () => {
        setDisplayNoteOpen(false);
        setDisplayNoteText('');
    };

    const addNewNote = () => {
        if (!noteText || !weekDate) {
            return;
        }
        const calendarDate = weekDate.format('YYYY-MM-DD');
        addNote(noteText, undefined, calendarDate)
            .then((response) => {
                if (response.success && !response.noteError) {
                    toast.success("Calendar note added successfully");
                    setNoteText('');
                    dispatch(setReloadAdminEvents(true));
                } else {
                    toast.error(response.noteError ?? "Unexpected error occurred while adding note");
                }
                setNotesOpen(false);
            });
    };

    const setRowExpanded = (ticketSocketEventId: number) => {
        let expandedRowKeys = currentReportSelection.expandedRows ? [...currentReportSelection.expandedRows] : [];
        let focusControlId = `expandedRow_${ticketSocketEventId}`;
        if (expandedRowKeys.includes(ticketSocketEventId)) {
            expandedRowKeys = expandedRowKeys.filter(x => x != ticketSocketEventId);
            focusControlId = '';
        } else {
            expandedRowKeys.push(ticketSocketEventId);
        }        
        dispatch(
            setExpandedRows(expandedRowKeys)
        );
        dispatch(
            setFocusControl(focusControlId)
        );
    };

    let noteRows: any[] = [];
    if (notes && notes.length > 0) {
        notes.forEach((note, i) => {
            if (!note.ticketSocketEventId) {
                let noteText = note.note.length > 35 ? `${note.note.substring(0, 35)}...` : note.note;
                noteRows.push(<div key={`wdNote_${key}_${i}`} onClick={() => handleDisplayNoteOpen(note.note)} className="week-day-note">Note: {noteText}</div>)
            }            
        });
    }

    let eventRows: any[] = [];
    if (events && events.length > 0) {
        events.forEach((evt, i) => {
            const statusSlug = getEventStatusSlug(evt);
            const statusText = getEventStatusText(evt);
            let statusClass = "week-day-event";
            let title = '';
            if (statusSlug != "active") {
                statusClass += ` ${statusSlug}`;
                title = statusText;
            }
            eventRows.push(<div key={`wdEvt_${key}_${i}`} onClick={() => setRowExpanded(evt.ticketSocketEventId)} title={title} className={statusClass}>{evt.title}</div>)
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
                <Modal.Title>Add New Note for {displayDate}:</Modal.Title>
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
            <Modal id="displayNoteModal" open={displayNoteOpen} onClose={handleDisplayNoteClose}>
                <Modal.Header>
                <Modal.Title>Note from {displayDate}:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {displayNoteText}
                </Modal.Body>
                <Modal.Footer className="modal-notes-footer">
                <Button onClick={handleDisplayNoteClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}
