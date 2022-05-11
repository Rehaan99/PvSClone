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

  handleTooltips();
  
}

function handleTooltips() {

  // Displaying tooltips of defender informations...
  if (displayTooltip) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";
    ctx.fillRect(mouse.x + 5, mouse.y + 10, 200, 200);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(
      defenderTypes[currentHover].description,
      mouse.x + 10,
      mouse.y + 35
    );
  }
  
}
