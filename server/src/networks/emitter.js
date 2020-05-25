const Writer = require('./writer.js');

class Emitter {
    static sendTestMessage() {
        const write = new Writer();
        write.writeString('Hello World');
        return write.toBuffer();
    }

    static sendAddPlayer(id) {
        const write = new Writer();
        write.writeUint8(1);
        write.writeUint32(id);
        return write.toBuffer();
    }

    static sendAddAllPlayer(id) {
        const write = new Writer();
        write.writeUint8(1);
        write.writeUint32(id);
        return write.toBuffer();
    }

    static sendPlayerInfo(id, position, direction) {
        const write = new Writer();
        write.writeUint8(2);
        write.writeUint32(id);
        write.writeUint32(position.x);
        write.writeUint32(position.y);
        write.writeInt8(direction);
        return write.toBuffer();
    }

    static sendMapchip() {
        const mapchip = [
            [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
            [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
        ]

        const write = new Writer();
        write.writeUint8(3);
        write.writeUint8(20); // row
        write.writeUint8(20); // col
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                write.writeUint8(mapchip[i][j]);
            }
        }
        return write.toBuffer();
    }

    static sendSelfID(id) {
        const write = new Writer();
        write.writeUint8(4);
        write.writeUint32(id);
        return write.toBuffer();
    }

    static sendDeleteID(id) {
        const write = new Writer();
        write.writeUint8(5);
        write.writeUint32(id);
        return write.toBuffer();
    }
}

module.exports = Emitter;