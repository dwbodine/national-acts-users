"use client";

import { Button, Form } from "react-bootstrap";
import { DatePicker, Modal } from "rsuite";
import { EditNoteModalProps } from "@/types/props";

export default function EditNoteModal(props: EditNoteModalProps) {
    const id = props.Id;
    const notesOpen = props.NotesOpen;
    const handleNotesClose = props.HandleNotesClose;
    const displayDate = props.DisplayDate;
    const noteIsCompleted = props.NoteIsCompleted;
    const noteTitle = props.NoteTitle;
    const noteText = props.NoteText;
    const setNoteTitle = props.SetNoteTitle;
    const setNoteText = props.SetNoteText;
    const editNewNote = props.EditNewNote;
    const editNewNoteAndMarkComplete = props.EditNewNoteAndMarkComplete;
    const noteDate = props.NoteDate;
    const onNoteDateChange = props.OnNoteDateChange;

    return (
        <Modal id={id} open={notesOpen} onClose={handleNotesClose}>
            <Modal.Header>
                <Modal.Title>View/Edit Note for {displayDate}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DatePicker
                    id="noteDate"
                    format="M/d/yyyy"
                    onSelect={onNoteDateChange}
                    value={noteDate}
                    oneTap
                    cleanable={false}
                    disabled={noteIsCompleted}
                />
                <Form.Control
                    id="editNoteTitle"
                    disabled={noteIsCompleted}
                    onChange={(e) => setNoteTitle ? setNoteTitle(e.currentTarget.value) : null}
                    value={noteTitle}
                    placeholder="Note title"
                />
                <Form.Control as="textarea"
                    id="editNote"
                    rows={5}
                    disabled={noteIsCompleted}
                    onChange={(e) => setNoteText ? setNoteText(e.currentTarget.value) : null}
                    value={noteText ?? ''}
                    placeholder="Note text"
                />
            </Modal.Body>
            <Modal.Footer className="modal-notes-footer">
                <Button hidden={noteIsCompleted} onClick={editNewNote}>
                    Save
                </Button>
                <Button hidden={noteIsCompleted} onClick={editNewNoteAndMarkComplete}>
                    Mark Complete
                </Button>
                <Button onClick={handleNotesClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}