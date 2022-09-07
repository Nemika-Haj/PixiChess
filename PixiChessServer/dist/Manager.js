"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogManager = void 0;
const moment = require("moment");
class LogHandler {
    constructor() {
        this.chatLog = [];
    }
    Log(message) {
        this.chatLog.push({ content: message, date: moment() });
        return `[${moment().fromNow()}] ${message}`;
    }
}
exports.LogManager = new LogHandler();
//# sourceMappingURL=Manager.js.map