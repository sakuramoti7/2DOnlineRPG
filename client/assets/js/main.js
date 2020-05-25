const mainCanvas = document.getElementById("canvas");
const context = mainCanvas.getContext("2d");
const w = { x: context.Width, y: context.Height };
let connection = null;
let playersInfo = {};
let players = [];
let selfID = 0;
let mapchip = new Array(10);
let mapImage = new Image();
let playerImage = new Image();
let maploaded = false;
let row = 0, col = 0;
let keyArray = new Array(256);
let animation = 0;
mapImage.src = "./assets/img/main.png";
playerImage.src = "./assets/img/player2.png";
setInterval(animationPlayer, 500);

class Player {
    constructor(pos) {
        this.position = pos;
        this.direction = 0;
    }

    setPosition(pos) { this.position = pos; }
    getPosition() { return this.position; }
    
    setDirection(dir) { this.direction = dir; }
    getDirection() { return this.direction; }
}//150.95.172.49

function initialize() {
    connection = new WebSocket("ws://150.95.172.49:3000");//localhost
    connection.binaryType = "arraybuffer";
    connection.onopen = onSocketOpen.bind(this);
    connection.onmessage = onSocketMessage.bind(this);

    for (let i = 0; i < 256; i++) {
        keyArray[i] = false;
    }

    document.onkeydown = (e) => { keyDown(e); };
    document.onkeyup = (e) => { keyUp(e); };

    //connection.onclose = onSocketClose.bind(this);
    //connection.onerror = onSocketError.bind(this);
}

function animationPlayer() {
    if (animation < 2) {
        animation++;
    } else {
        animation %= 2;
    }
}

function update() {
    updateKey();
}

function drawing() {
    players.sort(function(a, b) { return a.position.y - b.position.y; });

    context.clearRect(0,0,640,480);
    context.fillStyle = "#000000";
    context.fillRect(0,0,640,480);

    if (maploaded && playersInfo[selfID]) {
        context.save();
        context.translate(640 / 2, 480 / 2);
        //context.scale(2.0, 2.0);
        context.translate(-playersInfo[selfID].position.x, -playersInfo[selfID].position.y);

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                context.drawImage(mapImage,
                    (mapchip[i][j] % mapImage.width) * 32, 
                    (mapchip[i][j] / mapImage.height) * 32,
                    32, 32, 
                    j * 32,
                    i * 32,
                    32, 32);
            }
        }

        for (let i in players) {
            context.save();
            const player = players[i];
            const position = player.getPosition();
            const direction = player.getDirection();
            context.fillStyle = "#ffffff";
            context.drawImage(playerImage,
                animation * 32, 
                direction * 32,
                32, 32, 
                position.x,
                position.y,
                32, 32);
            context.restore();
        }
        context.restore();
    }
}

function onSocketSend(buffer) {
    if (!connection) return;
    if (connection.readyState != 1) return;
    if (buffer.build) connection.send(buffer.build());
    else connection.send(buffer.buffer);
}

function onSocketOpen() {
    console.log("socket open");
}

function onSocketMessage(msg) {
    const reader = new Reader(new DataView(msg.data), 0, true);
    const id = reader.getUint8();
    switch (id) {
        case 1: // add
            var playerID = reader.getUint32();
            playersInfo[playerID] = new Player(playerID, { x: 0, y: 0 });
            players.push(playersInfo[playerID]);
            break;
        case 2: // update
            var playerID = reader.getUint32();
            var x = reader.getUint32();
            var y = reader.getUint32();
            var dir = reader.getUint8();
            playersInfo[playerID].setPosition({ x: x, y: y });
            playersInfo[playerID].setDirection(dir);
            break;
        case 3: // map
            maploaded = true;

            col = reader.getUint8();
            row = reader.getUint8();

            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    mapchip[i] = new Array(10);
                }
            }

            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    mapchip[i][j] = reader.getUint8();
                }
            }
            break;
        case 4: // selfID
            selfID = reader.getUint32();
            break;
        case 5: // delete
            var deleteID = reader.getUint32();
            var tmp = players.indexOf(deleteID);
            if (tmp != -1) {
                players.splice(deleteID, 1);
            }
            break;
    }
}

function keyDown(event) {
    keyArray[event.keyCode] = true;
}

function keyUp(event) {
    keyArray[event.keyCode] = false;
}

function updateKey() {
    for (let i = 0; i < keyArray.length; i++) {
        if (keyArray[i]) {
            sendKey(i);
        }
    }
}

function sendKey(keyCode) {
    const write = new Writer(true);
    write.setUint8(1)
    write.setUint8(keyCode);
    onSocketSend(write);
}