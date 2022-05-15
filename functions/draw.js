function drawHealthbar() {
    ctx.beginPath();
    ctx.rect(
        this.x + this.healthbarXOffset,
        this.y + this.healthbarYOffset,
        this.healthbarWidth * (this.health / this.maxHealth),
        this.healthbarHeight
    );
    ctx.fillStyle = calculateHealthBarColor(this.health, this.maxHealth);
    ctx.closePath();
    ctx.fill();
};
