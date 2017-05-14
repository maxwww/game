function Enemy() {
    Plenty.apply(this, arguments);
    this.PROPERTIES = [
        {
            speed: 100,
            size: {
                width: 96,
                height: 88,
            },
            img: 'img/asteroid.png',
            stability: 1
        },
        {
            speed: 50,
            size: {
                width: 186,
                height: 184,
            },
            img: 'img/asteroid_b.png',
            stability: 5
        },
        {
            speed: 200,
            size: {
                width: 42,
                height: 40,
            },
            img: 'img/asteroid_f.png',
            stability: 1
        }
    ];
}
Enemy.prototype = Object.create(Plenty.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.addToField = function (kind = 0, fieldWidth) {
    let maxLeft = fieldWidth - this.PROPERTIES[kind].size.width;
    let left = Math.random()*maxLeft;
    let top = -this.PROPERTIES[kind].size.height;
    let pos = {
        top: top,
        left: left
    };
    let params = {
        kind: kind,
        stability: this.PROPERTIES[kind].stability
    };
    Plenty.prototype.addToField.call(this, pos, params);

};
