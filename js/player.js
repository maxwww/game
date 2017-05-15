function Player(type, game) {
    Entity.apply(this, arguments);
    this.type  = type;
    this.game  = game;
    this.lastFire = 0;
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.PROPERTIES = [
    {
        speed: 400,
        size: {
            width: 72,
            height: 104,
        },
        img: 'img/ship.png',
        delay: 100
    }
];

Player.prototype.isCrashed = function (enemy) {
    let result = false;
    for (let i = 0; i < enemy.div.length; i++) {
        let x = parseFloat(enemy.div[i].style.left);
        let y = parseFloat(enemy.div[i].style.top);
        let width = parseFloat(enemy.div[i].style.width);
        let height = parseFloat(enemy.div[i].style.height);

        if (Plenty.prototype.inField.call(null, this.div[this.type], {
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

Player.prototype.handleInput = function (delta) {

    if (input.isDown('DOWN') || input.isDown('s')) {
        let y = (this.getPos()).top + delta * this.PROPERTIES[this.type].speed;
        if (y > (this.game.PROPERTIES[this.game.type].size.height - this.PROPERTIES[this.type].size.height)) {
            y = this.game.PROPERTIES[this.game.type].size.height - this.PROPERTIES[this.type].size.height;
        }
        this.move({
            left: false,
            top: y
        });

    }

    if (input.isDown('UP') || input.isDown('w')) {
        let y = (this.getPos()).top - delta * this.PROPERTIES[this.type].speed;
        if (y < 0) {
            y = 0;
        }
        this.move({
            left: false,
            top: y
        });
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        let x = (this.getPos()).left + delta * this.PROPERTIES[this.type].speed;
        if (x > (this.game.PROPERTIES[this.game.type].size.width - this.PROPERTIES[this.type].size.width)) {
            x = this.game.PROPERTIES[this.game.type].size.width - this.PROPERTIES[this.type].size.width;
        }
        this.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        let x = (this.getPos()).left - delta * this.PROPERTIES[this.type].speed;
        if (x < 0) {
            x = 0;
        }
        this.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('SPACE') && Date.now() - this.lastFire > this.PROPERTIES[this.type].delay) {
        let x = (this.getPos()).left + (this.PROPERTIES[this.type].size.width - this.game.bullet.PROPERTIES[0].size.width) / 2;
        let y = (this.getPos()).top - this.game.bullet.PROPERTIES[0].size.height;
        this.game.bullet.addToField(
            {
                left: x,
                top: y
            },
            {
                kind: 0
            }
        );
        if (this.game.isBonus) {
            this.game.bullet.addToField(
                {
                    left: x + 50,
                    top: y
                },
                {
                    kind: 0
                }
            );
            this.game.bullet.addToField(
                {
                    left: x - 50,
                    top: y
                },
                {
                    kind: 0
                }
            );
        }
        this.lastFire = Date.now();
    }

};