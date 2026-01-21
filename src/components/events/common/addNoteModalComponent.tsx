'use client';

import { Button, Input, Modal } from 'rsuite';

import Textarea from '@/components/common/Textarea';
import { AddNoteModalProps } from '@/types/props';

export default function AddNoteModal(props: AddNoteModalProps) {
  const id = props.Id;
  const notesOpen = props.NotesOpen;
  const handleNotesClose = props.HandleNotesClose;
  const displayDate = props.DisplayDate;
  const noteTitle = props.NoteTitle;
  const noteText = props.NoteText;
  const setNoteTitle = props.SetNoteTitle;
  const setNoteText = props.SetNoteText;
  const addNewNote = props.AddNewNote;

  return (
    <Modal id={id} open={notesOpen} onClose={handleNotesClose}>
      <Modal.Header>
        <Modal.Title>Add New Note for {displayDate}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          id="addNoteTitle"
          onChange={(value) => setNoteTitle?.(value)}
          value={noteTitle}
          placeholder="Note title"
        />
        <Textarea
          id="addNote"
          rows={5}
          onChange={(value) => setNoteText?.(value)}
          value={noteText ?? ''}
          placeholder="Note text"
        />
      </Modal.Body>
      <Modal.Footer className="modal-notes-footer">
        <Button onClick={addNewNote}>Ok</Button>
        <Button onClick={handleNotesClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}
