const http = require('http');
const WebSocket = require('ws');
const WsType = require('./../const/ws-event-type');

describe('WebSocket', () => {
    let req = {};
    let wss;
    let server;
    beforeEach((done) => {
        server = http.createServer();
        wss = new WebSocket.Server({ server });
        server.listen(8080,
            () => {
                const testServer = require('./../client');
                done();
            });
    });

    afterEach((done) => {
        server.close();
        req = {};
        done();
    });

    test('subscribe', async () => {
        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                const data = JSON.parse(message);
                req[data.type] = data;
            });
        });
        await new Promise((r) => setTimeout(r, 500));
        expect(Object.keys(req)).toContain(WsType.Subscribe);
    }, 2000);

    test('count of subscribers', async () => {
        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                const data = JSON.parse(message);
                req[data.type] = data;
                console.log({ data });
            });
        });
        await new Promise((r) => setTimeout(r, 16000));
        expect(Object.keys(req)).toContain(WsType.CountSubscribers);
    }, 18000);

    test('unubscribers', async () => {
        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                const data = JSON.parse(message);
                req[data.type] = data;
                console.log({ data });
            });
        });
        await new Promise((r) => setTimeout(r, 20000));
        expect(Object.keys(req)).toContain(WsType.Unsubscribed);
    }, 22000);
})
;
