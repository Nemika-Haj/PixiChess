import type { Socket } from "socket.io-client";

export default function HTMLSetup(socket: Socket) {

    const MessageForm = document.getElementById("submitForm");
    MessageForm!!.onsubmit = (event: SubmitEvent) => {
        event.preventDefault();
        const message = document.getElementById("messageInput");

        if(message instanceof HTMLInputElement) {
            socket.emit('message', message.value);
            message.value = "";
        }
    }

}