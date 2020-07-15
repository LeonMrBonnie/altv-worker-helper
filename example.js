import * as alt from "alt-server";
import Worker from "./workers.js"; // Import our worker class

// Create a new worker with our example worker as source
// 1st Parameter is the worker name (Doesn't matter which name you choose)
// 2nd Parameter is the path to the worker
let worker = new Worker("Example Worker", `${alt.rootDir}/resources/${alt.resourceName}/workers/example_worker.js`);

(async() => {
    // Send an event to the worker and get a response
    // 1st Parameter is the event name
    // 2nd Parameter is the data (Accepts all data types that postMessage accepts: https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage)
    // The return of the function is a Promise containing the data returned from the worker (Can also be the same types as the 2nd parameter)
    let result = await worker.postAndReply("test", {
        test: true,
        message: "Hello!"
    });
    console.log(result); // Prints 'Hello World!'
})();