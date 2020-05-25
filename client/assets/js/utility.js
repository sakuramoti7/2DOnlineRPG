class AssetManager {
    constructor() {
        this.images = {};
    }

    AddImage(value) {
        let img = new Image();
        img.src = value;
        this.images[value] = img;
    }

    GetImage(value) {
        return this.images[value];
    }
}

class DrawEngine {
}