Game.prototype = {
//Старт игры
    startGame: function () {
        var _this = this;

//Инициализируем игровые объекты
        this.objects = {
            ball: new Ball(),
            player1: new Player(),
            player2: new Player(),
            bracket1: new Bracket(),
            bracket2: new Bracket()
        };
//Меняем состояние
        this.params.state = 'game';

//Расставляем стартовые позиции ракеток
        this.objects.bracket1.x = 50;
        this.objects.bracket1.y = this.params.height / 2 - this.objects.bracket1.h / 2;

        this.objects.bracket2.x = this.params.width - 50;
        this.objects.bracket2.y = this.params.height / 2 - this.objects.bracket1.h / 2;

//Перекрасим второго игрока
        this.objects.bracket2.color = '#00FFCC';

//Запускаем игровой цикл
        this.loop();
    },

//Игровой цикл
    loop: function () {
        var _this = this;

//Логика игры
        this.logic();
//Физика игры
        this.physic();
//Рендер игры
        this.render();

//Используем замыкание для передачи контекста
        this.requestLoop = requestAnimationFrame(function(){
            _this.loop.call(_this);
        });
    },

//Логика игры
    logic: function () {

//Для краткости записи
        var ball = game.objects.ball;

//Если сейчас идет игра
        if(this.params.state == 'game') {

//И шарик оказался за первым игроком
            if (ball.x + ball.radius/2 < 0) {
//Засчтитаем гол
                this.objects.player2.rate++;
//Сменим состояние игры
                this.params.state = 'playerwait';
//Сохарним информацию о забившем
                this.params.lastGoalBracket = this.objects.bracket2;
                this.params.lastGoalPlayer = 'player2';
            }

//Шарик оказался за выторым игроком
            if (ball.x + ball.radius/2 > game.params.width) {
//Засчтитаем гол
                this.objects.player1.rate++;
//Сменим состояние игры
                this.params.state = 'playerwait';
//Сохарним информацию о забившем
                this.params.lastGoalBracket = this.objects.bracket1;
                this.params.lastGoalPlayer = 'player1';
            }

//Проверяем наличие победителя
//Если кто-то из игроков набрал необходимое количество очков
//Он выиграл
            if(this.objects.player1.rate === this.params.maxRate) {
                alert('1 игрок выиграл');
                this.gameRestart();
            }

            if(this.objects.player2.rate === this.params.maxRate) {
                alert('2 игрок выиграл');
                this.gameRestart();
            }
        }

    },

//Физика игры
    physic: function () {
//Для краткости записи
        var ball = game.objects.ball,
            b1 = game.objects.bracket1,
            b2 = game.objects.bracket2;

//Передвигаем шар
        game.objects.ball.move();

//Отскок слева
        if (ball.x + ball.radius/2 < 0) {
            game.objects.ball.xspeed = -game.objects.ball.xspeed;
        }
//Отскок Справа
        if (ball.x + ball.radius/2 > game.params.width) {
            game.objects.ball.xspeed = -game.objects.ball.xspeed;
        }
//Отскок от границ canvas по высоте
        if (ball.y + ball.radius/2 > game.params.height || ball.y + ball.radius/2 < 0) {
            game.objects.ball.yspeed = -game.objects.ball.yspeed;
        }
//Отскок шарика от 1 блока
        if(ball.x <= 60 && ball.y >= b1.y && ball.y <= b1.y+b1.h) {
            ball.xspeed = -ball.xspeed;
//Ускоряем шарик
            ball.xspeed = ball.xspeed * ball.bounce;
        }
//Отскок шарика от 2 блока
        if(ball.x >= this.params.width-50 && ball.y >= b2.y && ball.y <= b2.y+b2.h) {
            ball.xspeed = -ball.xspeed;
//Ускоряем шарик
            ball.xspeed = ball.xspeed * ball.bounce;
        }

//В состоянии ожидания пуска шарика от ракетки игрока, выставляем шарик рядом с ракеткой забившего игрока.
        if(this.params.state === 'playerwait') {
            ball.xspeed = 0;
            ball.yspeed = 0;
            if(this.params.lastGoalPlayer === 'player1') {
                ball.x = this.params.lastGoalBracket.x + this.params.lastGoalBracket.w + ball.radius + 1;
                ball.y = this.params.lastGoalBracket.y + this.params.lastGoalBracket.h/2;
            }
            if(this.params.lastGoalPlayer === 'player2') {
                ball.x = this.params.lastGoalBracket.x - ball.radius - 1;
                ball.y = this.params.lastGoalBracket.y + this.params.lastGoalBracket.h/2;
            }
        }

//Не позволяем вылезать блокам за canvas и возврщаем их на место
        if(b1.y <= 0) b1.y = 1;
        if(b2.y <= 0) b2.y = 1;
        if(b1.y+b1.h >= this.params.height) b1.y = this.params.height-b1.h;
        if(b2.y+b2.h >= this.params.height) b2.y = this.params.height-b2.h;
    },

//Рендер игры
    render: function () {
//Чистим канвас на каждом кадре
        game.ctx.fillStyle = '#eeeeee';
        game.ctx.fillRect(0,0, game.params.width, game.params.height);

//Рендерим шарик
        game.objects.ball.render(game.ctx);
        game.objects.bracket1.render(game.ctx);
        game.objects.bracket2.render(game.ctx);
        game.renderRate(game.ctx);
    },

//Показываем счет игры
    renderRate: function (ctx) {
        var rateText = game.objects.player1.rate + ' : ' + game.objects.player2.rate;
        ctx.fillStyle = '#000000';
        ctx.font = "20px Arial";
        ctx.fillText(rateText,game.params.width/2,50);
    },

//Инициализация игровых событий
    keyDownEvent: function (event) {
        var kCode = event.keyCode;
//1-вверх
        if(kCode === 49) {
            game.objects.bracket1.y = game.objects.bracket1.y + game.objects.bracket1.speed;
        }
//2-вниз
        if(kCode === 50) {
            game.objects.bracket1.y = game.objects.bracket1.y - game.objects.bracket1.speed;
        }
//9-вверх
        if(kCode === 57) {
            game.objects.bracket2.y = game.objects.bracket2.y + game.objects.bracket2.speed;
        }
//0-вниз
        if(kCode === 48) {
            game.objects.bracket2.y = game.objects.bracket2.y - game.objects.bracket2.speed;
        }
//E - рестарт шарика
        if(kCode === 69) {
            this.restartBall();
        }
//R - рестарт игры
        if(kCode === 82) {
            this.restartGame();
        }
//Пробел - пуск шарика
        if(kCode === 32 && game.params.state === 'playerwait') {
            this.kickBall();
        }
    },

//Пуск шарика после гола
    kickBall: function () {
        this.objects.ball.xspeed = 3;
        this.objects.ball.yspeed = 3;
        this.params.state = 'game';
    },
//Стоп игра
    stopGame: function () {
//Обновляем состояние
        this.params.state = 'stop';
//Останавливаем цикл
        cancelAnimationFrame(this.requestLoop);

//Убираем слушателей событий
        document.removeEventListener('keydown', this.keyDownEvent);

//Чистим игровые объекты
        delete(this.objects);
    },

    pauseGame: function () {
        this.state = 'pause';
    },

//Рестарт шарика
    restartBall: function () {
        this.objects.ball.x = game.params.width/2;
        this.objects.ball.y = game.params.height/2;
        this.objects.ball.xspeed = 3;
        this.objects.ball.yspeed = 3;
    },

//Рестарт игры
    restartGame: function () {
        this.stopGame();
        this.startGame();
    }
};