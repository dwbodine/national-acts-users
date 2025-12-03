'use client';

import moment from 'moment';
import { ReactElement, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Col } from 'rsuite';

import { useAddNote } from '@/hooks/admin/useAddNote';
import { useDeleteNote } from '@/hooks/admin/useDeleteNote';
import { useEditNote } from '@/hooks/admin/useEditNote';
import {
  setExpandedEvent,
  setExpandedRow,
  setFocusControl,
  setReloadAdminEvents,
} from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import { WeekDayProps } from '@/types/props';
import { ModifyNoteResponse } from '@/types/responses';
import { getEventStatusSlug, getEventStatusText } from '@/utils/eventUtils';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AddNoteModal from '../common/addNoteModalComponent';
import EditNoteModal from '../common/editNoteModalComponent';

export default function WeekDay(props: WeekDayProps) {
  const weekDate = props.WeekDate ? moment(props.WeekDate) : undefined;
  const events = props.Events;
  const notes = props.Notes;
  const key = props.WeekDayNumber;

  const dispatch = useDispatch();
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
    if (!weekDate || !noteText || !noteTitle) {
      return;
    }
    const calendarDate = weekDate.format('YYYY-MM-DD');
    void addNote(noteText, undefined, calendarDate, noteTitle).then(
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
    if (!weekDate || !displayNoteText || !displayNoteTitle || noteId === 0 || !displayNoteDate) {
      return;
    }
    void editNote(noteId, displayNoteText, displayNoteTitle, displayNoteDate, true).then(
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
    if (!weekDate || !displayNoteText || !displayNoteTitle || noteId === 0 || !displayNoteDate) {
      return;
    }
    void editNote(noteId, displayNoteText, displayNoteTitle, displayNoteDate, noteIsCompleted).then(
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

  const deleteSelectedNote = (nId: number) => {
    toast.dismiss();
    void deleteNote(nId).then((response: ModifyNoteResponse) => {
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
        const noteClass = note.isCompleted ? 'week-day-note-completed' : 'week-day-note';
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
      let statusClass = 'week-day-event';
      let title = '';
      if (statusSlug !== 'active') {
        statusClass += ` week-day-event-${statusSlug}`;
        title = statusText;
      }

      const sold = evt.totalTickets;
      const available =
        evt.ticketTypes?.reduce(
          (accumulator, current) => accumulator + current.totalAvailable,
          0,
        ) ?? 0;

      const listSent = evt.listSentToBand ?? false;
      const listSentVips = evt.listSentNumVips ?? 0;
      const currentVips = evt.totalTickets ?? 0;
      const showVipAlert = listSent && listSentVips !== currentVips;

      let alertIcon: ReactElement = <></>;
      if (showVipAlert) {
        alertIcon = (
          <FaExclamationTriangle
            className="week-day-event-alert"
            title={`Current total of ${currentVips} differs from the count of ${listSentVips} when the list was sent to the band`}
          ></FaExclamationTriangle>
        );
      }

      eventRows.push(
        <div
          key={`wdEvt_${key}_${i}`}
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

  const displayDate = weekDate ? `${weekDate.format('ddd')} ${weekDate.format('MM/DD/YYYY')}` : '';

  return (
    <Col key={`wd_${key}`} className="week-day">
      <div
        title={`Add a note for ${displayDate}`}
        onClick={handleNotesOpen}
        className="week-day-name"
      >
        {weekDate?.format('ddd')}
      </div>
      <div
        title={`Add a note for ${displayDate}`}
        onClick={handleNotesOpen}
        className="week-day-number"
      >
        {weekDate?.format('D')}
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
    </Col>
  );
}
