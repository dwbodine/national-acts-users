'use client';

import { ReactElement, useState } from 'react';
import { getEventStatusSlug, getEventStatusText } from '@/utils/eventUtils';
import {
  setExpandedEvent,
  setExpandedRow,
  setFocusControl,
  setReloadAdminEvents,
} from '@/lib/adminEventsSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddNoteModal from '../common/addNoteModalComponent';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import EditNoteModal from '../common/editNoteModalComponent';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { ModifyNoteResponse } from '@/types/responses';
import { MonthDayProps } from '@/types/props';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { useDeleteNote } from '@/hooks/admin/useDeleteNote';
import { useEditNote } from '@/hooks/admin/useEditNote';

export default function MonthDay(props: MonthDayProps) {
  const dispatch = useDispatch();
  const monthDate = props.MonthDate ? moment(props.MonthDate) : undefined;
  const events = props.Events;
  const notes = props.Notes;
  const key = props.MonthDayNumber;
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );
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
  const handleDisplayNoteOpen = (
    nId: number,
    nText: string,
    nTitle: string,
    noteDate: Date,
    isCompleted: boolean,
  ) => {
    setNoteId(nId);
    setDisplayNoteTitle(nTitle);
    setDisplayNoteText(nText);
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
    if (!monthDate || !noteText || !noteTitle) {
      return;
    }
    const calendarDate = monthDate.format('YYYY-MM-DD');
    addNote(noteText, undefined, calendarDate, noteTitle).then(
      (response: ModifyNoteResponse) => {
        setNotesOpen(false);
        if (response.success && !response.error) {
          toast.success('Calendar note added successfully');
          setNoteText('');
          setNoteTitle('');
          dispatch(setReloadAdminEvents(true));
        } else {
          toast.error(response.error ?? 'Unexpected error occurred while adding note');
        }
      },
    );
  };

  const editNewNoteAndMarkComplete = () => {
    if (
      !monthDate ||
      !displayNoteText ||
      !displayNoteTitle ||
      noteId === 0 ||
      !displayNoteDate
    ) {
      return;
    }
    editNote(noteId, displayNoteText, displayNoteTitle, displayNoteDate, true).then(
      (response: ModifyNoteResponse) => {
        handleDisplayNoteClose();
        if (response.success && !response.error) {
          toast.success('Calendar note edited successfully');
          dispatch(setReloadAdminEvents(true));
        } else {
          toast.error(response.error ?? 'Unexpected error occurred while adding note');
        }
      },
    );
  };

  const editNewNote = () => {
    if (
      !monthDate ||
      !displayNoteText ||
      !displayNoteTitle ||
      noteId === 0 ||
      !displayNoteDate
    ) {
      return;
    }
    editNote(
      noteId,
      displayNoteText,
      displayNoteTitle,
      displayNoteDate,
      noteIsCompleted,
    ).then((response: ModifyNoteResponse) => {
      handleDisplayNoteClose();
      if (response.success && !response.error) {
        toast.success('Calendar note edited successfully');
        dispatch(setReloadAdminEvents(true));
      } else {
        toast.error(response.error ?? 'Unexpected error occurred while adding note');
      }
    });
  };

  const deleteSelectedNote = (nId: number) => {
    toast.dismiss();
    deleteNote(nId).then((response: ModifyNoteResponse) => {
      if (response.success && !response.error) {
        toast.success('Calendar note deleted');
        dispatch(setReloadAdminEvents(true));
      } else {
        toast.error(response.error ?? 'Unexpected error occurred while deleting note');
      }
    });
  };

  const confirmDeleteNote = (nId: number) => {
    if (!nId) {
      return;
    }

    const message: string = 'You are about to delete this note';
    toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={() => deleteSelectedNote(nId)}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const setRowExpanded = (vipEvent: VipEvent) => {
    const eventId = vipEvent.externalEventId;
    let expandedRowKey = currentReportSelection.expandedRow;
    let expandedEvent: VipEvent | undefined = vipEvent;
    let focusControlId = `expandedRow_${eventId}`;
    if (expandedRowKey === eventId) {
      expandedRowKey = undefined;
      expandedEvent = undefined;
      focusControlId = '';
    } else {
      expandedRowKey = eventId;
    }
    dispatch(setExpandedRow(expandedRowKey));
    dispatch(setExpandedEvent(expandedEvent));
    dispatch(setFocusControl(focusControlId));
  };

  const noteRows: ReactElement[] = [];
  if (notes && notes.length > 0) {
    notes.forEach((note, i) => {
      if (!note.ticketSocketEventId) {
        const nText = note.noteTitle
          ? note.noteTitle
          : note.note.length > 35
            ? `${note.note.substring(0, 35)}...`
            : note.note;
        const noteClass = note.isCompleted
          ? 'month-day-note-completed'
          : 'month-day-note';
        noteRows.push(
          <div key={`wdNote_${key}_${i}`} className={noteClass}>
            <span
              className="note-text"
              onClick={() =>
                handleDisplayNoteOpen(
                  note.noteId,
                  note.note,
                  note.noteTitle ?? '',
                  moment(note.noteTimestamp).toDate(),
                  note.isCompleted ?? false,
                )
              }
            >
              {nText}
            </span>
            <span className="note-x">
              <FaX onClick={() => confirmDeleteNote(note.noteId)} />
            </span>
          </div>,
        );
      }
    });
  }

  const eventRows: ReactElement[] = [];
  if (events && events.length > 0) {
    events.forEach((evt, i) => {
      const statusSlug = getEventStatusSlug(evt, true);
      const statusText = getEventStatusText(evt, true);
      let statusClass = 'month-day-event';
      let title = '';
      if (statusSlug !== 'active') {
        statusClass += ` month-day-event-${statusSlug}`;
        title = statusText;
      }

      let sold = 0;
      evt.orders?.forEach((order) => {
        if (order.tickets && order.tickets.length > 0 && !order.isDeleted) {
          order.tickets.forEach((ticket) => {
            if (ticket.isActive && !ticket.isRefunded && !ticket.isChargedBack) {
              sold += 1;
            }
          });
        }
      });
      const available =
        evt.ticketTypes?.reduce(
          (accumulator, current) => accumulator + current.totalAvailable,
          0,
        ) ?? 0;

      const listSent = evt.listSentToBand ?? false;
      const listSentVips = evt.listSentNumVips ?? 0;
      const showVipAlert = listSent && listSentVips !== sold;

      let alertIcon: ReactElement = <></>;
      if (showVipAlert) {
        alertIcon = (
          <FaExclamationTriangle
            className="month-day-event-alert"
            title={`Current total of ${sold} differs from the count of ${listSentVips} when the list was sent to the band`}
          ></FaExclamationTriangle>
        );
      }

      eventRows.push(
        <div
          key={`mdEvt_${key}_${i}`}
          onClick={() => setRowExpanded(evt)}
          title={title}
          className={statusClass}
        >
          {alertIcon}
          {evt.sellerName} - {sold}/{available}
        </div>,
      );
    });
  }

  const displayDate = monthDate
    ? `${monthDate.format('ddd')} ${monthDate.format('MM/DD/YYYY')}`
    : '';

  return (
    <div key={`md_${key}`}>
      <div
        title={`Add a note for ${displayDate}`}
        onClick={handleNotesOpen}
        className="month-day-name"
      >
        {monthDate?.format('ddd')}
      </div>
      <div
        title={`Add a note for ${displayDate}`}
        onClick={handleNotesOpen}
        className="month-day-number"
      >
        {monthDate?.format('D')}
      </div>
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
    </div>
  );
}
