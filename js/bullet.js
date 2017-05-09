function Bullet(speed, size, img, type) {
    Plenty.apply(this, arguments);
}
Bullet.prototype = Object.create(Plenty.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.isBoom = function (enemy) {
    let counter = 0;
    for (let i = 0; i < enemy.div.length; i++) {
        for (let j = 0; j < this.div.length; j++) {
            let x = parseFloat(enemy.div[i].style.left);
            let y = parseFloat(enemy.div[i].style.top);
            let width = parseFloat(enemy.div[i].style.width);
            let height = parseFloat(enemy.div[i].style.height);

            if (this.inField(this.div[j], {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                })) {
                this.removeDiv(j);
                this.div.splice(j, 1);
                j--;
                enemy.div[i].stability--;
                if (enemy.div[i].stability === 0) {
                    counter++;
                    enemy.removeDiv(i);
                    enemy.div.splice(i, 1)
                    i--;
                }
                break;
            }
        }
    }
    return counter;
};