import * as moment from 'moment';

class LogHandler {
    public chatLog: { content: string, date: moment.Moment }[] = [];

    public Log(message: string): string {
        this.chatLog.push({ content: message, date: moment() });

        return `[${moment().fromNow()}] ${message}`;
    }

}

export const LogManager = new LogHandler();