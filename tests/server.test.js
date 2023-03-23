const WebSocket = require('ws');

const WsType = require('./../const/ws-event-type');
const testServer = require('./../server');


describe('Websocket server', () => {
    let ws;
    let resp = {};
    beforeEach((done) => {
        ws = new WebSocket('ws://localhost:8080');
        ws.on('open', () => done());
    });

    afterEach((done) => {
        ws.close();
        resp = {};
        done();
    });

    test('should respond Heatbeat', (done) => {
        ws.on('message', (message) => {
            let parsedMess;
            try {
                parsedMess = JSON.parse(message);
            } catch (e) {
                parsedMess = { type: 'catched' };
            }
            resp[parsedMess.type] = parsedMess;
            expect(resp[WsType.Heatbeat]).toEqual({
                type: WsType.Heatbeat,
                updatedAt: expect.any(String)
            });
            done();
        });


    }, 1500);

    test('should respond with an error for non-JSON payloads', async () => {
        let parsedMess;
        ws.on('message', (message) => {
            try {
                parsedMess = JSON.parse(message);
            } catch (e) {
                parsedMess = { type: 'catched' };
            }
            resp[parsedMess.type] = parsedMess;
        });

        ws.send('not a JSON');
        await new Promise((r) => setTimeout(r, 200));
        expect(resp[WsType.Error]).toEqual({
            type: WsType.Error,
            error: 'Bad formatted payload, non JSON',
            updatedAt: expect.any(String)
        });
    });

    test('client subscribes', async () => {
        let parsedMess;
        ws.on('message', (message) => {
            try {
                parsedMess = JSON.parse(message);
            } catch (e) {
                parsedMess = { type: 'catched' };
            }
            resp[parsedMess.type] = parsedMess;
        });

        ws.send(JSON.stringify({ type: WsType.Subscribe }));
        await new Promise((r) => setTimeout(r, 5000));
        expect(resp[WsType.Subscribe]).toEqual({
            type: WsType.Subscribe,
            status: 'Subscribed',
            updatedAt: expect.any(String)
        });
    }, 6000);

    test('client unsubscribes', async () => {
        let parsedMess;
        ws.on('message', (message) => {
            try {
                parsedMess = JSON.parse(message);
            } catch (e) {
                parsedMess = { type: 'catched' };
            }
            resp[parsedMess.type] = parsedMess;
        });

        ws.send(JSON.stringify({ type: WsType.Unsubscribed }));
        await new Promise((r) => setTimeout(r, 9000));
        console.log({ resp });
        expect(resp[WsType.Unsubscribed]).toEqual({
            type: WsType.Unsubscribed,
            status: 'Unsubscribed',
            updatedAt: expect.any(String)
        });
    }, 10000);

    test('should respond with an error "Method not implemented"', (done) => {
        let parsedMess;
        ws.on('message', (message) => {
            try {
                parsedMess = JSON.parse(message);
            } catch (e) {
                parsedMess = { type: 'catched' };
            }
            resp[parsedMess.type] = parsedMess;
            console.log({ resp });
            expect(resp[WsType.Error]).toEqual({
                type: WsType.Error,
                error: 'Requested method not implemented',
                updatedAt: expect.any(String)
            });
            done();
        });
        ws.send(JSON.stringify({ type: 'not implemented method' }));
    }, 1000);
});
