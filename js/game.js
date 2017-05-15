function Game(type) {

    this.type = type;
    //Объекты игры
    this.player = {};
    this.enemy = {};
    this.bullet = {};

    //Переменные игрового процесса
    this.gameTime = 0;
    this.isGameOver = true;
    this.score = 0;
    this.lastTime = 0;
    this.isBonus = false;
    this.lastBonusTime = 0;

}

Game.prototype.PROPERTIES = [
    {
        size: {
            width: 800,
            height: 600,
        },
        level: .998
    }
];

//Инициализация игры
Game.prototype.init = function () {

    let _this = this;

    this.player = new Player(0, this);
    this.player.addToField({
        top: 0,
        left: 0
    });
    this.bullet = new Bullet(this);
    this.enemy = new Enemy(this);
    this.reset();

    document.getElementById('play-again').addEventListener('click', function () {
        _this.reset();
    });

    this.loop();

};

Game.prototype.reset = function () {
    this.player.move(
        {
            top: (this.PROPERTIES[this.type].size.height - this.player.PROPERTIES[this.type].size.height) / 2,
            left: (this.PROPERTIES[this.type].size.width - this.player.PROPERTIES[this.type].size.width) / 2
        }
    );
    this.enemy.removeAllDivs();
    this.bullet.removeAllDivs();
    this.player.div[this.player.type].style.display = '';
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
    this.move(delta, [this.enemy, this.bullet]);
    if (!this.isGameOver) {
        this.player.handleInput(delta);
        this.checkCollisions();
        this.checkBonus(delta);
    }

    document.getElementById('score').innerHTML = this.score;
    requestAnimationFrame(function () {
        _this.loop();
    });
};

Game.prototype.move = function (delta, objects) {
    objects.forEach(function (item) {
        item.moveAllDivs(delta);
    });
};

Game.prototype.generateEnemy = function (delta) {
    this.gameTime += delta;
    if (Math.random() < 1 - Math.pow(this.PROPERTIES[this.type].level, this.gameTime)) {
        let type = Math.random() * 10;
        let kind = 0;
        if (type > 9) {
            kind = 2;
        } else if (type > 8) {
            kind = 1;
        }
        this.enemy.addToField(kind, this.PROPERTIES[this.type].size.width);
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
    this.player.div[this.player.type].style.display = 'none';
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