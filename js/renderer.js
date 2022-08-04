class Renderer {

  constructor(params={}) {
    this.context = params.context;
    this.canvas  = params.canvas;
    this.document= params.document || this.canvas.getRootNode();
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

  drawGameOverSplash(game) {
    this.drawBox( new Box({
      position: new Vector2d( {x: (this.canvas.width / 2) - 250, y: (this.canvas.height / 2) - 100} ),
      width: 500,
      height: 200,
      color: '#333333',
    }) );

    this.context.font = "30px Courier New, Terminal";
    this.context.fillStyle = "rgb(255,255,255)";
    this.context.fillText('GAME OVER', (this.canvas.width/2) - 85, (this.canvas.height / 2) - 50);
    
    this.context.font = '20px Courier New, Terminal';
    var winner_string = (game.winner() ? game.winner().name : 'no-one') + ' WINS!';
    this.context.fillText(winner_string, (this.canvas.width/2) - winner_string.length * 0.5 * 12, (this.canvas.height/2));
  
    var btn = this.document.createElement('button');
    btn.innerText = 'Play again';
    btn.id = 'btn-play-again';
    btn.style = 'position: absolute; left: 320px; top: 320px;';
    btn.addEventListener('click', function (e) {
      this.canvas.getRootNode().getElementById('btn-play-again').remove();
      this.restart();
    }.bind(game));
    this.canvas.parentElement.appendChild(btn);
  }
};