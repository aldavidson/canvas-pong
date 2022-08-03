class Renderer {

  constructor(params={}) {
    this.context = params.context;
    this.canvas  = params.canvas;
  }

  drawBox(box) {
    this.context.fillStyle = box.color;
    this.context.fillRect(box.position.x, box.position.y, box.width, box.height);
  }
  
  drawBoard() {
    // midline
    this.drawBox( new Box({ 
      x: (this.canvas.width/2) - 2.5,
      y: -1,
      width: 5,
      height: canvas.height+1,
      color: '#FFFFFF'
    }) );
  }
  
  drawPlayers(player1, player2) {
    // player 1
    this.drawBox( new Box({
      position: player1.position,
      width: 15,
      height: 80,
      color: '#FFFFFF',
    }) );
  
    // player 2
    this.drawBox( new Box({
      position: player2.position,
      width: 15,
      height: 80,
      color: '#FFFFFF',
    }) );
  }
  
  drawScores(score1, score2) {
    this.context.font = "20px Arial";
    this.context.fillStyle = "rgb(255,255,255)";
    // player 1
    this.context.fillText(score1, (this.canvas.width/2) - 50, 20);
    // player 2
    this.context.fillText(score2, (this.canvas.width/2) + 50, 20);
  }
  
  drawBall(ball) {
    this.drawBox( new Box({
      position: ball.position,
      width: ball.width,
      height: ball.height,
      color: '#FFFFFF',
    }) );
  }
};