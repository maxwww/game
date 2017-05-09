function Entity(properties, type) {
    this.properties = properties;
    this.type = type;
    this.div = [];
}

Entity.prototype.addToField = function (pos, kind = 0) {
    if (this.type === Entity.TYPE_SINGLE) {
        this.addSingle(pos, kind);
    } else if (this.type === Entity.TYPE_ARRAY) {
        this.addToArray(pos, kind);
    } else {
        throw new Error("Неизвестный тип!");
    }
};

Entity.prototype.addSingle = function (pos, kind) {
    this.div = this.createDiv(pos, kind);
};

Entity.prototype.addToArray = function (pos, kind) {
    this.div.push(this.createDiv(pos, kind));
};

Entity.prototype.createDiv = function (pos, kind) {
    let div = document.createElement('div');
    div.kind = kind;
    div.style.position = 'absolute';
    div.style.width = this.properties[kind].size.width + 'px';
    div.style.height = this.properties[kind].size.height + 'px';
    div.style.top = pos.top + 'px';
    div.style.left = pos.left + 'px';
    div.style.backgroundImage = 'url("' + this.properties[kind].img + '")';
    document.getElementById('gameplace').appendChild(div);
    return div;
};

Entity.prototype.move = function (pos, index = false) {
    if (index === false) {
        this.moveDiv(this.div, pos);
    } else {
        this.moveDiv(this.div[index], pos);
    }
};

Entity.prototype.moveDiv = function (div, pos) {
    if (pos.left !== false) {
        div.style.left = pos.left + 'px';
    }
    if (pos.top !== false) {
        div.style.top = pos.top + 'px';
    }
};

Entity.prototype.getPos = function (index = false) {
    if (index === false) {
        return {
            top: parseFloat(this.div.style.top, 10),
            left: parseFloat(this.div.style.left, 10)
        };
    } else {
        return {
            top: parseFloat(this.div[index].style.top, 10),
            left: parseFloat(this.div[index].style.left, 10)
        };
    }
};

Entity.prototype.removeDiv = function (index = false) {
    if (index === false) {
        document.getElementById('gameplace').removeChild(this.div);
        this.div = {};
    } else {
        document.getElementById('gameplace').removeChild(this.div[index]);
    }
};

//константы
Entity.TYPE_SINGLE = 1;
Entity.TYPE_ARRAY = 2;