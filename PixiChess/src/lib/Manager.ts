import { io } from "socket.io-client";

export let otherUserDrag = false;

class MultiUserHandler {
    public using: boolean = false;

    public setUsing(newVal: boolean) {
        this.using = newVal;
    }
}

export const MultiUserManager = new MultiUserHandler();


export const socket = io("http://192.168.1.78:3000/");