import { io } from "socket.io-client";

// export const socket = io("http://192.168.1.78:3000/");
export const socket = io("http://localhost:3000/");

class MultiUserHandler {
    public using: boolean = false;

    public setUsing(newVal: boolean) {
        this.using = newVal;
    }
}

class HTMLHandler {
    public chatContainer: HTMLDivElement;
    public messageForm?: HTMLFormElement;

    constructor() {
        this.chatContainer = document.createElement("div");
        this.chatContainer.id = "chatBox";
        this.chatContainer.innerHTML = `
        <div ="connectedContainer">
          <div id="messageContainer">
          </div>
        
          <form style="align-self:flex-start;" id="submitForm">
            <input id="messageInput" />
            <button type="submit" style="display: none;" />
          </form>
        </div>
        </div>
        `;
    }

    public setupMessageHandler() {
        this.messageForm = document.getElementById("submitForm") as HTMLFormElement;

        this.messageForm.onsubmit = (event: SubmitEvent) => {
            event.preventDefault();
            const message = document.getElementById("messageInput");

            if (message instanceof HTMLInputElement) {
                socket.emit('message', message.value);
                message.value = "";
            }
        }
    }

    public addMessage(message: string) {
        console.log(message)
        const newP: HTMLParagraphElement = document.createElement("p");
        const text: Text = document.createTextNode(message);
        newP.appendChild(text);

        const messageContainer: HTMLDivElement = document.getElementById("messageContainer") as HTMLDivElement;

        messageContainer?.appendChild(newP);
        messageContainer!!.scrollTop = messageContainer!!.scrollHeight
    }

}

export const MultiUserManager = new MultiUserHandler();
export const HTMLManager = new HTMLHandler();