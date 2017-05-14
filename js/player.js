function Player() {
    Entity.apply(this, arguments);
    this.PROPERTIES = [
        {
            speed: 400,
            size: {
                width: 72,
                height: 104,
            },
            img: 'img/ship.png'
        }
    ];
    this.lasFire = 0;
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;


Player.prototype.isCrashed = function (enemy) {
    let result = false;
    for (let i = 0; i < enemy.div.length; i++) {
        let x = parseFloat(enemy.div[i].style.left);
        let y = parseFloat(enemy.div[i].style.top);
        let width = parseFloat(enemy.div[i].style.width);
        let height = parseFloat(enemy.div[i].style.height);

        if (Plenty.prototype.inField.call(null, this.div[0], {
                x: x,
                y: y,
                width: width,
                height: height
            })) {
            result = true;
            break;
        }
    }
    return result;
};