import { saveNote } from "./socket.js";

const messageList = document.getElementById("notes")

const noteUI = note =>{
    const div = document.createElement(`div`)
    div.innerHTML = `
        <div>
        <h1>${note.name}</h1>
        <p>${note.message}</p>
        </div>
    `
    return div
}

export const renderMessages = notes => {
    notes.forEach(note => { messageList.append(noteUI(note))       
    });
}

export const onHandleSubmit = (e) => {
    e.preventDefault();
    saveNote(noteForm[`name`].value, noteForm[`message`].value,
    )
}

export const appendNote = note => {
    messageList.append(noteUI(note))
}