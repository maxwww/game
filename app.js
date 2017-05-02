var canvasBlock = document.getElementById('starwar');

var ctx = canvasBlock.getContext('2d');
var start_time = new Date();
var last_time = 0;


var obstacles = [];
var o_speed = 1;

var bullets = [];
var b_speed = 10;

var x = 430;
var y = 500;

var xspeed = 10;
var yspeed = 10;

var rate = 0;


function move() {

    for (var k = 0; k < obstacles.length; k++) {
        obstacles[k].y = obstacles[k].y + o_speed;
    }

    for (var j = 0; j < bullets.length; j++) {
        bullets[j].y = bullets[j].y - b_speed;
        bullets[j].x = bullets[j].x + bullets[j].p;
    }
}

var image = new Image();
image.src = 'ship1.png';
image.onload = function () {
    ctx.drawImage(image, x, image);
};

function render() {
    //ctx.fillStyle = '#eeeeee';
    //ctx.fillRect(0, 0, 960, 600);
    ctx.clearRect(0, 0, 960, 800);
    //ctx.beginPath();
    //ctx.arc(x, y, 20, 0, 2 * Math.PI);
    //ctx.fillStyle = '#fff';
    //ctx.fill();

    for (var k = 0; k < obstacles.length; k++) {
        ctx.beginPath();
        ctx.arc(obstacles[k].x, obstacles[k].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    for (var j = 0; j < bullets.length; j++) {
        ctx.beginPath();
        ctx.arc(bullets[j].x, bullets[j].y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    ctx.drawImage(image, x, y);
}

function physic() {
    if (x + 100 >= 960) {
        xspeed = -10;
    }
    if (x <= 0) {
        xspeed = 10;
    }

    if (y + 154 >= 800) {
        yspeed = -10;
    }
    if (y <= 0) {
        yspeed = 10;
    }
}


document.addEventListener('keydown', function (event) {
    var kCode = event.keyCode;
    if (kCode == 37 || kCode == 65) {
        x = x - 15;
    } else if (kCode == 39 || kCode == 68) {
        x = x + 15;
    } else if (kCode == 38 || kCode == 87) {
        y = y - 15;
    } else if (kCode == 40 || kCode == 83) {
        y = y + 15;
    } else if (kCode == 32) {
        bullets.push({x: x + 50, y: y, p:0});
        bullets.push({x: x + 50, y: y, p:5});
        bullets.push({x: x + 50, y: y, p:-5});
    }

});

function logic() {
    if (x <= 0) {
        x = 0;
    }
    if (x + 100 >= 960) {
        x = 960 - 100;
    }

    if (y <= 0) {
        y = 0;
    }
    if (y + 154 >= 800) {
        y = 800 - 154;
    }

    var sec = new Date() - start_time;
    sec = Math.round(sec / 1000);

    if (sec % 1 == 0 && sec > last_time) {
        let x1 = Math.round(getRandomArbitrary(20, 940));
        let x2 = Math.round(getRandomArbitrary(20, 940));
        let x3 = Math.round(getRandomArbitrary(20, 940));
        let y1 = -20;
        let y2 = -40;
        let y3 = -60;
        obstacles.push({x: x1, y: y1});
        obstacles.push({x: x2, y: y2});
        obstacles.push({x: x3, y: y3});
        last_time = sec;
    }
    label:
    for (var i = 0; i < obstacles.length; i++) {

        for (var h = 0; h < bullets.length; h++) {
            if (
                (bullets[h].x + 10 > obstacles[i].x - 20) &&
                ( bullets[h].x - 10 < obstacles[i].x + 20) &&
                ( bullets[h].y - 10 < obstacles[i].y + 20) &&
                (bullets[h].y + 10 > obstacles[i].y - 20)
            ) {
                rate++;
                bullets.splice(h, 1);
                obstacles.splice(i, 1);
                i--;
                continue label;


            }
        }

        if ((obstacles[i].x + 20) > x
            && (obstacles[i].x - 20) < x + 100
            && (obstacles[i].y + 20) > y
            && (obstacles[i].y - 20) < y + 154
        ) {
            cancelAnimationFrame(window.requestLoop);
            alert("Came over! You have " + rate + " points.")
        }
        if (obstacles[i].y > 820) {
            obstacles.splice(i, 1);
            i--;
        }
    }

    for (var j = 0; j < bullets.length; j++) {
        if (bullets[j].y < -10) {
            bullets.splice(j, 1);
            j--;
        }
    }

}

//var timerId =

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function loop() {
    window.requestLoop = window.requestAnimationFrame(loop);
    //physic();
    logic();
    render();
    move();
}

window.requestLoop = window.requestAnimationFrame(loop);

