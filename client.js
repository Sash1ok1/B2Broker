const WebSocket = require('ws');
const WsType = require('./const/ws-event-type');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    ws.send(JSON.stringify({ type: WsType.Subscribe }));

    // setInterval(() => {
    //     ws.send(JSON.stringify({ type: WsType.Subscribe }));
    // }, );
    setInterval(() => {
        ws.send(JSON.stringify({ type: WsType.Unsubscribed }));
    }, 15000);

    setInterval(() => {
        ws.send(JSON.stringify({ type: WsType.CountSubscribers }));
    }, 10000);
});

ws.on('message', (message) => {
    let data;
    try {
        data = JSON.parse(message);
    } catch {
        data = { message };
    }

    console.log(`Received message: ${JSON.stringify(data)}`);
});
