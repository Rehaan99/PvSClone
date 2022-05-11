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
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    
    //wrapping rectangle to match text
    const maxWidth = 250;
    const lineHeight = 17;
    const tooltipMessage = defenderTypes[currentHover].description;
    const words = tooltipMessage.split(" ");
    const incrementFactor = 5; // adds this many pixels to rect for each word
    const wordCount = words.length; // define the word count
    const rectHeight =  wordCount*incrementFactor;
    ctx.fillRect(mouse.x + 5, mouse.y + 10, maxWidth, rectHeight);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    drawText(mouse.x + 10, mouse.y + 35, tooltipMessage, maxWidth, lineHeight )
  
  }
}

  //Helper function to print text on to the canvas
  function drawText(x, y, message, maxWidth, lineHeight, words = null){

    if(!words){
      words = message.split(" ");
    }    
    line = '';
    // Checking if the lines needs to be broken to fit the text inside the maxWidth
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' '; // Appending next word in the message to the current line 
      var testLineMatrics = ctx.measureText(testLine);
      var testLineWidth = testLineMatrics.width;
      if (testLineWidth > maxWidth && n > 0) { // if testLine's width is bigger than maxWidth
          ctx.fillText(line, x, y);//draw the line without the next word
          line = words[n] + ' '; //clear and set the next word to the 'line'
          y += lineHeight; //increase the y of the next line by the line height
      } else {
          line = testLine;
      }
  
    ctx.fillText(line, x, y);


  }

}
