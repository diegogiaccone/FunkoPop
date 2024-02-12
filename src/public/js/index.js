import { loadNotes, onNewNote } from "./socket.js";
import { appendNote, onHandleSubmit, renderMessages } from "./ui.js";

onNewNote(appendNote);
loadNotes(renderMessages)

const noteForm = document.getElementById("noteForm");
noteForm.addEventListener(`submit`, onHandleSubmit);




