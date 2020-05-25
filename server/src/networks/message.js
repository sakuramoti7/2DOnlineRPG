const Reader = require('./reader.js');
const Emitter = require('./emitter.js');

class Message {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;

        this.function = {
            0: this.joinGame.bind(this),
            1: this.keyDown.bind(this)
        }

        this.server.gameSendPacket(socket, Emitter.sendMapchip());
        this.server.gameSendPacket(socket, Emitter.sendSelfID(this.socket.player.id));

        this.socket.player.isSuccess = true;
    }

    /**
     * クライアントから受け取ったメッセージを変換
     * @param {*} msg 
     */
    handler(msg) {
        if (msg.length == 0)
            return;
        if (msg.length > 2048)
            return;

        const reader = new Reader(msg);
        const id = reader.readUint8();

        if (this.function[id]) {
            this.function[id](reader);
        }
    }

    joinGame(reader) {
        //const name = reader.readString();
        //this.socket.player.name = name;
    }

    keyDown(reader) {
        const keyCode = reader.readUint8();
        let px = 0, py = 0, dir = 0;
        let dash = 1;

        if (keyCode == 16) {
            //this.socket.player.isDash = true;
        }
        
        if (this.socket.player.isDash) {
            dash = 2;
        }

        //if (this.socket.player.position.x % 32 == 0 ||
        //    this.socket.player.position.y % 32 == 0) {
            if (keyCode == 37) {
                px = -1 * dash;
                dir = 1;
            }
            if (keyCode == 38) {
                py = -1 * dash;
                dir = 3;
            }
            if (keyCode == 39) {
                px = 1 * dash;
                dir = 2
            }
            if (keyCode == 40) {
                py = 1 * dash;
                dir = 0;
            }
        //}

        this.socket.player.position.x += px;
        this.socket.player.position.y += py;
        this.socket.player.direction = dir;
    }
}

module.exports = Message;