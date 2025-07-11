import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { VipEvent } from '@/types/event';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { setExpandedEvent, setExpandedRow, setFocusControl, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';
import { ReactElement, useState } from 'react';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { toast } from 'react-toastify';
import { useEditNote } from '@/hooks/admin/useEditNote';
import { useDeleteNote } from '@/hooks/admin/useDeleteNote';
import { FaX } from 'react-icons/fa6';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { FaExclamationTriangle } from 'react-icons/fa';
import EventDataExpanded from '../../common/eventDataExpandedComponent';
import AddNoteModal from '../common/addNoteModalComponent';
import EditNoteModal from '../common/editNoteModalComponent';
import { AgendaDayProps } from '@/types/props';

export default function AgendaDay(props: AgendaDayProps) {
    const agendaDate = props.AgendaDate ? moment(props.AgendaDate) : undefined;
    const events = props.Events;
    const notes = props.Notes;
    const key = props.AgendaDayNumber;

    const dispatch = useDispatch();
    const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();    
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
    const [notesOpen, setNotesOpen] = useState(false);
    const [displayNoteOpen, setDisplayNoteOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteId, setNoteId] = useState(0);
    const [noteIsCompleted, setNoteIsCompleted] = useState(false);
    const [displayNoteText, setDisplayNoteText] = useState('');
    const [displayNoteTitle, setDisplayNoteTitle] = useState('');
    const [displayNoteDate, setDisplayNoteDate] = useState<Date>();
    const { addNote } = useAddNote();
    const { editNote } = useEditNote();
    const { deleteNote } = useDeleteNote();

    const handleNotesOpen = () => setNotesOpen(true);
    const handleDisplayNoteOpen = (noteId: number, noteText: string, noteTitle: string, noteDate: Date, isCompleted: boolean) => {
        setNoteId(noteId);
        setDisplayNoteTitle(noteTitle);
        setDisplayNoteText(noteText);
        setDisplayNoteDate(noteDate);
        setNoteIsCompleted(isCompleted);
        setDisplayNoteOpen(true);
    };
    const handleNotesClose = () => setNotesOpen(false);
    const handleDisplayNoteClose = () => {
        setDisplayNoteOpen(false);
        setTimeout(() => {
            setNoteId(0);
            setDisplayNoteText('');
            setNoteIsCompleted(false);
            setDisplayNoteTitle('');
            setDisplayNoteDate(undefined);
        }, 500);
    };

    const onNoteDateChange = (date: Date) => {
        setDisplayNoteDate(date);
    };

    const addNewNote = () => {
        if (!agendaDate || !noteText || !noteTitle) {
            return;
        }
        const calendarDate = agendaDate.format('YYYY-MM-DD');
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

    const editNewNoteAndMarkComplete = () => {
        if (!agendaDate || !displayNoteText || !displayNoteTitle || noteId == 0 || !displayNoteDate) {
            return;
        }
        editNote(noteId, displayNoteText, displayNoteTitle, displayNoteDate, true)
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

    const editNewNote = () => {
        if (!agendaDate || !displayNoteText || !displayNoteTitle || noteId == 0 || !displayNoteDate) {
            return;
        }
        editNote(noteId, displayNoteText, displayNoteTitle, displayNoteDate, noteIsCompleted)
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

        const message: string =
            'You are about to delete this note';
        toast.warning(
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
        const eventId = vipEvent.externalEventId;
        let expandedRowKey = currentReportSelection.expandedRow;
        let expandedEvent: VipEvent | undefined = vipEvent;
        let focusControlId = `expandedRow_${eventId}`;
        if (expandedRowKey == eventId) {
            expandedRowKey = undefined;
            expandedEvent = undefined;
            focusControlId = '';
        } else {
            expandedRowKey = eventId;
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


    const noteRows: ReactElement[] = [];
    if (notes && notes.length > 0) {
        notes.forEach((note, i) => {
            if (!note.ticketSocketEventId) {
                const noteText = note.noteTitle ? note.noteTitle : (note.note.length > 35 ? `${note.note.substring(0, 35)}...` : note.note);
                const noteClass = note.isCompleted ? "agenda-day-note-completed" : "agenda-day-note";
                noteRows.push(<div key={`adNote_${key}_${i}`} className={noteClass}>
                    <span className="note-text" onClick={() => handleDisplayNoteOpen(note.noteId, note.note, note.noteTitle ?? '', moment(note.noteTimestamp).toDate(), note.isCompleted ?? false)}>{noteText}</span>
                    <span className="note-x"><FaX onClick={() => confirmDeleteNote(note.noteId)} /></span>
                </div>)
            }
        });
    }

    const eventRows: ReactElement[] = [];
    if (events && events.length > 0) {
        events.forEach((evt, i) => {
            const statusSlug = getEventStatusSlug(evt, true);
            const statusText = getEventStatusText(evt, true);
            let statusClass = "agenda-day-event";
            let title = '';
            if (statusSlug != "active") {
                statusClass += ` agenda-day-event-${statusSlug}`;
                title = statusText;
            }

            const sold = evt.totalTickets;
            const available = evt.ticketTypes?.reduce((accumulator, current) => accumulator + current.totalAvailable, 0) ?? 0;

            const listSent = (evt.listSentToBand ?? false);
            const listSentVips = evt.listSentNumVips ?? 0;
            const currentVips = evt.totalTickets ?? 0;
            const showVipAlert = (listSent && (listSentVips != currentVips));

            let alertIcon: ReactElement = <></>;
            if (showVipAlert) {
                alertIcon = <FaExclamationTriangle className="agenda-day-event-alert" title={`Current total of ${currentVips} differs from the count of ${listSentVips} when the list was sent to the band`}></FaExclamationTriangle>
            }

            eventRows.push(<div key={`adEvt_${key}_${i}`} onClick={() => setRowExpanded(evt)} title={title} className={statusClass}>{alertIcon}{evt.sellerName} - {sold}/{available}</div>)

            if (currentReportSelection.expandedRow && currentReportSelection.expandedEvent && currentReportSelection.expandedRow == evt.externalEventId) {
                eventRows.push(<EventDataExpanded />)
            }
        });
    }

    if (eventRows.length == 0 && noteRows.length == 0) {
        eventRows.push(<div key={`adEvt_${key}_0`}>No events</div>)
    }

    const displayDate = agendaDate ? `${agendaDate.format('ddd')} ${agendaDate.format('MM/DD/YYYY')}` : '';

    return (
        <Row key={`ad_${key}`} className="agenda-day-row">
            <Col className="agenda-day">
                <div title={`Add a note for ${displayDate}`} onClick={handleNotesOpen} className="agenda-day-name">{agendaDate?.format('dddd, MMMM DD, YYYY')}</div>
                {noteRows}
                {eventRows}
                <AddNoteModal
                    Id="addNoteModal"
                    NotesOpen={notesOpen}
                    HandleNotesClose={handleNotesClose}
                    DisplayDate={displayDate}
                    SetNoteTitle={setNoteTitle}
                    SetNoteText={setNoteText}
                    AddNewNote={addNewNote}
                />
                <EditNoteModal
                    Id="displayNoteModal"
                    NotesOpen={displayNoteOpen}
                    HandleNotesClose={handleDisplayNoteClose}
                    DisplayDate={displayDate}
                    NoteIsCompleted={noteIsCompleted}
                    NoteTitle={displayNoteTitle}
                    SetNoteTitle={setDisplayNoteTitle}
                    NoteText={displayNoteText}
                    SetNoteText={setDisplayNoteText}
                    EditNewNote={editNewNote}
                    NoteDate={displayNoteDate}
                    OnNoteDateChange={onNoteDateChange}
                    EditNewNoteAndMarkComplete={editNewNoteAndMarkComplete}
                />
            </Col>
        </Row>
    );
}
