function Game() {

    //Объекты игры
    this.player = {};
    this.enemy = {};
    this.bullet = {};

    //Переменные игрового процесса
    this.gameTime = 0;
    this.isGameOver = true;
    this.score = 0;
    this.lastTime = 0;
    this.lastFire = 0;
    this.isBonus = false;
    this.lastBonusTime = 0;
    this.PROPERTIES = [
        {
            size: {
                width: 800,
                height: 600,
            },
            level: .998
        }
    ];

}

//Инициализация игры
Game.prototype.init = function () {

    let _this = this;

    this.player = new Player();
    this.player.addToField({
        top: (this.PROPERTIES[0].size.height - this.player.PROPERTIES[0].size.height) / 2,
        left: (this.PROPERTIES[0].size.width - this.player.PROPERTIES[0].size.width) / 2
    });
    this.bullet = new Bullet();
    this.enemy = new Enemy();
    this.reset();

    document.getElementById('play-again').addEventListener('click', function () {
        _this.reset();
    });

    this.loop();

};

Game.prototype.reset = function () {
    this.player.move(
        {
            top: (this.PROPERTIES[0].size.height - this.player.PROPERTIES[0].size.height) / 2,
            left: (this.PROPERTIES[0].size.width - this.player.PROPERTIES[0].size.width) / 2
        }
    );
    this.enemy.removeAllDivs();
    this.bullet.removeAllDivs();
    this.player.div[0].style.display = '';
    this.isGameOver = false;
    this.lastTime = Date.now();
    this.score = 0;
    this.gameTime = 0;
    this.isBonus = false;
    this.lastBonusTime = 0;
    document.getElementById('game-over').style.display = 'none';

};

Game.prototype.loop = function () {

    let _this = this;
    let now = Date.now();
    let delta = (now - this.lastTime) / 1000.0;
    this.lastTime = now;
    this.generateEnemy(delta);
    this.moveEnemy(delta);
    this.moveBullet(delta);
    if (!this.isGameOver) {
        this.handleInput(delta);
        this.checkCollisions();
        this.checkBonus(delta);
    }

    document.getElementById('score').innerHTML = this.score;
    requestAnimationFrame(function () {
        _this.loop();
    });
};

Game.prototype.handleInput = function (delta) {

    if (input.isDown('DOWN') || input.isDown('s')) {
        let y = (this.player.getPos()).top + delta * this.player.PROPERTIES[0].speed;
        if (y > (this.PROPERTIES[0].size.height - this.player.PROPERTIES[0].size.height)) {
            y = this.PROPERTIES[0].size.height - this.player.PROPERTIES[0].size.height;
        }
        this.player.move({
            left: false,
            top: y
        });

    }

    if (input.isDown('UP') || input.isDown('w')) {
        let y = (this.player.getPos()).top - delta * this.player.PROPERTIES[0].speed;
        if (y < 0) {
            y = 0;
        }
        this.player.move({
            left: false,
            top: y
        });
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        let x = (this.player.getPos()).left + delta * this.player.PROPERTIES[0].speed;
        if (x > (this.PROPERTIES[0].size.width - this.player.PROPERTIES[0].size.width)) {
            x = this.PROPERTIES[0].size.width - this.player.PROPERTIES[0].size.width;
        }
        this.player.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        let x = (this.player.getPos()).left - delta * this.player.PROPERTIES[0].speed;
        if (x < 0) {
            x = 0;
        }
        this.player.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('SPACE') && !this.isGameOver && Date.now() - this.lastFire > this.bullet.PROPERTIES[0].delay) {
        let x = (this.player.getPos()).left + (this.player.PROPERTIES[0].size.width - this.bullet.PROPERTIES[0].size.width) / 2;
        let y = (this.player.getPos()).top - this.bullet.PROPERTIES[0].size.height;
        this.bullet.addToField(
            {
                left: x,
                top: y
            },
            {
                kind: 0
            }
        );
        if (this.isBonus) {
            this.bullet.addToField(
                {
                    left: x + 20,
                    top: y
                },
                {
                    kind: 1
                }
            );
            this.bullet.addToField(
                {
                    left: x - 20,
                    top: y
                },
                {
                    kind: 2
                }
            );
        }
        this.lastFire = Date.now();
    }

};

Game.prototype.moveBullet = function (delta) {
    let bullets = this.bullet.div;
    for (let i = 0; i < bullets.length; i++) {
        let speed = Math.sqrt(Math.pow(this.bullet.PROPERTIES[bullets[i]['kind']].speed, 2) - Math.pow(this.bullet.PROPERTIES[bullets[i]['kind']].direction, 2));
        let y = (this.bullet.getPos(i)).top - delta * speed;
        let x = (this.bullet.getPos(i)).left + delta * this.bullet.PROPERTIES[bullets[i]['kind']].direction;
        this.bullet.move({
            left: x,
            top: y
        }, i);
        if (!this.bullet.inField(bullets[i], {
                x: 0,
                y: 0,
                width: this.PROPERTIES[0].size.width,
                height: this.PROPERTIES[0].size.height
            })) {
            this.bullet.removeDiv(i);
            this.bullet.div.splice(i, 1);
            i--;
        }
    }
};

Game.prototype.moveEnemy = function (delta) {
    let enemies = this.enemy.div;
    for (let i = 0; i < enemies.length; i++) {
        let y = (this.enemy.getPos(i)).top + delta * this.enemy.PROPERTIES[enemies[i]['kind']].speed;
        this.enemy.move({
            left: false,
            top: y
        }, i);
        if (!this.enemy.inField(enemies[i], {
                x: 0,
                y: 0,
                width: this.PROPERTIES[0].size.width,
                height: this.PROPERTIES[0].size.height
            })) {
            this.enemy.removeDiv(i);
            this.enemy.div.splice(i, 1);
            i--;
        }
    }
};

Game.prototype.generateEnemy = function (delta) {
    this.gameTime += delta;
    if (Math.random() < 1 - Math.pow(this.PROPERTIES[0].level, this.gameTime)) {
        let type = Math.random() * 10;
        let kind = 0;
        if (type > 9) {
            kind = 2;
        } else if (type > 8) {
            kind = 1;
        }
        this.enemy.addToField(kind, this.PROPERTIES[0].size.width);
    }
};

Game.prototype.checkCollisions = function () {
    this.score += this.bullet.isBoom(this.enemy);
    if (this.player.isCrashed(this.enemy)) {
        this.gameOver();
    }
};

Game.prototype.gameOver = function () {
    this.isGameOver = true;
    document.getElementById('game-over').style.display = 'block';
    this.player.div[0].style.display = 'none';
};

Game.prototype.checkBonus = function () {
    if (parseInt(this.gameTime, 10) % 10 == 0 && (this.gameTime - this.lastBonusTime) > 2) {
        this.isBonus = true;
        this.lastBonusTime = this.gameTime;
    }
    if (this.isBonus && (this.gameTime - this.lastBonusTime) > 5) {
        this.isBonus = false;
    }
};