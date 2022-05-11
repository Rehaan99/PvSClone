const floatingMessages = [];
class FloatingMessage {
  constructor(value, x, y, size, color) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
    }
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial";
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}
function handleFloatingMessages() {
  for (let i = 0; i < floatingMessages.length; i++) {
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].lifeSpan >= 50) {
      floatingMessages.splice(i, 1);
      i--;
    }
  }

 
  
}

function handleTooltips() {

  if (displayTooltip) {
    const tooltipX = mouse.x + 5,
      tooltipY = mouse.y + 10,
      fontSize = 15,
      text = defenderTypes[currentHover].description;

    ctx.font = fontSize + "px Arial";
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";
    const tooltipParameters = wrapText(tooltipY, 200, text, fontSize);

    ctx.fillRect(
      tooltipX,
      tooltipY,
      200,
      tooltipParameters.yPos[tooltipParameters.yPos.length - 1] +
        2 * fontSize -
        tooltipY
    );

    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    for (let i = 0; i < tooltipParameters.line.length; i++) {
      ctx.fillText(
        tooltipParameters.line[i],
        tooltipX + 5,
        tooltipParameters.yPos[i]
      );
    }
  }



}
