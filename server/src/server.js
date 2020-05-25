const WebSocket = require('ws');
const Config = require('./config.js');
const Player = require('./worlds/player.js');
const Message = require('./networks/message.js');
const Emitter = require('./networks/emitter.js');

class Server {
    constructor() {
        this.serverFPS = 1000 / 30;
        this.clients = [];
        this.clientSeqID = 0;

        this.config = Config;

        this.initialize();
    }

    /**
     * 初期化処理
     */
    initialize() {
        this.loopBind = this.mainLoop.bind(this);

        const options = {
            port: this.config.serverPort,
            perMessageDeflate: false
        };

        // Websocket Created...
        this.socket = new WebSocket.Server(options, this.onServerOpen.bind(this))
        this.socket.on('error', this.onSocketError.bind(this));
        this.socket.on('connection', this.onSocketOpen.bind(this));

        this.mainLoop();
    }

    /**
     * サーバーの処理が開始したとき
     */
    onServerOpen() {
        console.log(`[INFO]Pino House Event`);
        console.log(`[INFO]2DGame Ver: 0.0.5`);
        console.log(`[INFO]GameServer Port: ${this.config.serverPort}`)
    }

    /**
     * クライアントが接続したときの処理
     * @param {*} ws 
     */
    onSocketOpen(ws) {
        ws.isConnected = true;
        ws.remoteAddress = ws._socket.remoteAddress;
        ws.remotePort = ws._socket.remotePort;

        console.log(`[INFO]IP: ${ws._socket.remoteAddress} | Port: ${ws._socket.remotePort}`)

        ws.player = new Player(this, ws);
        ws.message = new Message(this, ws);

        var self = this;
        var onMessage = function(message) {
            self.onSocketMessage(ws, message);
        };
        var onError = function(error) {
            self.onSocketError(ws, error);
        };
        var onClose = function(reason) {
            self.onSocketClose(ws, reason);
        };

        ws.on('message', onMessage);
        ws.on('error', onError);
        ws.on('close', onClose);
        this.clients.push(ws);

        for (let i in this.clients) {
            this.gameSendPacket(ws, Emitter.sendAddPlayer(this.clients[i].player.id));
        }
        this.gameBroadcast(Emitter.sendAddPlayer(ws.player.id));

        //this.gameJoinAllPlayer();
        //this.gameSendPacket(Emitter.sendAddPlayer(ws.player.id));
    }

    /**
     * クライアントが切断したときの処理
     * @param {*} ws 
     */
    onSocketClose(ws) {
        ws.isConnected = false;
        ws.sendPacket = function(data) {};
        this.gameBroadcast(Emitter.sendDeleteID(ws.player.id));
    }

    /**
     * クライアントとの接続が不安定な状態
     * @param {*} ws 
     */
    onSocketError(ws) {
        ws.sendPacket = function(data) {};
        ws.close(1002, "Socket error");
    }

    /**
     * クライアントからのメッセージを処理
     * @param {*} ws 
     */
    onSocketMessage(ws, message) {
        ws.message.handler(message);
    }

    /**
     * メインループ
     */
    mainLoop() {
        this.updateGameMoveEngine();
        setTimeout(this.loopBind, this.serverFPS);
    }

    /**
     * プレイヤー更新処理
     */
    updateGameMoveEngine() {
        for (let i in this.clients) {
            const player = this.clients[i].player;
            if (player.isSuccess) {
                player.updatePosition();
                player.updateEmitter();
            }
        }
    }

    /**
     * パケットの送信
     */
    gameSendPacket(ws, buffer) {
        ws.sendPacket(buffer);
    }

    gameJoinAllPlayer() {
        for (let i in this.clients) {
            const player = this.clients[i];
            this.gameBroadcast(Emitter.sendAddPlayer(player.player.id));
        }
    }

    gameBroadcast(buffer) {
        for (let i in this.clients) {
            const player = this.clients[i];
            player.sendPacket(buffer);
        }
    }

    getClientSeqId() {
        if (this.clientSeqID > 65535) {
            this.clientSeqID = 0;
        }
        return this.clientSeqID++;
    }
}

WebSocket.prototype.sendPacket = function(packet) {
    if (this.readyState == WebSocket.OPEN) {
        this.send(packet, { binary: true });
    } else {
        this.readyState = WebSocket.CLOSED;
        this.emit('close');
        this.removeAllListeners();
    }
}

module.exports = Server;