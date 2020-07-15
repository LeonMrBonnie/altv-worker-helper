import threads from "worker_threads";

export default class WorkerHelper {
    /**
     * All existing events mapped by name
     *
     * @type {{}}
     * @static
     * @memberof WorkerHelper
     */
    static _events = {};

    static async _receiveMessage(request) {
        const event_name = request.event;
        const id = request.id;
        const data = request.data;

        let event = WorkerHelper._events[event_name];
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
     * @memberof WorkerHelper
     */
    static on(event, handler) {
        WorkerHelper._events[event] = new Event(event, handler);
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

threads.parentPort.on("message", WorkerHelper._receiveMessage);
