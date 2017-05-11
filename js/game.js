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

}

//Константы
Game.prototype.FIELD_CONSTANS = {
    WIDTH: 800,
    HEIGHT: 600
};
Game.prototype.PLAYER_CONSTANS = {
    properties: [
        {
            speed: 400,
            size: {
                width: 72,
                height: 104,
            },
            img: 'img/ship.png'
        }
    ]
};
Game.prototype.BULLET_CONSTANS = {
    properties: [
        {
            speed: 500,
            size: {
                width: 10,
                height: 24,
            },
            img: 'img/bullet_s.png',
            direction: 0
        },
        {
            speed: 500,
            size: {
                width: 15,
                height: 22,
            },
            img: 'img/bullet_s_r.png',
            direction: 200
        },
        {
            speed: 500,
            size: {
                width: 15,
                height: 22,
            },
            img: 'img/bullet_s_l.png',
            direction: -200
        }
    ],

    DELAY: 75
};
Game.prototype.ENEMY_CONSTANS = {
    properties: [
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
    ]
};
Game.prototype.LEVEL = .998;

//Инициализация игры
Game.prototype.init = function () {

    let _this = this;

    this.player = new Player(this.PLAYER_CONSTANS.properties);
    this.player.addToField({
        top: (this.FIELD_CONSTANS.HEIGHT - this.player.properties[0].size.height) / 2,
        left: (this.FIELD_CONSTANS.WIDTH - this.player.properties[0].size.width) / 2
    });
    this.bullet = new Bullet(this.BULLET_CONSTANS.properties);
    this.enemy = new Enemy(this.ENEMY_CONSTANS.properties);
    this.reset();

    document.getElementById('play-again').addEventListener('click', function () {
        _this.reset();
    });

    this.loop();

};

Game.prototype.reset = function () {
    this.player.move(
        {
            top: (this.FIELD_CONSTANS.HEIGHT - this.player.properties[0].size.height) / 2,
            left: (this.FIELD_CONSTANS.WIDTH - this.player.properties[0].size.width) / 2
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
        let y = (this.player.getPos()).top + delta * this.player.properties[0].speed;
        if (y > (this.FIELD_CONSTANS.HEIGHT - this.player.properties[0].size.height)) {
            y = this.FIELD_CONSTANS.HEIGHT - this.player.properties[0].size.height;
        }
        this.player.move({
            left: false,
            top: y
        });

    }

    if (input.isDown('UP') || input.isDown('w')) {
        let y = (this.player.getPos()).top - delta * this.player.properties[0].speed;
        if (y < 0) {
            y = 0;
        }
        this.player.move({
            left: false,
            top: y
        });
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        let x = (this.player.getPos()).left + delta * this.player.properties[0].speed;
        if (x > (this.FIELD_CONSTANS.WIDTH - this.player.properties[0].size.width)) {
            x = this.FIELD_CONSTANS.WIDTH - this.player.properties[0].size.width;
        }
        this.player.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        let x = (this.player.getPos()).left - delta * this.player.properties[0].speed;
        if (x < 0) {
            x = 0;
        }
        this.player.move({
            left: x,
            top: false
        });
    }

    if (input.isDown('SPACE') && !this.isGameOver && Date.now() - this.lastFire > this.BULLET_CONSTANS.DELAY) {
        let x = (this.player.getPos()).left + (this.player.properties[0].size.width - this.bullet.properties[0].size.width) / 2;
        let y = (this.player.getPos()).top - this.bullet.properties[0].size.height;
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
        let speed = Math.sqrt(Math.pow(this.bullet.properties[bullets[i]['kind']].speed, 2) - Math.pow(this.bullet.properties[bullets[i]['kind']].direction, 2));
        let y = (this.bullet.getPos(i)).top - delta * speed;
        let x = (this.bullet.getPos(i)).left + delta *  this.bullet.properties[bullets[i]['kind']].direction;
        console.dir(this.bullet.properties[bullets[i]['kind']].direction);
        this.bullet.move({
            left: x,
            top: y
        }, i);
        if (!this.bullet.inField(bullets[i], {
                x: 0,
                y: 0,
                width: this.FIELD_CONSTANS.WIDTH,
                height: this.FIELD_CONSTANS.HEIGHT
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
        let y = (this.enemy.getPos(i)).top + delta * this.enemy.properties[enemies[i]['kind']].speed;
        this.enemy.move({
            left: false,
            top: y
        }, i);
        if (!this.enemy.inField(enemies[i], {
                x: 0,
                y: 0,
                width: this.FIELD_CONSTANS.WIDTH,
                height: this.FIELD_CONSTANS.HEIGHT
            })) {
            this.enemy.removeDiv(i);
            this.enemy.div.splice(i, 1);
            i--;
        }
    }
};

Game.prototype.generateEnemy = function (delta) {
    this.gameTime += delta;
    if (Math.random() < 1 - Math.pow(this.LEVEL, this.gameTime)) {
        let type = Math.random() * 10;
        let kind = 0;
        if (type > 9) {
            kind = 2;
        } else if (type > 8) {
            kind = 1;
        }

        this.enemy.addToField(kind, this.FIELD_CONSTANS.WIDTH);
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