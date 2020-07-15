import threads from "worker_threads";
import uuid from "uuid";

export default class Worker {
    /**
     * All workers
     *
     * @static
     * @type {Array<Worker>}
     * @memberof Worker
     */
    static _workers = [];
    static _stopping = false;

    /**
     * Creates an instance of Worker
     * @author LeonMrBonnie
     * @param {String} name
     * @param {String} path
     * @memberof Worker
     */
    constructor(name, path) {
        try {
            this._name = name;
            this._worker = new threads.Worker(path);
            this._messages = {};
            Worker._workers.push(this);
            this._worker.on("exit", (code) => {
                if (Worker._stopping) return;
                console.error(
                    `[WORKER] '${this._name}' exited with code: ${code}`
                );
            });
            this._worker.on("message", this.responseHandler);
            console.log(`[WORKER] Created worker '${name}'`);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Sends an event and gets a response from the worker
     *
     * @author LeonMrBonnie
     * @param {String} event
     * @param {{}} data
     * @returns
     * @memberof Worker
     */
    postAndReply(event, data) {
        return new Promise((resolve) => {
            let respond = (data) => resolve(data);

            let id = uuid.v1();
            this._worker.postMessage({ event, id, data });
            this._messages[id] = respond;
        });
    }

    responseHandler(res) {
        let resolve = this._messages[res.id];
        if(!resolve) return;
        resolve(res.data);
    }
    
    async stop() {
        let exitcode = await this._worker.terminate();
        console.log(`Exited worker ${this._name} with exit code ${exitcode}`);
    }

    /**
     * Get worker by name
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} name
     * @returns
     * @memberof Worker
     */
    static get(name) {
        return this._workers.find((worker) => worker._name === name);
    }
    static async stopAll() {
        Worker._stopping = true;
        for (let i = 0; i < this._workers.length; i++) {
            await this._workers[i].stop();
        }
    }
}
