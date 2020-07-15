import Events from "./index.js"; // Import our events class

// Register a new event
// 1st parameter is the name of the event
// 2nd parameter is the handler function
/// 1st parameter for the handler function is the received data
// The callback can also be async or return a Promise, that also works
Events.on("test", (data) => {
    console.log(`Received data: ${JSON.stringify(data, null, 4)}`);
    return "Hello World!";
});