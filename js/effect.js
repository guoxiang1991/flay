/**
 * Created by lenovo on 2016/7/21.
 */
function clearEffect() {
    clearTimeout(this.flyTimer);
    clearTimeout(this.dropTimer);
}
function getSpeed(e) {
    if (this.prevPosi) {
        this.speed = e.pageX - this.prevPosi;
        this.prevPosi = e.pageX;
    } else {
        this.prevPosi = e.pageX;
    }
}
function fly() {
    this.speed *= .98;
    var maxRight = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth,
        current = this.speed + this.offsetLeft;
    if (current <= 0) {
        this.style.left = 0;
        this.speed *= -1;
    } else if (current >= maxRight) {
        this.style.left = maxRight + 'px';
        this.speed *= -1;
    } else {
        this.style.left = current + 'px';
    }
    if (Math.abs(this.speed) >= 0.5) {
        this.flyTimer = setTimeout(processThis(fly, this), 25)
    }
}
function drop() {
    if (this.dropSpeed) {
        this.dropSpeed += 9.8
    } else {
        this.dropSpeed = 9.8
    }
    this.dropSpeed *= 0.98;
    var maxBottom = (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight,
        current = this.dropSpeed + this.offsetTop;
    if (current >= maxBottom) {
        this.style.top = maxBottom + 'px';
        this.dropSpeed *= -1;
        this.flag++
    } else {
        this.style.top = current + 'px';
        this.flag = 0;
    }
    if (this.flag < 2) {
        this.dropTimer = setTimeout(processThis(drop, this), 25)
    }
}