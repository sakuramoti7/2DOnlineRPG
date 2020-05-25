class Reader {
    constructor(buffer) {
        this.offset = 0;
        this.buffer = new Buffer.from(buffer);
    }

    readInt8() {
        return this.buffer.readInt8(this.offset++);
    }

    readUint8() {
        return this.buffer.readUInt8(this.offset++);
    }

    readInt16() {
        const result = this.buffer.readInt16LE(this.offset);
        this.offset += 2;
        return result;
    }

    readUint16() {
        const result = this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return result;
    }

    readInt32() {
        const result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return result;
    }

    readUint32() {
        const result = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    
    readFloat() {
        const result = this.buffer.readFloatLE(this.offset);
        this.offset += 4;
        return result;
    }

    readDouble() {
        const result = this.buffer.readDoubleLE(this.offset);
        this.offset += 8;
        return result;
    }

    readBytes(length) {
        return this.buffer.slice(this.offset, this.offset + length);
    };

    skipBytes(length) {
        this.offset += length;
    }

    readString() {
        const length = this.readUInt16();
        let result = "";
        for (let i = 0; i < length; i++) {
            result += String.fromCharCode(this.readUint16());
        }
        return result;
    }
}

module.exports = Reader;