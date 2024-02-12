const socket = io('ws://localhost:9090');

export const loadNotes = (callback) =>{
    socket.on("loadnotes", callback)} 
       


export const saveNote = (name, message) => {
    socket.emit(`newnote`,{
        name,
        message
    })
}

export const onNewNote = (callback) => {
    socket.on(`serverNewnote`, callback)
}