var lastTime;
const GAME_PlASE_HEIGHT = 600;
const GAME_PlASE_WIDTH = 800;
const SHIP_SPEED = 200;
const PLAYER_SPEED = 400;
const BULLET_SPEED = 450;
const ENEMY_SPEED = 200;


var player = new Player(PLAYER_SPEED);


var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var score = 0;
var enemies = [];
var bullets = [];
var bonuses = [];


init();

function init() {
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    loop();
}

function loop() {
    var now = Date.now();
    var delta = (now - lastTime) / 1000.0;
    lastTime = now;
    move(delta);
    logic(delta);
    requestAnimationFrame(loop);
}

function Player(speed) {
    this.speed = speed;
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = '104px';
    this.div.style.width = '72px';
    this.div.style.top = (GAME_PlASE_HEIGHT - 104) / 2 + 'px';
    this.div.style.left = (GAME_PlASE_WIDTH - 72) / 2 + 'px';
    this.div.style.backgroundImage = 'url("img/ship.png")';

    document.getElementById('gameplace').appendChild(this.div);
}

function move(delta) {
    handleInput(delta);
    moveEnemies(delta);
    moveBullets(delta);
}

function logic(delta) {
    gameTime += delta;

    if (Math.random() < 1 - Math.pow(.998, gameTime)) {
        var type = Math.random() * 10;
        if (type > 9) {
            enemies.push(new Enemy(1, 800, 'asteroid_f.png', 40, 42))
        } else if (type > 8) {
            enemies.push(new Enemy(5, 50, 'asteroid_b.png', 184, 186))
        } else {
            enemies.push(new Enemy(1, 150, 'asteroid.png', 88, 96))
        }
    }

    for (var i = 0; i < enemies.length; i++) {
        var e_x = parseFloat(enemies[i].div.style.left, 10);
        var e_y = parseFloat(enemies[i].div.style.top, 10);
        var e_width = parseFloat(enemies[i].div.style.width, 10);
        var e_height = parseFloat(enemies[i].div.style.height, 10);

        var p_x = parseFloat(player.div.style.left, 10);
        var p_y = parseFloat(player.div.style.top, 10);
        var p_width = parseFloat(player.div.style.width, 10);
        var p_height = parseFloat(player.div.style.height, 10);

        if (
            (e_x > (p_x - e_width)) &&
            (e_x < (p_x + p_height)) &&
            (e_y > (p_y - e_height)) &&
            (e_y < (p_y + p_height))
        ) {
            gameOver();
        }

        for (var j = 0; j < bullets.length; j++) {
            var b_x = parseFloat(bullets[j].div.style.left, 10);
            var b_y = parseFloat(bullets[j].div.style.top, 10);
            var b_width = parseFloat(bullets[j].div.style.width, 10);
            var b_height = parseFloat(bullets[j].div.style.height, 10);

            if(
                (b_x > (e_x - b_width)) &&
                (b_x < (e_x + e_width)) &&
                (b_y < (e_y + e_height))
            ) {
                enemies[i].stability--;

                if (enemies[i].stability == 0) {
                    score++;
                    document.getElementById('gameplace').removeChild(enemies[i].div);
                    enemies.splice(i, 1);
                    i--;
                }
                document.getElementById('gameplace').removeChild(bullets[j].div);
                bullets.splice(j, 1);
                break;
            }
        }
    }

    document.getElementById('score').innerHTML = score;

}

function handleInput(delta) {
    if (input.isDown('DOWN') || input.isDown('s')) {
        player.div.style.top = (parseFloat(player.div.style.top, 10) + delta * player.speed) + 'px';
        if (parseFloat(player.div.style.top, 10) > (GAME_PlASE_HEIGHT - parseFloat(player.div.style.height, 10))) {
            player.div.style.top = GAME_PlASE_HEIGHT - parseFloat(player.div.style.height, 10) + 'px';
        }
    }

    if (input.isDown('UP') || input.isDown('w')) {
        player.div.style.top = (parseFloat(player.div.style.top, 10) - delta * player.speed) + 'px';
        if (parseFloat(player.div.style.top, 10) < 0) {
            player.div.style.top = '0px';
        }
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        player.div.style.left = (parseFloat(player.div.style.left, 10) - delta * player.speed) + 'px';
        if (parseFloat(player.div.style.left, 10) < 0) {
            player.div.style.left = '0px';
        }

    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.div.style.left = (parseFloat(player.div.style.left, 10) + delta * player.speed) + 'px';
        if (parseFloat(player.div.style.left, 10) > (GAME_PlASE_WIDTH - parseFloat(player.div.style.width, 10))) {
            player.div.style.left = GAME_PlASE_WIDTH - parseFloat(player.div.style.width, 10) + 'px';
        }
    }

    if (input.isDown('SPACE') &&
        !isGameOver &&
        Date.now() - lastFire > 100) {
        var x = parseFloat(player.div.style.left, 10) + (parseFloat(player.div.style.width, 10) - 10) / 2;
        var y = parseFloat(player.div.style.top, 10) - 24;

        bullets.push(new Bullet(BULLET_SPEED, y, x, 'bullet_s.png', 24, 10));

        lastFire = Date.now();
    }
}

function Enemy(stability, speed, img, height, width) {
    this.speed = speed;
    this.stability = stability;
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = height + 'px';
    this.div.style.width = width + 'px';
    this.div.style.top = (-height) + 'px';
    this.div.style.left = Math.random() * (GAME_PlASE_WIDTH - width) + 'px';
    this.div.style.backgroundImage = 'url("img/' + img + '")';

    document.getElementById('gameplace').appendChild(this.div);
}

function Bullet(speed, top, left, img, height, width) {
    this.speed = speed;
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = height + 'px';
    this.div.style.width = width + 'px';
    this.div.style.top = top + 'px';
    this.div.style.left = left + 'px';
    this.div.style.backgroundImage = 'url("img/' + img + '")';

    document.getElementById('gameplace').appendChild(this.div);
}

function moveEnemies(delta) {

    for (var i = 0; i < enemies.length; i++) {

        enemies[i].div.style.top = (parseFloat(enemies[i].div.style.top, 10) + delta * enemies[i].speed) + 'px';

        if (parseFloat(enemies[i].div.style.top, 10) > GAME_PlASE_HEIGHT) {
            document.getElementById('gameplace').removeChild(enemies[i].div);
            enemies.splice(i, 1);
            i--;
        }
    }

}

function moveBullets(delta) {
    for (var i = 0; i < bullets.length; i++) {

        bullets[i].div.style.top = (parseFloat(bullets[i].div.style.top, 10) - delta * bullets[i].speed) + 'px';

        if ((parseFloat(bullets[i].div.style.top, 10) + parseFloat(bullets[i].div.style.height, 10)) < 0) {
            document.getElementById('gameplace').removeChild(bullets[i].div);
            bullets.splice(i, 1);
            i--;
        }
    }
}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    player.div.style.display = 'none';
    isGameOver = true;
}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;

    for (var i = 0; i < enemies.length; i ++) {
        document.getElementById('gameplace').removeChild(enemies[i].div);
    }
    for (var i = 0; i < bullets.length; i ++) {
        document.getElementById('gameplace').removeChild(bullets[i].div);
    }


    enemies = [];
    bullets = [];
    bonuses = [];

    player.div.style.top = (GAME_PlASE_HEIGHT - 104) / 2 + 'px';
    player.div.style.left = (GAME_PlASE_WIDTH - 72) / 2 + 'px';
    player.div.style.display = '';
};
