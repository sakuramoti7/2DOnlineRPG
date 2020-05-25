'use strict';

class Writer {
    constructor() {
        this.buffer = [];
        this.length = 0;
    }

    writeUint8(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeUInt8(value, offset, true);
        });
        this.length += 1;
    };

    writeInt8(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeInt8(value, offset, true);
        });
        this.length += 1;
    };

    writeUint16(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeUInt16LE(value, offset, true);
        });
        this.length += 2;
    };

    writeInt16(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeInt16LE(value, offset, true);
        });
        this.length += 2;
    };

    writeUint32(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeUInt32LE(value, offset, true);
        });
        this.length += 4;
    };

    writeInt32(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeInt32LE(value, offset, true);
        });
        this.length += 4;
    };

    writeFloat(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeFloatLE(value, offset, true);
        });
        this.length += 4;
    };

    writeDouble(value) {
        var offset = this.length;
        this.buffer.push(function(buffer) {
            buffer.writeDoubleLE(value, offset, true);
        });
        this.length += 8;
    };

    writeString(str) {
        this.writeUint16(str.length);
        for (var i = 0; i < str.length; i++) {
            this.writeUint16(str.charCodeAt(i));
        }
    };

    toBuffer() {
        var buffer = new Buffer(this.length);
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i](buffer);
        }
        return buffer;
    };
}

module.exports = Writer;