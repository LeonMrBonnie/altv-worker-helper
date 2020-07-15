import threads from "worker_threads";

export default class WorkerThreads {
    /**
     * All existing events
     *
     * @type {Array<Event>}
     * @static
     * @memberof WorkerThreads
     */
    static _events = [];

    static async _receiveMessage(request) {
        const event_name = request.event;
        const id = request.id;
        const data = request.data;

        let event = WorkerThreads._events.find((ev) => ev.name === event_name);
        if(!event) return;
        let result = await event.handler(data);
        threads.parentPort.postMessage({ id, event: event_name, data: result });
    }
    /**
     * Creates a new event listener
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {(data: {}) => Promise<*>} handler
     * @memberof WorkerThreads
     */
    static on(event, handler) {
        WorkerThreads._events.push(new Event(event, handler));
    }
}

class Event {
    /**
     * Creates an instance of Event
     * @author LeonMrBonnie
     * @param {String} name
     * @param {(data: {}) => Promise<*>} handler
     * @memberof Event
     */
    constructor(name, handler) {
        this._name = name;
        this._handler = handler;
    }
    get handler() {
        return this._handler;
    }
    get name() {
        return this._name;
    }
}

threads.parentPort.on("message", WorkerThreads._receiveMessage);
