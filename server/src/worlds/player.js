const Emitter = require('../networks/emitter.js');

class Player {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;
        this.id = server.getClientSeqId();
        this.name = "";
        this.position = { x: 0, y: 0 };
        this.direction = 0;
        this.hp = 0;
        this.atk = 0;
        this.isSuccess = false;
        this.isDash = false;
    }

    updatePosition() {
        if (this.position.x < 0) {
            this.position.x = 0;
        }

        if (this.position.y < 0) {
            this.position.y = 0;
        }
        //console.log(this.position);
    }

    updateEmitter() {
        this.server.gameBroadcast(Emitter.sendPlayerInfo(this.id, this.position, this.direction));
    }
}

module.exports = Player;