const http = require('http');
const WebSocket = require('ws');
const WsType = require('./const/ws-event-type');
const { buildMessage } = require('./tools');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let subscribers = new Set();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch {
            ws.send(buildMessage(WsType.Error, { 'error': 'Bad formatted payload, non JSON' }));
            return;
        }

        switch (data.type) {
            case WsType.Subscribe:
                subscribers.add(ws);
                setTimeout(() => {
                    ws.send(buildMessage(WsType.Subscribe, { 'status': 'Subscribed' }));
                }, 4000);
                break;
            case WsType.Unsubscribed:
                subscribers.delete(ws);
                setTimeout(() => {
                    ws.send(buildMessage(WsType.Unsubscribed, { 'status': 'Unsubscribed' }));
                }, 8000);
                break;
            case WsType.CountSubscribers:
                const count = subscribers.size;
                ws.send(buildMessage(WsType.CountSubscribers, { count }));
                break;
            default:
                ws.send(buildMessage(WsType.Error, { 'error': 'Requested method not implemented' }));
        }
    });
    setInterval(() => ws.send(buildMessage(WsType.Heatbeat)), 1000);

    ws.on('error', console.error);
});

server.listen(8080, () => {
    console.log('Server started on port 8080');
});
