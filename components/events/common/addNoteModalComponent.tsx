import { Button, Form } from "react-bootstrap";
import { Modal } from "rsuite";

export default function AddNoteModal(props: any) {
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
    );
}