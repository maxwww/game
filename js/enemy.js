function Enemy() {
    Plenty.apply(this, arguments);
}
Enemy.prototype = Object.create(Plenty.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.addToField = function (kind = 0, fieldWidth) {
    let maxLeft = fieldWidth - this.properties[kind].size.width;
    let left = Math.random()*maxLeft;
    let top = -this.properties[kind].size.height;
    let pos = {
        top: top,
        left: left
    };
    Plenty.prototype.addToField.call(this, pos, kind);
};

Enemy.prototype.createDiv = function (pos, kind) {
    let div = Entity.prototype.createDiv.apply(this, arguments);
    div.stability = this.properties[kind].stability;
    return div;
};
