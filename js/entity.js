function Entity(properties) {
    this.properties = properties;
    this.div = [];
}

Entity.prototype.addToField = function (pos, params = {}) {
    let div = document.createElement('div');
    for (let key in params) {
        div[key] = params[key];
    }
    let kind = params.kind ? params.kind : 0;
    div.kind = kind;
    div.style.position = 'absolute';
    div.style.width = this.properties[kind].size.width + 'px';
    div.style.height = this.properties[kind].size.height + 'px';
    div.style.top = pos.top + 'px';
    div.style.left = pos.left + 'px';
    div.style.backgroundImage = 'url("' + this.properties[kind].img + '")';
    document.getElementById('gameplace').appendChild(div);
    this.div.push(div);
};

Entity.prototype.move = function (pos, index = 0) {
    if (pos.left !== false) {
        this.div[index].style.left = pos.left + 'px';
    }
    if (pos.top !== false) {
        this.div[index].style.top = pos.top + 'px';
    }
};

Entity.prototype.getPos = function (index = 0) {
    return {
        top: parseFloat(this.div[index].style.top, 10),
        left: parseFloat(this.div[index].style.left, 10)
    };

};

Entity.prototype.removeDiv = function (index = 0) {
    document.getElementById('gameplace').removeChild(this.div[index]);
};
