class Writer {
    constructor(littleEndian) {
        this.buffer = new DataView(new ArrayBuffer(8));
        this.endian = littleEndian;
        this.reset();
    }

    reset() {
        this.view = [];
        this.offset = 0;
    }

    setUint8(a) {
        if (a >= 0 && a < 256) this.view.push(a);
    }

    setInt8(a) {
        if (a >= -128 && a < 128) this.view.push(a);
    }

    setUint16(a) {
        this.buffer.setUint16(0, a, this.endian);
        this.skipBytes(2);
    }

    setInt16(a) {
        this.buffer.setInt16(0, a, this.endian);
        this.skipBytes(2);
    }

    setUint32(a) {
        this.buffer.setUint32(0, a, this.endian);
        this.skipBytes(4);
    }

    setInt32(a) {
        this.buffer.setInt32(0, a, this.endian);
        this.skipBytes(4);
    }

    setFloat32(a) {
        this.buffer.setFloat32(0, a, this.endian);
        this.skipBytes(4);
    }

    setFloat64(a) {
        this.buffer.setFloat64(0, a, this.endian);
        this.skipBytes(8);
    }

    skipBytes(a) {
        for (let i = 0; i < a; i++) 
            this.view.push(this.buffer.getUint8(i));
    }

	setString(s) {
        this.setUint16(s.length);
		for (let i = 0; i < s.length; i++) 
            this.setUint16(s.charCodeAt(i));
	}

    build() {
        return new Uint8Array(this.view);
    }
}

class Reader {
	constructor(view, offset, littleEndian) {
		this.view = view;
		this.offset = offset || 0;
		this.endian = littleEndian;
	}

	getUint8() {
		return this.view.getUint8(this.offset++, this.endian);
	}

	getInt8() {
		return this.view.getInt8(this.offset++, this.endian);
	}

	getUint16() {
		let result = this.view.getUint16(this.offset, this.endian);
		this.skipBytes(2);
		return result;
	}

	getInt16() {
		let result = this.view.getInt16(this.offset, this.endian);
		this.skipBytes(2);
		return result;
	}

	getUint32() {
		let result = this.view.getUint32(this.offset, this.endian);
		this.skipBytes(4);
		return result;
	}

	getInt32() {
		let result = this.view.getInt32(this.offset, this.endian);
		this.skipBytes(4);
		return result;
	}

	getFloat32() {
		let result = this.view.getFloat32(this.offset, this.endian);
		this.skipBytes(4);
		return result;
	}

	getFloat64() {
		let result = this.view.getFloat64(this.offset, this.endian);
		this.skipBytes(8);
		return result;
	}

	getString() {
		let text = "";
		let len = this.getUint16();
		for (let i = 0; i < len; i++) {
			text += String.fromCharCode(this.getUint16());
		}
        return text;
	}

	skipBytes(length) {
		this.offset += length;
	}
}