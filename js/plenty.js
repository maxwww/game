function Plenty(game) {
    Entity.apply(this, arguments);
    this.game = game;
}
Plenty.prototype = Object.create(Entity.prototype);
Plenty.prototype.constructor = Plenty;

Plenty.prototype.inField = function (div, border) {
    let b_x = border.x;
    let b_y = border.y;
    let b_width = border.width;
    let b_height = border.height;

    let e_x = parseFloat(div.style.left, 10);
    let e_y = parseFloat(div.style.top, 10);
    let e_width = parseFloat(div.style.width, 10);
    let e_height = parseFloat(div.style.height, 10);

    return ((e_x + e_width) >= b_x) &&
        (e_x <= (b_x + b_width)) &&
        ((e_y + e_height) >= b_y) &&
        (e_y < (b_y + b_height));

};

Plenty.prototype.moveAllDivs = function(delta) {
    let objects = this.div;
    for (let i = 0; i < objects.length; i++) {
        let y = (this.getPos(i)).top + delta * this.PROPERTIES[objects[i]['kind']].speed;
        this.move({
            left: false,
            top: y
        }, i);
        if (!this.inField(objects[i], {
                x: 0,
                y: 0,
                width: this.game.PROPERTIES[this.game.type].size.width,
                height: this.game.PROPERTIES[this.game.type].size.height
            })) {
            this.removeDiv(i);
            this.div.splice(i, 1);
            i--;
        }
    }
};

Plenty.prototype.removeAllDivs = function () {
    for (let i = 0; i < this.div.length; i ++) {
        document.getElementById('gameplace').removeChild(this.div[i]);
    }
    this.div = [];
};